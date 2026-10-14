import {
	bytesToHex,
	consensusIdenticalAggregation,
	type CronPayload,
	cre,
	getNetwork,
	type Runtime,
	TxStatus,
} from '@chainlink/cre-sdk'
import { type Address, encodeAbiParameters, type Hex, keccak256, parseAbiParameters, toHex, zeroAddress } from 'viem'
import { z } from 'zod'
import { type DecodedLog, type DrawdownRequestedDecoded, LoanFacility } from '../contracts/evm/ts/generated/LoanFacility'
import { StatusRegistry } from '../contracts/evm/ts/generated/StatusRegistry'
import {
	type CompaniesHouseResult,
	crossCheck,
	fetchCompaniesHouse,
	fetchGazette,
	fetchGleif,
	type GazetteResult,
	type GleifResult,
	normalizeCompanyNumber,
	SRC_COMPANIES_HOUSE,
	SRC_GAZETTE,
	SRC_GLEIF,
} from './sources'

export const configSchema = z.object({
	schedule: z.string(),
	chainSelectorName: z.string(),
	registryAddress: z.string(),
	facilityAddress: z.string(),
	gasLimit: z.string(),
	maxAgeSeconds: z.number().int().positive(),
	maxEntitiesPerRun: z.number().int().min(1).max(2),
	maxNoticeConfirmations: z.number().int().min(1).max(4),
	gazetteBaseUrl: z.string(),
	companiesHouseBaseUrl: z.string(),
	gleifBaseUrl: z.string(),
	companiesHouseSecretId: z.string(),
	/** Used only when registryAddress is the zero address: check these entities and log the report without writing. */
	previewEntities: z.array(z.object({ companyNumber: z.string(), lei: z.string() })).default([]),
})

export type Config = z.infer<typeof configSchema>

export interface Entity {
	entityId: Hex
	companyNumber: string
	lei: string
}

export interface CheckResult {
	entity: Entity
	checkedAt: number
	validUntil: number
	eventBits: number
	unavailableBits: number
	chUpdatedAt: number
	gazetteUpdatedAt: number
	gleifUpdatedAt: number
	petitionPresentedAt: number
	petitionPublishedAt: number
	petitionCaseRef: Hex
	evidenceHash: Hex
	evidence: string
}

const REPORT_PARAMS = parseAbiParameters(
	'(bytes32 entityId, uint64 checkedAt, uint64 validUntil, uint32 eventBits, uint32 unavailableBits, uint64 chUpdatedAt, uint64 gazetteUpdatedAt, uint64 gleifUpdatedAt, uint64 petitionPresentedAt, uint64 petitionPublishedAt, bytes32 petitionCaseRef, bytes32 evidenceHash, bytes32 requestId)',
)

const ZERO_BYTES32 = `0x${'0'.repeat(64)}` as Hex

/** Must match StatusRegistry.entityIdFor: keccak256(abi.encodePacked("GB-CH:", companyNumber)). */
export const entityIdFor = (companyNumber: string): Hex => keccak256(toHex(`GB-CH:${companyNumber}`))

const hashOrZero = (s: string): Hex => (s === '' ? ZERO_BYTES32 : keccak256(toHex(s)))

const failed = <T extends { ok: boolean; error: string }>(fallback: Omit<T, 'ok' | 'error'>, err: unknown): T =>
	({ ...fallback, ok: false, error: err instanceof Error ? err.message : String(err) }) as T

// ─── Checking one entity ────────────────────────────────────────────────

/**
 * Queries every source with identical-value consensus. A source whose nodes fail or disagree is marked
 * unavailable: "could not be checked" is recorded as such and never as an adverse finding.
 */
export const checkEntity = (runtime: Runtime<Config>, entity: Entity): CheckResult => {
	const cfg = runtime.config
	const http = new cre.capabilities.HTTPClient()

	const gazette: GazetteResult = (() => {
		try {
			return http
				.sendRequest(runtime, fetchGazette, consensusIdenticalAggregation<GazetteResult>())({
					baseUrl: cfg.gazetteBaseUrl,
					companyNumber: entity.companyNumber,
					maxConfirmations: cfg.maxNoticeConfirmations,
				})
				.result()
		} catch (err) {
			return failed<GazetteResult>(
				{ eventBits: 0, updatedAt: 0, petitionPresentedAt: 0, petitionPublishedAt: 0, petitionCaseRef: '', notices: '' },
				err,
			)
		}
	})()

	const ch: CompaniesHouseResult = (() => {
		try {
			const apiKey = runtime.getSecret({ id: cfg.companiesHouseSecretId }).result().value
			return http
				.sendRequest(runtime, fetchCompaniesHouse, consensusIdenticalAggregation<CompaniesHouseResult>())({
					baseUrl: cfg.companiesHouseBaseUrl,
					companyNumber: entity.companyNumber,
					apiKey,
				})
				.result()
		} catch (err) {
			return failed<CompaniesHouseResult>({ eventBits: 0, companyStatus: '' }, err)
		}
	})()

	const gleif: GleifResult | null =
		entity.lei === ''
			? null // no LEI bound: not checked, and not "unavailable"
			: (() => {
					try {
						return http
							.sendRequest(runtime, fetchGleif, consensusIdenticalAggregation<GleifResult>())({
								baseUrl: cfg.gleifBaseUrl,
								lei: entity.lei,
							})
							.result()
					} catch (err) {
						return failed<GleifResult>(
							{ eventBits: 0, registeredAs: '', entityStatus: '', registrationStatus: '', updatedAt: 0 },
							err,
						)
					}
				})()

	let eventBits = 0
	let unavailableBits = 0
	if (gazette.ok) eventBits |= gazette.eventBits
	else unavailableBits |= 1 << SRC_GAZETTE
	if (ch.ok) eventBits |= ch.eventBits
	else unavailableBits |= 1 << SRC_COMPANIES_HOUSE
	if (gleif) {
		if (gleif.ok) eventBits |= gleif.eventBits | crossCheck(entity.companyNumber, gleif, ch)
		else unavailableBits |= 1 << SRC_GLEIF
	}

	const checkedAt = Math.floor(runtime.now().getTime() / 1000)
	// Canonical evidence: normalized per-source results only, fixed key order, no raw responses.
	const evidence = JSON.stringify({
		v: 1,
		entity: entity.companyNumber,
		checkedAt,
		gazette: { ok: gazette.ok, bits: gazette.eventBits, notices: gazette.notices },
		companiesHouse: { ok: ch.ok, bits: ch.eventBits, status: ch.companyStatus },
		gleif: gleif
			? { ok: gleif.ok, bits: gleif.eventBits, registeredAs: gleif.registeredAs, entity: gleif.entityStatus, registration: gleif.registrationStatus }
			: null,
	})

	return {
		entity,
		checkedAt,
		validUntil: checkedAt + cfg.maxAgeSeconds,
		eventBits,
		unavailableBits,
		chUpdatedAt: 0, // Companies House profile publishes no last-update time
		gazetteUpdatedAt: gazette.ok ? gazette.updatedAt : 0,
		gleifUpdatedAt: gleif?.ok ? gleif.updatedAt : 0,
		petitionPresentedAt: gazette.petitionPresentedAt,
		petitionPublishedAt: gazette.petitionPublishedAt,
		petitionCaseRef: hashOrZero(gazette.petitionCaseRef),
		evidenceHash: keccak256(toHex(evidence)),
		evidence,
	}
}

export const encodeReport = (r: CheckResult, requestId: Hex): Hex =>
	encodeAbiParameters(REPORT_PARAMS, [
		{
			entityId: r.entity.entityId,
			checkedAt: BigInt(r.checkedAt),
			validUntil: BigInt(r.validUntil),
			eventBits: r.eventBits,
			unavailableBits: r.unavailableBits,
			chUpdatedAt: BigInt(r.chUpdatedAt),
			gazetteUpdatedAt: BigInt(r.gazetteUpdatedAt),
			gleifUpdatedAt: BigInt(r.gleifUpdatedAt),
			petitionPresentedAt: BigInt(r.petitionPresentedAt),
			petitionPublishedAt: BigInt(r.petitionPublishedAt),
			petitionCaseRef: r.petitionCaseRef,
			evidenceHash: r.evidenceHash,
			requestId,
		},
	])

// ─── Writing ────────────────────────────────────────────────────────────

const evmClientFor = (cfg: Config) => {
	const network = getNetwork({ chainFamily: 'evm', chainSelectorName: cfg.chainSelectorName, isTestnet: true })
	if (!network) throw new Error(`Network not found: ${cfg.chainSelectorName}`)
	return new cre.capabilities.EVMClient(network.chainSelector.selector)
}

const isPreview = (cfg: Config) => cfg.registryAddress.toLowerCase() === zeroAddress

const attestAndWrite = (runtime: Runtime<Config>, entity: Entity, requestId: Hex): string => {
	const result = checkEntity(runtime, entity)
	runtime.log(
		`[${entity.companyNumber}] eventBits=0b${result.eventBits.toString(2)} unavailableBits=0b${result.unavailableBits.toString(2)} ` +
			`petitionPresentedAt=${result.petitionPresentedAt} petitionPublishedAt=${result.petitionPublishedAt}`,
	)
	runtime.log(`[${entity.companyNumber}] evidence ${result.evidence}`)
	runtime.log(`[${entity.companyNumber}] evidenceHash ${result.evidenceHash}`)

	const report = encodeReport(result, requestId)
	if (isPreview(runtime.config)) {
		runtime.log(`[${entity.companyNumber}] preview mode, report not written: ${report}`)
		return result.evidenceHash
	}

	const registry = new StatusRegistry(evmClientFor(runtime.config), runtime.config.registryAddress as Address)
	const resp = registry.writeReport(runtime, report, { gasLimit: runtime.config.gasLimit })
	if (resp.txStatus !== TxStatus.SUCCESS) {
		throw new Error(`Attestation write failed for ${entity.companyNumber}: ${resp.errorMessage ?? resp.txStatus}`)
	}
	const txHash = bytesToHex(resp.txHash ?? new Uint8Array(32))
	runtime.log(`[${entity.companyNumber}] attestation written, tx ${txHash}`)
	return txHash
}

// ─── Handlers ───────────────────────────────────────────────────────────

/** H2: periodic monitoring of every entity registered by a bound facility. */
export const onCron = (runtime: Runtime<Config>, _payload: CronPayload): string => {
	const cfg = runtime.config
	let entities: Entity[]
	if (isPreview(cfg)) {
		entities = cfg.previewEntities.map((e) => ({
			entityId: entityIdFor(normalizeCompanyNumber(e.companyNumber)),
			companyNumber: normalizeCompanyNumber(e.companyNumber),
			lei: e.lei,
		}))
	} else {
		const registry = new StatusRegistry(evmClientFor(cfg), cfg.registryAddress as Address)
		const [ids, numbers, leis] = registry.getMonitored(runtime)
		entities = ids.map((entityId, i) => ({ entityId, companyNumber: numbers[i], lei: leis[i] }))
	}
	runtime.log(`Monitoring ${entities.length} entities, up to ${cfg.maxEntitiesPerRun} this run`)

	const results = entities.slice(0, cfg.maxEntitiesPerRun).map((e) => attestAndWrite(runtime, e, ZERO_BYTES32))
	return results.join(',')
}

/** H3: a borrower asked to draw funds; check now so the facility can decide on fresh evidence. */
export const onDrawdownRequested = (runtime: Runtime<Config>, log: DecodedLog<DrawdownRequestedDecoded>): string => {
	const { drawdownId, requestId, entityId, companyNumber, lei, amount } = log.data
	runtime.log(`DrawdownRequested #${drawdownId} for ${companyNumber}, amount ${amount}`)
	return attestAndWrite(runtime, { entityId, companyNumber, lei }, requestId)
}

export function initWorkflow(config: Config) {
	const cron = cre.handler(new cre.capabilities.CronCapability().trigger({ schedule: config.schedule }), onCron)
	if (config.facilityAddress.toLowerCase() === zeroAddress) return [cron]
	const facility = new LoanFacility(evmClientFor(config), config.facilityAddress as Address)
	return [cron, cre.handler(facility.logTriggerDrawdownRequested(), onDrawdownRequested)]
}

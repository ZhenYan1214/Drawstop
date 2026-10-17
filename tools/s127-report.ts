// s.127 statement for an insolvency office-holder, rebuilt entirely from on-chain events.
//
// After a winding-up order, the liquidator must find dispositions of the company's property made after the petition
// was presented (Insolvency Act 1986 s.127, with s.129(2)). For a tokenized facility those are on-chain repayments.
// This tool lists them with block times and transaction hashes, splits them into "reached the lender" and "held in
// suspense", and records what happened to the suspense. It states facts only: whether a payment is void, or should be
// validated, is for the court. Anyone can rerun it against the chain and get the same statement.
//
//   bun tools/s127-report.ts <facility> [rpcUrl] [fromBlock] > statement.md

import { createPublicClient, formatUnits, http, parseAbiItem, type Address } from '../status-monitor/node_modules/viem'

const [facility, rpcUrl = 'https://ethereum-sepolia-rpc.publicnode.com', fromArg] = process.argv.slice(2) as [Address, string?, string?]
if (!facility) throw new Error('usage: s127-report.ts <facility> [rpcUrl] [fromBlock]')
const client = createPublicClient({ transport: http(rpcUrl) })

const facilityAbi = [
	parseAbiItem('function registry() view returns (address)'),
	parseAbiItem('function entityId() view returns (bytes32)'),
	parseAbiItem('function token() view returns (address)'),
	parseAbiItem('function lender() view returns (address)'),
	parseAbiItem('function borrower() view returns (address)'),
	parseAbiItem('function arbiter() view returns (address)'),
	parseAbiItem('function suspenseBalance() view returns (uint256)'),
	parseAbiItem('function status() view returns (uint8)'),
] as const
const registryAbi = [
	parseAbiItem('function getEntity(bytes32) view returns ((string companyNumber, string lei, bool monitored))'),
	parseAbiItem(
		'function getLatest(bytes32) view returns ((uint256 id, uint64 checkedAt, uint64 validUntil, uint32 eventBits, uint32 unavailableBits, uint32 activeBits, uint64 chUpdatedAt, uint64 gazetteUpdatedAt, uint64 gleifUpdatedAt, uint64 petitionPresentedAt, uint64 petitionPublishedAt, bytes32 petitionCaseRef, bytes32 evidenceHash, bytes32 requestId))',
	),
] as const
const ev = {
	repaid: parseAbiItem('event Repaid(uint256 indexed repaymentId, uint256 amount, bool heldInSuspense, uint8 status)'),
	released: parseAbiItem('event SuspenseReleased(address indexed to, uint256 amount, bytes32 reasonHash, address by)'),
	nominated: parseAbiItem('event OfficeHolderNominated(address indexed officeHolder, uint64 effectiveAt, bytes32 evidenceHash)'),
	drawn: parseAbiItem('event DrawdownExecuted(uint256 indexed drawdownId, uint256 attestationId, uint256 amount)'),
}
const STATUS = ['UNBOUND', 'STALE', 'UNVERIFIED', 'PETITION_PENDING', 'REVIEW_REQUIRED', 'WATCH', 'NORMAL', 'DEFAULTED']

const read = <T>(address: Address, abi: readonly unknown[], functionName: string, args: unknown[] = []) =>
	client.readContract({ address, abi: abi as never, functionName: functionName as never, args: args as never }) as Promise<T>

const [registry, entityId, token, lender, borrower, arbiter, suspense, statusCode] = await Promise.all([
	read<Address>(facility, facilityAbi, 'registry'),
	read<`0x${string}`>(facility, facilityAbi, 'entityId'),
	read<Address>(facility, facilityAbi, 'token'),
	read<Address>(facility, facilityAbi, 'lender'),
	read<Address>(facility, facilityAbi, 'borrower'),
	read<Address>(facility, facilityAbi, 'arbiter'),
	read<bigint>(facility, facilityAbi, 'suspenseBalance'),
	read<number>(facility, facilityAbi, 'status'),
])
const [entity, latest] = await Promise.all([
	read<{ companyNumber: string; lei: string }>(registry, registryAbi, 'getEntity', [entityId]),
	read<{ id: bigint; checkedAt: bigint; activeBits: number; petitionPresentedAt: bigint; petitionPublishedAt: bigint; petitionCaseRef: string; evidenceHash: string }>(
		registry,
		registryAbi,
		'getLatest',
		[entityId],
	),
])
const decimals = Number(await client.readContract({ address: token, abi: [parseAbiItem('function decimals() view returns (uint8)')], functionName: 'decimals' }))

const fromBlock = fromArg ? BigInt(fromArg) : (await client.getBlockNumber()) - 49_000n
const logs = async <E extends (typeof ev)[keyof typeof ev]>(event: E) => client.getLogs({ address: facility, event, fromBlock, toBlock: 'latest' })
const [repaid, released, nominated, drawn] = await Promise.all([logs(ev.repaid), logs(ev.released), logs(ev.nominated), logs(ev.drawn)])

const blockTimes = new Map<bigint, number>()
const timeOf = async (bn: bigint) => {
	if (!blockTimes.has(bn)) blockTimes.set(bn, Number((await client.getBlock({ blockNumber: bn })).timestamp))
	return blockTimes.get(bn)!
}
const iso = (t: number | bigint) => (Number(t) === 0 ? '—' : new Date(Number(t) * 1000).toISOString().replace('.000Z', 'Z'))
const amt = (v: bigint) => formatUnits(v, decimals)

const presentedAt = Number(latest.petitionPresentedAt)
const proceeding = (latest.activeBits & ((1 << 0) | (1 << 3))) !== 0
const petition = (latest.activeBits & (1 << 2)) !== 0

const rows = await Promise.all(
	repaid.map(async (l) => ({ id: l.args.repaymentId!, amount: l.args.amount!, held: l.args.heldInSuspense!, status: l.args.status!, tx: l.transactionHash, at: await timeOf(l.blockNumber) })),
)
const after = rows.filter((r) => presentedAt !== 0 && r.at >= presentedAt)
const toLender = after.filter((r) => !r.held)
const held = after.filter((r) => r.held)
const sum = (xs: { amount: bigint }[]) => xs.reduce((s, x) => s + x.amount, 0n)
// Suspense released to the lender after presentation also reached the lender after commencement, e.g. when an
// earlier petition was dismissed while this one had already been presented but not yet advertised.
const releases = await Promise.all(released.map(async (r) => ({ to: r.args.to!, amount: r.args.amount!, at: await timeOf(r.blockNumber), tx: r.transactionHash })))
const releasedToLenderAfter = releases.filter((r) => r.to === lender && presentedAt !== 0 && r.at >= presentedAt)

const out: string[] = []
out.push(`# s.127 statement: payments after presentation of the petition`)
out.push('')
out.push(`Generated ${iso(Math.floor(Date.now() / 1000))} from on-chain events only (chain id ${await client.getChainId()}, blocks ${fromBlock}–latest). Facts, not legal conclusions: whether any payment is void under s.127, or should be validated, is for the court.`)
out.push('')
out.push(`## Facility`)
out.push('')
out.push(`| | |`)
out.push(`|---|---|`)
out.push(`| Company number | ${entity.companyNumber}${entity.lei ? ` (LEI ${entity.lei})` : ''} |`)
out.push(`| Facility | \`${facility}\` |`)
out.push(`| Payer (borrower wallet) | \`${borrower}\` |`)
out.push(`| Lender | \`${lender}\` |`)
out.push(`| Arbiter | \`${arbiter}\` |`)
out.push(`| Token | \`${token}\` |`)
out.push(`| Facility status now | ${STATUS[statusCode]} |`)
out.push('')
out.push(`## Commencement`)
out.push('')
out.push(`| | |`)
out.push(`|---|---|`)
out.push(`| Petition presented (s.129(2) commencement) | ${iso(presentedAt)} |`)
out.push(`| Petition advertised in The Gazette | ${iso(latest.petitionPublishedAt)} |`)
out.push(`| Court case reference (hash) | \`${latest.petitionCaseRef}\` |`)
out.push(`| Latest attestation | #${latest.id}, checked ${iso(latest.checkedAt)}, evidence \`${latest.evidenceHash}\` |`)
out.push(`| Known now | ${proceeding ? 'winding-up order, resolution, appointment or adverse registry status' : petition ? 'petition pending' : 'no petition or proceeding'} |`)
out.push('')
if (presentedAt === 0) {
	out.push('No presentation date is recorded, so no payments can be placed after commencement.')
} else {
	out.push(`## Payments after presentation`)
	out.push('')
	out.push(`| # | Time (UTC) | Amount | Where it went | Facility status at payment | Transaction |`)
	out.push(`|---|---|---|---|---|---|`)
	for (const r of after) {
		out.push(`| ${r.id} | ${iso(r.at)} | ${amt(r.amount)} | ${r.held ? 'held in suspense' : '**passed to the lender**'} | ${STATUS[r.status]} | \`${r.tx}\` |`)
	}
	out.push('')
	out.push(`| Summary | Amount |`)
	out.push(`|---|---|`)
	out.push(`| All payments after presentation | ${amt(sum(after))} (${after.length}) |`)
	out.push(`| Passed straight to the lender | ${amt(sum(toLender))} (${toLender.length}) |`)
	out.push(`| Held in suspense when paid | ${amt(sum(held))} (${held.length}) |`)
	out.push(`| Released from suspense to the lender after presentation | ${amt(sum(releasedToLenderAfter))} (${releasedToLenderAfter.length}) |`)
	out.push(`| **Reached the lender after presentation** | **${amt(sum(toLender) + sum(releasedToLenderAfter))}** |`)
	out.push(`| Suspense still held by the facility now | ${amt(suspense)} |`)
	if (releasedToLenderAfter.length) {
		out.push('')
		out.push(`Suspense was released to the lender after this petition was presented (typically after an earlier petition was dismissed while this one was not yet advertised). A dismissal clears only its own petition. The facility's on-chain \`repaidSincePetitionPresented()\` counts direct pass-throughs only; this statement is the complete figure.`)
	}
	out.push('')
	out.push(`Payments before presentation (${rows.length - after.length}, ${amt(sum(rows.filter((r) => !after.includes(r))))}) are outside s.127 and not listed.`)
}
out.push('')
out.push(`## Suspense movements`)
out.push('')
if (nominated.length) {
	for (const n of nominated) out.push(`- Office-holder \`${n.args.officeHolder}\` nominated, effective ${iso(n.args.effectiveAt!)}, evidence \`${n.args.evidenceHash}\` (tx \`${n.transactionHash}\`)`)
}
for (const r of released) {
	const who = r.args.to === lender ? 'lender' : r.args.to === borrower ? 'borrower' : 'office-holder'
	out.push(`- ${iso(await timeOf(r.blockNumber))}: ${amt(r.args.amount!)} paid to the ${who} \`${r.args.to}\`, reason \`${r.args.reasonHash}\` (tx \`${r.transactionHash}\`)`)
}
if (!nominated.length && !released.length) out.push('- none')
out.push('')
out.push(`Drawdowns executed in the same range: ${drawn.length} (${amt(drawn.reduce((s, d) => s + d.args.amount!, 0n))}); new advances are not dispositions of the company's property (*Coutts & Co v Stock* [2000]) and are listed for context only.`)
console.log(out.join('\n'))

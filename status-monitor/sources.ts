// Fetch-and-normalize functions for the three public sources. Each runs in node mode (once per DON node) and
// returns only enums, integers and short strings, so that identical-value consensus is meaningful. Raw responses
// never leave the node: their volatile fields would make nodes disagree, and some contain personal data.

import type { HTTPSendRequester } from '@chainlink/cre-sdk'

// ─── Event bits and source indexes (mirror StatusRegistry.sol) ───────────────

export const EV_CH_STATUS_ADVERSE = 1 << 0
export const EV_CH_INSOLVENCY_HISTORY = 1 << 1
export const EV_GZ_PETITION_PENDING = 1 << 2
export const EV_GZ_INSOLVENCY_PROCEEDING = 1 << 3
export const EV_GZ_PETITION_DISMISSED = 1 << 4
export const EV_GLEIF_LEI_LAPSED = 1 << 5
export const EV_SOURCE_CONFLICT = 1 << 6

export const SRC_COMPANIES_HOUSE = 0
export const SRC_GAZETTE = 1
export const SRC_GLEIF = 2

// ─── Gazette notice codes (verified against live notices, 2026-10-14) ─────────

export const PETITION_CODES = ['2450', '2451'] // Petitions to Wind Up (Companies); 2451 not yet observed
export const DISMISSAL_CODES = ['2461'] // Dismissal of Winding Up Petition
export const PROCEEDING_CODES = [
	'2452', // Winding-Up Orders
	'2431', // Resolutions for Winding-up
	'2441', // Resolutions for Winding-up
	'2432', // Appointment of Liquidators
	'2443', // Appointment of Liquidators
	'2454', // Appointment of Liquidators
	'2410', // Appointment of Administrators
]
const RELEVANT_CODES = [...PETITION_CODES, ...DISMISSAL_CODES, ...PROCEEDING_CODES]

// Companies House company_status values that indicate an insolvency or end of existence.
export const CH_ADVERSE_STATUSES = [
	'liquidation',
	'administration',
	'receivership',
	'insolvency-proceedings',
	'voluntary-arrangement',
	'dissolved',
	'converted-closed',
]

// ─── Helpers ──────────────────────────────────────────────────────────────

const first = <T>(v: T | T[] | undefined): T | undefined => (Array.isArray(v) ? v[0] : v)
const toArray = <T>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v])

const readJson = (body: Uint8Array): any => JSON.parse(Buffer.from(body).toString('utf-8'))

/** UK company numbers are 8 characters, zero-padded when numeric (e.g. "00445790", "SC123456"). */
export const normalizeCompanyNumber = (n: string): string => {
	const s = n.trim().toUpperCase()
	return /^\d+$/.test(s) ? s.padStart(8, '0') : s
}

const MONTHS: Record<string, number> = {
	Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

/**
 * Parses the date formats used by the sources into unix seconds, without relying on the runtime's Date parser:
 *   "2026-08-11T00:00:00+00:00", "2026-08-11", "2025-11-21T07:42:21Z", "Tuesday, 29-Sep-2026 09:30:08 UTC".
 * Returns 0 when absent or unparseable.
 */
export const parseTimestamp = (raw: unknown): number => {
	const s = first(raw as string | string[])
	if (typeof s !== 'string') return 0
	let m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2}))?/)
	if (m) {
		const [, y, mo, d, h = '0', mi = '0', se = '0'] = m
		return Date.UTC(+y, +mo - 1, +d, +h, +mi, +se) / 1000
	}
	m = s.match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/)
	if (m && MONTHS[m[2]] !== undefined) {
		return Date.UTC(+m[3], MONTHS[m[2]], +m[1], +m[4], +m[5], +m[6]) / 1000
	}
	return 0
}

/** "CR-2026-006286" + "2026" and "006286" + "2026" both become "2026/006286". */
export const normalizeCaseRef = (caseNumber: unknown, caseYear: unknown): string => {
	const num = first(caseNumber as string | string[])
	const year = first(caseYear as string | string[])
	if (typeof num !== 'string') return ''
	const digits = num.match(/(\d+)\s*$/)?.[1]
	if (!digits) return ''
	const y = typeof year === 'string' && /^\d{4}$/.test(year) ? year : num.match(/\b(\d{4})\b/)?.[1] ?? ''
	return `${y}/${digits.replace(/^0+/, '').padStart(6, '0')}`
}

// ─── Gazette ──────────────────────────────────────────────────────────────

export interface GazetteNotice {
	id: string
	code: string
	publishedAt: number
	presentedAt: number // petition presentation date (2450: dateOfPetitionPresentation, 2452: datePetitionFiled)
	caseRef: string
}

export interface GazetteResult {
	ok: boolean
	eventBits: number
	updatedAt: number // publication time of the newest confirmed notice, 0 = none
	petitionPresentedAt: number
	petitionPublishedAt: number
	petitionCaseRef: string
	notices: string // canonical "code:id:caseRef" list, evidence only
	error: string
}

export interface GazetteArgs {
	baseUrl: string
	companyNumber: string
	maxConfirmations: number
}

const noticeIdFrom = (entryId: string): string => entryId.match(/(\d+)\s*$/)?.[1] ?? ''

/** Reads one notice's linked data and returns it only if it is about this company number. */
export const parseNotice = (json: any, companyNumber: string): GazetteNotice | null => {
	const t = json?.result?.primaryTopic
	if (!t) return null
	const about = first(t.isAbout) ?? {}
	const companies = toArray<any>(about.company)
	const target = normalizeCompanyNumber(companyNumber)
	if (!companies.some((c) => typeof first(c?.companyNumber) === 'string' && normalizeCompanyNumber(first(c.companyNumber)) === target)) {
		return null
	}
	const courtCase = first(about.hasCourtCase) ?? {}
	return {
		id: String(first(t.hasNoticeID) ?? ''),
		code: String(first(t.hasNoticeCode) ?? ''),
		publishedAt: parseTimestamp(t.hasPublicationDate),
		presentedAt: parseTimestamp(about.dateOfPetitionPresentation ?? about.datePetitionFiled),
		caseRef: normalizeCaseRef(courtCase.caseNumber, courtCase.caseYear),
	}
}

/**
 * Pairs notices of the same proceeding. Same court case reference, or (when a notice has none) the same
 * petition presentation date.
 */
const sameProceeding = (a: GazetteNotice, b: GazetteNotice): boolean =>
	(a.caseRef !== '' && a.caseRef === b.caseRef) ||
	(a.presentedAt !== 0 && a.presentedAt === b.presentedAt && (a.caseRef === '' || b.caseRef === ''))

/** Turns confirmed notices into event bits and the details of the earliest still-pending petition. */
export const classifyNotices = (notices: GazetteNotice[]): Omit<GazetteResult, 'ok' | 'error'> => {
	let eventBits = 0
	let pending: GazetteNotice | null = null
	for (const n of notices) {
		if (PROCEEDING_CODES.includes(n.code)) eventBits |= EV_GZ_INSOLVENCY_PROCEEDING
		if (!PETITION_CODES.includes(n.code)) continue
		const resolvedBy = notices.find(
			(o) => o !== n && (DISMISSAL_CODES.includes(o.code) || o.code === '2452') && sameProceeding(n, o),
		)
		if (resolvedBy && DISMISSAL_CODES.includes(resolvedBy.code)) eventBits |= EV_GZ_PETITION_DISMISSED
		if (resolvedBy) continue // dismissed, or superseded by a winding-up order (already a proceeding)
		if (!pending || n.presentedAt < pending.presentedAt) pending = n
	}
	if (pending) eventBits |= EV_GZ_PETITION_PENDING
	const sorted = [...notices].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
	return {
		eventBits,
		updatedAt: notices.reduce((max, n) => Math.max(max, n.publishedAt), 0),
		petitionPresentedAt: pending?.presentedAt ?? 0,
		petitionPublishedAt: pending?.publishedAt ?? 0,
		petitionCaseRef: pending?.caseRef ?? '',
		notices: sorted.map((n) => `${n.code}:${n.id}:${n.caseRef}`).join(','),
	}
}

/**
 * Searches the corporate-insolvency category for the company number, then confirms the newest relevant notices
 * against their linked data (the text search alone can match other notices that mention the number).
 * HTTP calls: 1 + min(relevant notices, maxConfirmations).
 */
export const fetchGazette = (sendRequester: HTTPSendRequester, args: GazetteArgs): GazetteResult => {
	const number = normalizeCompanyNumber(args.companyNumber)
	const searchUrl =
		`${args.baseUrl}/insolvency/notice/data.json?results-page-size=20&categorycode=G205010000&text=${encodeURIComponent(number)}`
	const search = sendRequester.sendRequest({ url: searchUrl, method: 'GET' }).result()
	if (search.statusCode !== 200) throw new Error(`Gazette search HTTP ${search.statusCode}`)

	const entries = toArray<any>(readJson(search.body).entry)
		.filter((e) => RELEVANT_CODES.includes(String(e['f:notice-code'])))
		.map((e) => noticeIdFrom(String(e.id)))
		.filter((id) => id !== '')
		.sort((a, b) => Number(b) - Number(a)) // newest first (notice IDs are sequential)
		.slice(0, args.maxConfirmations)

	const notices: GazetteNotice[] = []
	for (const id of entries) {
		const res = sendRequester
			.sendRequest({ url: `${args.baseUrl}/notice/${id}/data.json?view=linked-data`, method: 'GET' })
			.result()
		if (res.statusCode !== 200) throw new Error(`Gazette notice ${id} HTTP ${res.statusCode}`)
		const notice = parseNotice(readJson(res.body), number)
		if (notice) notices.push(notice)
	}
	return { ok: true, error: '', ...classifyNotices(notices) }
}

// ─── Companies House ──────────────────────────────────────────────────────

export interface CompaniesHouseResult {
	ok: boolean
	eventBits: number
	companyStatus: string
	error: string
}

export interface CompaniesHouseArgs {
	baseUrl: string
	companyNumber: string
	apiKey: string
}

export const classifyCompanyProfile = (profile: any): Omit<CompaniesHouseResult, 'ok' | 'error'> => {
	const status = String(profile?.company_status ?? '')
	let eventBits = 0
	if (CH_ADVERSE_STATUSES.includes(status)) eventBits |= EV_CH_STATUS_ADVERSE
	if (profile?.has_insolvency_history === true) eventBits |= EV_CH_INSOLVENCY_HISTORY
	return { eventBits, companyStatus: status }
}

/** One HTTP call. Basic auth with the API key as username and an empty password. */
export const fetchCompaniesHouse = (sendRequester: HTTPSendRequester, args: CompaniesHouseArgs): CompaniesHouseResult => {
	const number = normalizeCompanyNumber(args.companyNumber)
	const res = sendRequester
		.sendRequest({
			url: `${args.baseUrl}/company/${encodeURIComponent(number)}`,
			method: 'GET',
			headers: { Authorization: `Basic ${Buffer.from(`${args.apiKey}:`).toString('base64')}` },
		})
		.result()
	if (res.statusCode !== 200) throw new Error(`Companies House HTTP ${res.statusCode}`)
	const profile = readJson(res.body)
	if (normalizeCompanyNumber(String(profile.company_number ?? '')) !== number) {
		throw new Error('Companies House returned a different company')
	}
	return { ok: true, error: '', ...classifyCompanyProfile(profile) }
}

// ─── GLEIF (cross-check only) ─────────────────────────────────────────────

export interface GleifResult {
	ok: boolean
	eventBits: number
	registeredAs: string
	entityStatus: string
	registrationStatus: string
	updatedAt: number
	error: string
}

export interface GleifArgs {
	baseUrl: string
	lei: string
}

export const parseGleifRecord = (json: any): Omit<GleifResult, 'ok' | 'error' | 'eventBits'> => {
	const a = json?.data?.attributes ?? {}
	return {
		registeredAs: normalizeCompanyNumber(String(a.entity?.registeredAs ?? '')),
		entityStatus: String(a.entity?.status ?? ''),
		registrationStatus: String(a.registration?.status ?? ''),
		updatedAt: parseTimestamp(a.registration?.lastUpdateDate),
	}
}

/** One HTTP call. Conflict bits need Companies House too, so they are computed later by crossCheck(). */
export const fetchGleif = (sendRequester: HTTPSendRequester, args: GleifArgs): GleifResult => {
	const res = sendRequester
		.sendRequest({
			url: `${args.baseUrl}/api/v1/lei-records/${encodeURIComponent(args.lei.trim().toUpperCase())}`,
			method: 'GET',
			headers: { Accept: 'application/vnd.api+json' },
		})
		.result()
	if (res.statusCode !== 200) throw new Error(`GLEIF HTTP ${res.statusCode}`)
	const record = parseGleifRecord(readJson(res.body))
	return {
		ok: true,
		error: '',
		eventBits: record.registrationStatus === 'LAPSED' ? EV_GLEIF_LEI_LAPSED : 0,
		...record,
	}
}

/**
 * GLEIF vs Companies House. A mismatch is flagged for human review; it never pauses the facility on its own,
 * because an LEI record says who an entity is, not whether it is insolvent.
 */
export const crossCheck = (companyNumber: string, gleif: GleifResult, ch: CompaniesHouseResult): number => {
	if (!gleif.ok) return 0
	let bits = 0
	if (gleif.registeredAs !== '' && gleif.registeredAs !== normalizeCompanyNumber(companyNumber)) bits |= EV_SOURCE_CONFLICT
	if (ch.ok && gleif.entityStatus === 'INACTIVE' && ch.companyStatus === 'active') bits |= EV_SOURCE_CONFLICT
	return bits
}

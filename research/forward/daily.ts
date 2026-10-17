// Forward test, run once a day: Drawstop's Gazette check beside a Companies House-only watcher, on petitions as they
// are advertised. Every run appends to CSVs in research/forward/data and is meant to be committed by a scheduled job,
// so each observation carries a public timestamp (the commit and the job log) instead of our word.
//
//   bun research/forward/daily.ts [cacheDir]            needs CH_API_KEY_VAR for the Companies House part
//
// petitions.csv  one row per petition the first time it is seen: when Drawstop's daily check would have known it,
//                its presentation and advertisement dates, company and court case
// register.csv   one row per tracked company per day: Companies House status and insolvency history that day
//
// Polite: Gazette requests ≥ 3 s apart and Retry-After honoured; Companies House ≥ 0.7 s apart. No personal data.

import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { normalizeCaseRef, normalizeCompanyNumber, parseTimestamp } from '../../status-monitor/sources'

const DATA = join(import.meta.dir, 'data')
const PETITIONS = join(DATA, 'petitions.csv')
const REGISTER = join(DATA, 'register.csv')
const GAZETTE = 'https://www.thegazette.co.uk'
const CH = 'https://api.company-information.service.gov.uk'
const UA = 'Drawstop-research/0.1 (open-source forward test; daily, 1 request per 3 s)'
const TRACK_DAYS = 45 // keep checking the register for this long after a petition is first seen

const cacheDir = process.argv[2]
if (cacheDir) mkdirSync(cacheDir, { recursive: true })
mkdirSync(DATA, { recursive: true })
if (!existsSync(PETITIONS)) writeFileSync(PETITIONS, 'notice_id,code,company_number,first_seen_at,published_at,presented_at,case_ref,court_class\n')
if (!existsSync(REGISTER)) writeFileSync(REGISTER, 'date,company_number,company_status,has_insolvency_history,checked_at\n')

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const now = Math.floor(Date.now() / 1000)
const today = new Date(now * 1000).toISOString().slice(0, 10)
const first = (v: any) => (Array.isArray(v) ? v[0] : v)
const toArray = (v: any): any[] => (v === undefined ? [] : Array.isArray(v) ? v : [v])

let lastGazette = 0
const gazette = async (url: string, cacheKey?: string): Promise<any> => {
	const file = cacheDir && cacheKey ? join(cacheDir, `${cacheKey}.json`) : ''
	if (file && existsSync(file)) return JSON.parse(readFileSync(file, 'utf-8'))
	for (let attempt = 0; attempt < 4; attempt++) {
		const wait = lastGazette + 3000 - Date.now()
		if (wait > 0) await sleep(wait)
		lastGazette = Date.now()
		const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
		if (res.ok) {
			const text = await res.text()
			if (file) writeFileSync(file, text)
			return JSON.parse(text)
		}
		if (res.status === 404) return null
		const retryAfter = Number(res.headers.get('retry-after'))
		const ms = Number.isFinite(retryAfter) && retryAfter > 0 ? (retryAfter + 5) * 1000 : 10_000 * 2 ** attempt
		console.log(`Gazette HTTP ${res.status}, waiting ${Math.round(ms / 1000)} s`)
		await sleep(ms)
	}
	throw new Error(`Gazette unavailable: ${url}`)
}

const courtClass = (text: string): string => {
	if (/District Registry/i.test(text)) return 'high-court-district-registry'
	if (/CR-\d{4}-[A-Z]{3}-\d+/.test(text) || /Business and Property Courts in (?!London)/i.test(text)) return 'high-court-bpc-outside-london'
	if (/High Court of Justice/i.test(text)) return 'high-court-london'
	if (/County Court/i.test(text)) return 'county-court'
	if (/Sheriff Court|Court of Session|Company Number: SC/i.test(text)) return 'scotland'
	return 'unknown'
}

// ── 1. Petitions advertised in the last 3 days that we have not seen yet ─────────────────────
const seen = new Set(readFileSync(PETITIONS, 'utf-8').trim().split('\n').slice(1).map((l) => l.split(',')[0]))
const start = new Date((now - 3 * 86400) * 1000).toISOString().slice(0, 10)
let added = 0
for (const code of ['2450', '2451']) {
	for (let page = 1; page <= 5; page++) {
		const list = await gazette(
			`${GAZETTE}/insolvency/notice/data.json?noticetypes=${code}&results-page-size=100&results-page=${page}&start-publish-date=${start}&end-publish-date=${today}`,
		)
		const entries = toArray(list?.entry)
		for (const e of entries) {
			const id = String(e.id).match(/(\d+)\s*$/)?.[1]
			if (!id || seen.has(id)) continue
			const ld = await gazette(`${GAZETTE}/notice/${id}/data.json?view=linked-data`, `notice-${id}`)
			const t = ld?.result?.primaryTopic
			if (!t) continue
			const about = first(t.isAbout) ?? {}
			const court = first(about.hasCourtCase) ?? {}
			const numbers = toArray(about.company)
				.map((c: any) => first(c?.companyNumber))
				.filter((n: any) => typeof n === 'string' && n.trim() !== '')
				.map((n: string) => normalizeCompanyNumber(n))
			const cls = courtClass(String(e.content ?? '').replace(/<[^>]+>/g, ' '))
			for (const company of numbers.length ? numbers : ['']) {
				appendFileSync(
					PETITIONS,
					[id, code, company, now, parseTimestamp(t.hasPublicationDate), parseTimestamp(about.dateOfPetitionPresentation),
						normalizeCaseRef(court.caseNumber, court.caseYear), cls].join(',') + '\n',
				)
			}
			seen.add(id)
			added++
		}
		if (entries.length < 100) break
	}
}
console.log(`petitions: ${added} new`)

// ── 2. Companies House, once a day, for every company first seen in the last TRACK_DAYS ─────
const key = process.env.CH_API_KEY_VAR ?? ''
if (key === '') {
	console.log('CH_API_KEY_VAR not set: skipping the register check')
} else {
	const auth = `Basic ${Buffer.from(`${key}:`).toString('base64')}`
	const done = new Set(
		readFileSync(REGISTER, 'utf-8').trim().split('\n').slice(1).filter((l) => l.startsWith(today)).map((l) => l.split(',')[1]),
	)
	const companies = new Set(
		readFileSync(PETITIONS, 'utf-8').trim().split('\n').slice(1)
			.map((l) => l.split(','))
			.filter((c) => c[2] && now - Number(c[3]) < TRACK_DAYS * 86400 && !c[2].startsWith('SC'))
			.map((c) => c[2]),
	)
	let checked = 0
	for (const company of companies) {
		if (done.has(company)) continue
		await sleep(700)
		const res = await fetch(`${CH}/company/${company}`, { headers: { Authorization: auth } })
		if (res.status === 429) {
			console.log('Companies House 429, stopping for today')
			break
		}
		const p = res.ok ? await res.json() : null
		appendFileSync(
			REGISTER,
			[today, company, p?.company_status ?? `http-${res.status}`, p?.has_insolvency_history === true, Math.floor(Date.now() / 1000)].join(',') + '\n',
		)
		checked++
	}
	console.log(`register: ${checked} companies checked`)
}

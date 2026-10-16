// Pulls Gazette corporate-insolvency notices (petitions, winding-up orders, dismissals) for a date window and
// writes one CSV row per notice: id, code, company number(s), publication time, petition presentation date and
// normalized court case. Uses the workflow's own date and case-reference parsers, so the study measures exactly
// what Drawstop would read.
//
//   bun research/petition-lag/fetch.ts <cacheDir> <outCsv>
//
// Polite by design: one request at a time, at least 1.5 s apart, every response cached on disk so a rerun or
// a resumed run sends no repeat requests. Stores no names of individuals; Gazette data is OGL-licensed.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { normalizeCaseRef, normalizeCompanyNumber, parseTimestamp } from '../../status-monitor/sources'

const BASE = 'https://www.thegazette.co.uk'
const UA = 'Drawstop-research/0.1 (open-source hackathon research script; 1 request per 1.5 s)'
const GAP_MS = 1500

// Windows: petitions advertised in Q3 2026; orders and dismissals through 15 October, to catch outcomes.
const QUERIES = [
	{ code: '2450', start: '2026-07-01', end: '2026-09-30' },
	{ code: '2451', start: '2026-07-01', end: '2026-10-15' },
	{ code: '2452', start: '2026-07-01', end: '2026-10-15' },
	{ code: '2461', start: '2026-07-01', end: '2026-10-15' },
]

const [cacheDir, outCsv] = process.argv.slice(2)
if (!cacheDir || !outCsv) throw new Error('usage: fetch.ts <cacheDir> <outCsv>')
mkdirSync(cacheDir, { recursive: true })

let last = 0
const failures: string[] = []
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const getJson = async (url: string, cacheKey: string): Promise<any> => {
	const file = join(cacheDir, `${cacheKey}.json`)
	if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf-8'))
	for (let attempt = 0; attempt < 5; attempt++) {
		const wait = last + GAP_MS - Date.now()
		if (wait > 0) await sleep(wait)
		last = Date.now()
		const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
		if (res.ok) {
			const text = await res.text()
			writeFileSync(file, text)
			return JSON.parse(text)
		}
		if (res.status === 404) return null
		console.log(`  HTTP ${res.status} on ${cacheKey}, backing off`)
		await sleep(5000 * 2 ** attempt) // 429/5xx: back off 5, 10, 20, 40, 80 s
	}
	failures.push(cacheKey) // recorded, not cached: a rerun retries it
	return null
}

const first = (v: any) => (Array.isArray(v) ? v[0] : v)
const toArray = (v: any): any[] => (v === undefined ? [] : Array.isArray(v) ? v : [v])

const listIds = async (code: string, start: string, end: string): Promise<string[]> => {
	const ids: string[] = []
	for (let page = 1; ; page++) {
		const url = `${BASE}/insolvency/notice/data.json?noticetypes=${code}&results-page-size=100&results-page=${page}&start-publish-date=${start}&end-publish-date=${end}`
		const j = await getJson(url, `list-${code}-${start}-${end}-p${page}`)
		const entries = toArray(j?.entry)
		for (const e of entries) {
			const id = String(e.id).match(/(\d+)\s*$/)?.[1]
			if (id) ids.push(id)
		}
		const total = Number(j?.['f:total'] ?? 0)
		if (entries.length === 0 || ids.length >= total) break
	}
	return ids
}

const rows: string[] = ['notice_id,code,company_numbers,published_at,presented_at,case_ref']
for (const q of QUERIES) {
	const ids = await listIds(q.code, q.start, q.end)
	console.log(`${q.code} ${q.start}..${q.end}: ${ids.length} notices`)
	let done = 0
	for (const id of ids) {
		const j = await getJson(`${BASE}/notice/${id}/data.json?view=linked-data`, `notice-${id}`)
		const t = j?.result?.primaryTopic
		if (!t) continue
		const about = first(t.isAbout) ?? {}
		const numbers = toArray(about.company)
			.map((c: any) => first(c?.companyNumber))
			.filter((n: any) => typeof n === 'string' && n.trim() !== '')
			.map((n: string) => normalizeCompanyNumber(n))
		const court = first(about.hasCourtCase) ?? {}
		rows.push(
			[
				id,
				String(first(t.hasNoticeCode) ?? q.code),
				numbers.join(';'),
				parseTimestamp(t.hasPublicationDate),
				parseTimestamp(about.dateOfPetitionPresentation ?? about.datePetitionFiled),
				normalizeCaseRef(court.caseNumber, court.caseYear),
			].join(','),
		)
		if (++done % 100 === 0) console.log(`  ${q.code}: ${done}/${ids.length}`)
	}
}
writeFileSync(outCsv, rows.join('\n') + '\n')
console.log(`wrote ${rows.length - 1} rows to ${outCsv}; ${failures.length} requests failed: ${failures.join(' ')}`)

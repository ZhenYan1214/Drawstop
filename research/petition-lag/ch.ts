// Companies House snapshot for companies in the Gazette dataset: current company_status and the earliest
// insolvency filing on the register. Shows what a lender watching only Companies House would see.
//
//   bun --env-file=.env research/petition-lag/ch.ts <cacheDir> <noticesCsv> <outCsv>
//
// Needs CH_API_KEY_VAR (REST, Live). The key is sent only to the Companies House API and never logged.
// Polite: one request at a time, at least 0.7 s apart (the API allows 600 per 5 minutes), cached on disk.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE = 'https://api.company-information.service.gov.uk'
const GAP_MS = 700
const key = process.env.CH_API_KEY_VAR ?? ''
if (key === '') throw new Error('CH_API_KEY_VAR is not set')
const auth = `Basic ${Buffer.from(`${key}:`).toString('base64')}`

const [cacheDir, noticesCsv, outCsv] = process.argv.slice(2)
if (!cacheDir || !noticesCsv || !outCsv) throw new Error('usage: ch.ts <cacheDir> <noticesCsv> <outCsv>')
mkdirSync(cacheDir, { recursive: true })

let last = 0
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const getJson = async (path: string, cacheKey: string): Promise<{ status: number; body: any }> => {
	const file = join(cacheDir, `${cacheKey}.json`)
	if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf-8'))
	for (let attempt = 0; attempt < 5; attempt++) {
		const wait = last + GAP_MS - Date.now()
		if (wait > 0) await sleep(wait)
		last = Date.now()
		const res = await fetch(`${BASE}${path}`, { headers: { Authorization: auth, Accept: 'application/json' } })
		if (res.status === 401) throw new Error('Companies House rejected the key (401)')
		if (res.ok || res.status === 404) {
			const out = { status: res.status, body: res.ok ? await res.json() : null }
			writeFileSync(file, JSON.stringify(out))
			return out
		}
		await sleep(GAP_MS * 2 ** (attempt + 2)) // 429/5xx: back off
	}
	throw new Error(`giving up on ${path}`)
}

// Companies that appear in any notice (single-company notices only, to keep attribution clean).
const lines = readFileSync(noticesCsv, 'utf-8').trim().split('\n').slice(1)
const companies = [...new Set(lines.map((l) => l.split(',')[2]).filter((n) => n && !n.includes(';')))].sort()
console.log(`${companies.length} companies`)

const checkedAt = new Date().toISOString().slice(0, 10)
const rows = ['company_number,ch_status,has_insolvency_history,first_insolvency_filing_date,first_insolvency_filing_type,checked_on']
let done = 0
for (const n of companies) {
	const profile = await getJson(`/company/${n}`, `ch-profile-${n}`)
	const filings = await getJson(`/company/${n}/filing-history?category=insolvency&items_per_page=100`, `ch-insolv-${n}`)
	const items: any[] = filings.body?.items ?? []
	const earliest = items.map((i) => ({ date: String(i.date ?? ''), type: String(i.type ?? '') })).filter((i) => i.date).sort((a, b) => (a.date < b.date ? -1 : 1))[0]
	rows.push(
		[
			n,
			profile.status === 200 ? String(profile.body?.company_status ?? '') : `http-${profile.status}`,
			profile.body?.has_insolvency_history === true ? 'true' : 'false',
			earliest?.date ?? '',
			earliest?.type ?? '',
			checkedAt,
		].join(','),
	)
	if (++done % 100 === 0) console.log(`  ${done}/${companies.length}`)
}
writeFileSync(outCsv, rows.join('\n') + '\n')
console.log(`wrote ${rows.length - 1} rows to ${outCsv}`)

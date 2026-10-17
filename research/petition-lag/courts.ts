// Which court hears each advertised winding-up petition, from the Gazette search listing alone (no per-notice
// requests). Answers: how many petitions sit in courts whose filings the HMCTS CE-File public search covers
// (Business and Property Courts: London from 2016, outside London from 2019), and so could in principle be seen at
// presentation instead of ~5 weeks later at advertisement.
//
//   bun research/petition-lag/courts.ts <cacheDir> <outCsv>       (cacheDir: the fetch.ts cache with list-2450-* pages)

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [cacheDir, outCsv] = process.argv.slice(2)
if (!cacheDir || !outCsv) throw new Error('usage: courts.ts <cacheDir> <outCsv>')

const classify = (text: string): string => {
	if (/District Registry/i.test(text)) return 'high-court-district-registry'
	if (/High Court of Justice/i.test(text)) {
		if (/Business and Property Courts in (?!London)/i.test(text)) return 'high-court-bpc-outside-london'
		return /CR-\d{4}-\d+/.test(text) ? 'high-court-london' : 'high-court-other'
	}
	// CE-File case numbers outside London carry a registry code, e.g. CR-2026-MAN-001277 (Manchester), -LDS- (Leeds)
	if (/CR-\d{4}-[A-Z]{3}-\d+/.test(text)) return 'high-court-bpc-outside-london'
	if (/County Court/i.test(text)) return 'county-court'
	if (/Sheriff Court|Court of Session|Company Number: SC/i.test(text)) return 'scotland'
	// Some Scottish notices start with the company address; a Scottish postcode area marks them
	if (/\b(PH|ML|G|EH|KY|AB|DD|FK|PA|KA|IV|DG|TD|ZE|KW|HS)\d{1,2}\s?\d[A-Z]{2}\b/.test(text)) return 'scotland'
	return 'unknown'
}

const seen = new Set<string>()
const rows = ['notice_id,published,court_class,case_number']
const counts: Record<string, number> = {}
for (const f of readdirSync(cacheDir).filter((x) => x.startsWith('list-2450'))) {
	for (const e of JSON.parse(readFileSync(join(cacheDir, f), 'utf-8')).entry ?? []) {
		const id = String(e.id).match(/(\d+)\s*$/)?.[1]
		if (!id || seen.has(id)) continue
		seen.add(id)
		const text = String(e.content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
		const cls = classify(text)
		counts[cls] = (counts[cls] ?? 0) + 1
		const caseNo = text.match(/\b(CR-\d{4}-(?:[A-Z]{3}-)?\d+)/)?.[1] ?? ''
		rows.push([id, String(e.published), cls, caseNo].join(','))
	}
}
writeFileSync(outCsv, rows.join('\n') + '\n')
const total = seen.size
const ew = total - (counts.scotland ?? 0)
const ceFile = (counts['high-court-london'] ?? 0) + (counts['high-court-bpc-outside-london'] ?? 0) +
	(counts['high-court-district-registry'] ?? 0) + (counts['high-court-other'] ?? 0)
console.log(JSON.stringify({ total, counts, englandAndWales: ew, inCeFileCourts: ceFile, inCeFileCourtsPctOfEW: +(100 * ceFile / ew).toFixed(1) }, null, 2))

// Scores the October 2026 hold-out sample against the predictions registered in PREDICTIONS.md, exactly as
// written there, under both lag definitions: the original exact-timestamp one the predictions were made with, and
// the whole-calendar-day one the Q3 study was corrected to on 2026-10-22. Written before the October data existed.
//
//   bun research/petition-lag/holdout/evaluate.ts [notices-oct.csv] [RESULTS.md]

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DAY = 86400
const dir = import.meta.dir
const [inCsv = join(dir, 'notices-oct.csv'), outMd = join(dir, 'RESULTS.md')] = process.argv.slice(2)

const utc = (d: string) => Date.parse(`${d}T00:00:00Z`) / 1000
const START = utc('2026-10-01')
const END = utc('2026-10-17') // advertised 1–16 October inclusive

const rows = readFileSync(inCsv, 'utf-8')
	.trim()
	.split('\n')
	.slice(1)
	.map((l) => l.split(','))
	.map(([id, code, companies, publishedAt, presentedAt]) => ({ id, code, companies, publishedAt: +publishedAt, presentedAt: +presentedAt }))
const petitions = rows.filter((r) => (r.code === '2450' || r.code === '2451') && r.publishedAt >= START && r.publishedAt < END)
const withDate = petitions.filter((p) => p.presentedAt > 0 && p.presentedAt <= p.publishedAt)

// Same quantile as analyze.ts (linear interpolation).
const quantile = (sorted: number[], q: number) => {
	const i = (sorted.length - 1) * q
	const lo = Math.floor(i)
	const hi = Math.ceil(i)
	return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo)
}
const share = (lags: number[], d: number) => (100 * lags.filter((l) => l > d).length) / lags.length

const definitions = {
	'exact timestamps (as registered)': (p: (typeof withDate)[number]) => (p.publishedAt - p.presentedAt) / DAY,
	'whole calendar days (corrected 22 Oct)': (p: (typeof withDate)[number]) => Math.floor(p.publishedAt / DAY) - Math.floor(p.presentedAt / DAY),
}

type Check = { measure: string; tolerance: string; value: string; pass: boolean }
const score = (lags: number[]): Check[] => {
	const s = [...lags].sort((a, b) => a - b)
	const median = quantile(s, 0.5)
	const p25 = quantile(s, 0.25)
	const p75 = quantile(s, 0.75)
	const [s14, s30, s60] = [14, 30, 60].map((d) => share(s, d))
	return [
		{ measure: 'Median days', tolerance: '33 – 39', value: median.toFixed(1), pass: median >= 33 && median <= 39 },
		{ measure: 'Middle half (p25 – p75)', tolerance: 'p25 ≥ 27 and p75 ≤ 45', value: `${p25.toFixed(1)} – ${p75.toFixed(1)}`, pass: p25 >= 27 && p75 <= 45 },
		{ measure: 'Advertised after a 14-day carve-out', tolerance: '≥ 90%', value: `${s14.toFixed(1)}%`, pass: s14 >= 90 },
		{ measure: 'Advertised after a 30-day carve-out', tolerance: '72% – 86%', value: `${s30.toFixed(1)}%`, pass: s30 >= 72 && s30 <= 86 },
		{ measure: 'Advertised after a 60-day carve-out', tolerance: '≤ 15%', value: `${s60.toFixed(1)}%`, pass: s60 <= 15 },
	]
}

let md = `# Hold-out test: results\n\nScored by [\`evaluate.ts\`](evaluate.ts) against [\`PREDICTIONS.md\`](PREDICTIONS.md), unchanged since registration. Sample: [\`notices-oct.csv\`](notices-oct.csv), petitions advertised 1–16 October 2026: ${petitions.length} notices, ${withDate.length} with a presentation date.\n`
let summary = ''
for (const [name, lag] of Object.entries(definitions)) {
	const checks = score(withDate.map(lag))
	const passed = checks.filter((c) => c.pass).length
	md += `\n## ${name[0].toUpperCase()}${name.slice(1)}: ${passed} of ${checks.length} predictions confirmed\n\n| Measure | Registered tolerance | October | Result |\n|---|---|---|---|\n`
	for (const c of checks) md += `| ${c.measure} | ${c.tolerance} | ${c.value} | ${c.pass ? 'confirmed' : '**missed**'} |\n`
	summary += `${name}: ${passed}/${checks.length}\n`
}
writeFileSync(outMd, md)
console.log(md)
console.error(summary.trim())

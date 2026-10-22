// Builds the DoraHacks submission figures as SVG (then render.ts makes PNGs). Data figures read the committed study
// CSV, so every bar is reproducible. Style matches the project site (docs/index.html): ivory paper, ink, one seal red.
//
//   cd docs/dorahacks && bun figures.ts && for f in svg/*.svg; do bun render.ts $f png/$(basename $f .svg).png; done
//   bun render.ts ../assets/banner.svg ../assets/banner.png 1920

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(import.meta.dir, 'svg')
mkdirSync(OUT, { recursive: true })

// Tokens: the site's day edition (paper, ink, seal red for "stopped", ochre for "held")
const C = {
	surface: '#f2ede2',
	panel: '#e9e2d3',
	border: '#cfc5b1',
	rule: '#dcd3c1',
	ink: '#1a1814',
	ink2: '#48433b',
	muted: '#827a6c',
	series: '#1a1814', // bars are ink
	seriesSoft: '#e9e2d3',
	amber: '#8f6414',
	amberBg: '#efe4c9',
	red: '#a3271d',
	redBg: '#f1dcd5',
	green: '#48433b', // "open" is neutral ink, not green
	greenBg: '#e9e2d3',
	dark: '#15130f',
}
// Newsreader is the site face; for PNG rendering the nearest installed serif is used.
const FONT = `font-family="Newsreader, Palatino Linotype, Book Antiqua, Palatino, Georgia, serif"`
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const svg = (w: number, h: number, label: string, body: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" ${FONT}>\n${body}\n</svg>\n`
const text = (x: number, y: number, s: string, o: { size?: number; weight?: number; fill?: string; anchor?: string; mono?: boolean } = {}) =>
	`<text x="${x}" y="${y}" font-size="${o.size ?? 14}" font-weight="${o.weight ?? 400}" fill="${o.fill ?? C.ink}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.mono ? ' font-family="Consolas, monospace"' : ''}>${esc(s)}</text>`
const card = (x: number, y: number, w: number, h: number, fill = C.surface, stroke = C.border, r = 1.5) =>
	`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`
// Broadsheet frame: paper, with a heavy-and-hairline double rule across the top
const frame = (w: number, h: number) =>
	`<rect width="${w}" height="${h}" fill="${C.surface}"/><line x1="40" y1="16" x2="${w - 40}" y2="16" stroke="${C.ink}" stroke-width="3"/><line x1="40" y1="21" x2="${w - 40}" y2="21" stroke="${C.ink}" stroke-width="1"/>`

// ── 1. The gap: distribution from the study data ─────────────────────────────────────────
{
	const csv = readFileSync(join(import.meta.dir, '../../research/petition-lag/data/notices.csv'), 'utf-8').trim().split('\n').slice(1)
	const q3s = Date.UTC(2026, 6, 1) / 1000
	const q3e = Date.UTC(2026, 9, 1) / 1000
	const lags = csv
		.map((l) => l.split(','))
		.filter((r) => (r[1] === '2450' || r[1] === '2451') && +r[3] >= q3s && +r[3] < q3e && +r[4] > 0)
		// whole calendar days: a carve-out of N days is still open on day N
		.map((r) => Math.floor(+r[3] / 86400) - Math.floor(+r[4] / 86400))
	const n = lags.length
	const sorted = [...lags].sort((a, b) => a - b)
	const median = sorted[Math.floor((n - 1) / 2)]
	const q = (p: number) => sorted[Math.round((n - 1) * p)]
	const pct = (d: number) => (100 * lags.filter((x) => x > d).length) / n
	const BIN = 5
	const LAST = 70 // last bin collects 70+
	const bins = Array.from({ length: LAST / BIN + 1 }, (_, i) => ({ from: i * BIN, count: 0 }))
	for (const d of lags) bins[Math.min(Math.floor(d / BIN), LAST / BIN)].count++

	const W = 960
	const H = 560
	const px = 80
	const py = 150
	const pw = 820
	const ph = 300
	const maxDay = LAST + BIN
	const x = (d: number) => px + (d / maxDay) * pw
	const yMax = 550
	const y = (c: number) => py + ph - (c / yMax) * ph
	const bw = (BIN / maxDay) * pw
	let body = frame(W, H)
	body += text(40, 58, `${pct(14).toFixed(0)}% of winding-up petitions became public only after a 14-day carve-out had closed`, { size: 22, weight: 600 })
	body += text(40, 84, `Days from presentation (s.127 exposure starts) to advertisement in The Gazette · ${n.toLocaleString('en')} petitions advertised Jul–Sep 2026`, { size: 14, fill: C.ink2 })
	// shaded "carve-out already closed" zones
	body += `<rect x="${x(15)}" y="${py}" width="${x(maxDay) - x(15)}" height="${ph}" fill="${C.redBg}" opacity="0.7"/>`
	// grid + y axis
	for (const t of [0, 100, 200, 300, 400, 500]) {
		body += `<line x1="${px}" y1="${y(t)}" x2="${px + pw}" y2="${y(t)}" stroke="${C.rule}" stroke-width="1"/>`
		body += text(px - 10, y(t) + 5, String(t), { size: 12, fill: C.muted, anchor: 'end' })
	}
	body += text(px - 10, py - 14, 'petitions', { size: 12, fill: C.muted, anchor: 'end' })
	// bars (2px surface gap between adjacent bars, 4px rounded tops anchored to baseline)
	for (const b of bins) {
		const bx = x(b.from) + 1
		const by = y(b.count)
		const h = py + ph - by
		const w = bw - 2
		body += `<rect x="${bx}" y="${by}" width="${w}" height="${py + ph - by}" fill="${b.from >= 15 ? C.red : C.series}"/>`
		if (h < 3) continue
	}
	// x axis
	body += `<line x1="${px}" y1="${py + ph}" x2="${px + pw}" y2="${py + ph}" stroke="${C.ink2}" stroke-width="1"/>`
	for (let d = 0; d <= LAST; d += 10) body += text(x(d), py + ph + 20, d === LAST ? '70+' : String(d), { size: 12, fill: C.ink2, anchor: 'middle' })
	body += text(px + pw / 2, py + ph + 44, 'days after the petition was presented', { size: 13, fill: C.ink2, anchor: 'middle' })
	// reference lines: 14 and 30 day carve-outs, and the median
	const ref = (d: number, label: string, sub: string, color: string, yLabel: number) => {
		let s = `<line x1="${x(d + 1)}" y1="${py - 6}" x2="${x(d + 1)}" y2="${py + ph}" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 4"/>`
		s += text(x(47), yLabel, label, { size: 14, weight: 600, fill: color })
		s += text(x(47), yLabel + 18, sub, { size: 13, fill: C.ink2 })
		return s
	}
	body += ref(14, `14-day carve-out (LMA bracket): ${pct(14).toFixed(0)}%`, 'of petitions public only after it closed', C.amber, py + 24)
	body += ref(30, `30-day (borrower-friendly): ${pct(30).toFixed(0)}%`, 'public only after it closed', C.red, py + 70)
	body += `<line x1="${x(median)}" y1="${py + ph}" x2="${x(median)}" y2="${py + ph + 6}" stroke="${C.ink}" stroke-width="2"/>`
	body += text(x(47), py + 128, `median ${median.toFixed(0)} days`, { size: 14, weight: 600, fill: C.ink })
	body += text(x(47), py + 146, `(middle half ${q(0.25)}–${q(0.75)} days)`, { size: 13, fill: C.ink2 })
	body += text(40, H - 24, 'Source: The Gazette linked data (OGL), research/petition-lag · whole calendar days from presentation · mostly England & Wales, some Scottish notices', { size: 11.5, fill: C.muted })
	writeFileSync(join(OUT, 'gap.svg'), svg(W, H, `Histogram of ${n} petitions: median ${median.toFixed(0)} days from presentation to advertisement; ${pct(14).toFixed(0)}% after a 14-day and ${pct(30).toFixed(0)}% after a 30-day carve-out`, body))
	console.log(`gap: n=${n} median=${median.toFixed(1)} >14=${pct(14).toFixed(1)} >30=${pct(30).toFixed(1)}`)
}

// ── 2. Cover (card thumbnail ~222x128: keep it big and sparse) ───────────────────────────
{
	const W = 960
	const H = 554
	const seal = readFileSync(join(import.meta.dir, '../assets/logo.svg'), 'utf-8').replace(/<svg[^>]*>/, '').replace('</svg>', '')
	let body = `<rect width="${W}" height="${H}" fill="${C.surface}"/>`
	body += text(60, 64, 'VOL. I · NO. 1', { size: 15, fill: C.ink2 })
	body += text(W / 2, 64, 'ENGLAND AND WALES · INSOLVENCY ACT 1986', { size: 15, fill: C.ink2, anchor: 'middle' })
	body += text(W - 60, 64, 'OCTOBER 2026', { size: 15, fill: C.ink2, anchor: 'end' })
	body += `<line x1="60" y1="84" x2="${W - 60}" y2="84" stroke="${C.border}" stroke-width="1"/>`
	body += `<g transform="translate(118,128) scale(1.72)">${seal}</g>`
	body += text(340, 282, 'Drawstop', { size: 126, weight: 500, fill: C.ink })
	body += `<line x1="60" y1="358" x2="${W - 60}" y2="358" stroke="${C.ink}" stroke-width="5"/><line x1="60" y1="366" x2="${W - 60}" y2="366" stroke="${C.ink}" stroke-width="1.5"/>`
	body += `<text x="${W / 2}" y="428" font-size="34" font-style="italic" fill="${C.ink2}" text-anchor="middle">English insolvency notices in, loan drawdowns stopped.</text>`
	body += text(W / 2, 490, 'CHAINLINK CRE · SEPOLIA · CONTRACTS SOURCE-VERIFIED', { size: 17, fill: C.red, anchor: 'middle' })
	writeFileSync(join(OUT, 'cover.svg'), svg(W, H, 'Drawstop: English insolvency notices in, loan drawdowns stopped. Chainlink CRE on Sepolia.', body))
}

// ── 2b. README masthead banner (written to docs/assets, rendered to docs/assets/banner.png) ───
{
	const W = 960
	const H = 270
	const seal = readFileSync(join(import.meta.dir, '../assets/logo.svg'), 'utf-8').replace(/<svg[^>]*>/, '').replace('</svg>', '')
	let body = `<rect width="${W}" height="${H}" fill="${C.surface}"/>`
	body += text(40, 36, 'VOL. I · NO. 1 · TESTNET EDITION', { size: 12.5, fill: C.ink2 })
	body += text(W / 2, 36, 'ENGLAND AND WALES · INSOLVENCY ACT 1986', { size: 12.5, fill: C.ink2, anchor: 'middle' })
	body += text(W - 40, 36, 'OCTOBER 2026', { size: 12.5, fill: C.ink2, anchor: 'end' })
	body += `<line x1="40" y1="50" x2="${W - 40}" y2="50" stroke="${C.border}" stroke-width="1"/>`
	body += `<g transform="translate(190,70) scale(0.92)">${seal}</g>`
	body += text(316, 160, 'Drawstop', { size: 104, weight: 500, fill: C.ink })
	body += `<line x1="40" y1="200" x2="${W - 40}" y2="200" stroke="${C.ink}" stroke-width="4"/><line x1="40" y1="207" x2="${W - 40}" y2="207" stroke="${C.ink}" stroke-width="1.2"/>`
	body += `<text x="${W / 2}" y="245" font-size="21" font-style="italic" fill="${C.ink2}" text-anchor="middle">Statutory insolvency notices in, loan drawdowns stopped, repayments held.</text>`
	writeFileSync(join(import.meta.dir, '../assets/banner.svg'), svg(W, H, 'Drawstop: statutory insolvency notices in, loan drawdowns stopped, repayments held.', body))
}

// ── 3. What the contract did on Sepolia: two acts ───────────────────────────────────────
{
	type Row = { step: string; event: string; status: string; tone: 'ok' | 'warn' | 'bad'; money: string }
	const act1: Row[] = [
		{ step: '1–2', event: 'Clean record; borrower requests 10,000, then a fresh CRE check', status: 'NORMAL', tone: 'ok', money: '10,000 drawn' },
		{ step: '3–4', event: 'Petition advertised; the next request gets a fresh check', status: 'PETITION_PENDING', tone: 'warn', money: 'drawdown reverts' },
		{ step: '5', event: 'Borrower repays 5,000 while the petition is live', status: 'PETITION_PENDING', tone: 'warn', money: '5,000 held in suspense' },
		{ step: '6', event: 'Dismissal for the same court case', status: 'NORMAL', tone: 'ok', money: 'suspense → lender' },
	]
	const act2: Row[] = [
		{ step: '7', event: 'Borrower repays 3,000; the record still looks clean', status: 'NORMAL', tone: 'ok', money: '3,000 → lender' },
		{ step: '8', event: 'Winding-up order; its petition was presented 12 days earlier', status: 'REVIEW_REQUIRED', tone: 'bad', money: '3,000 flagged, not stopped' },
		{ step: '9', event: 'Borrower repays 2,000 after the order', status: 'REVIEW_REQUIRED', tone: 'bad', money: '2,000 held in suspense' },
		{ step: '10', event: 'Arbiter (neutral reviewer) names the Official Receiver; early transfer reverts', status: 'REVIEW_REQUIRED', tone: 'bad', money: 'effective after 2 days' },
		{ step: '11', event: 'After the delay, suspense goes back to the estate (22 Oct)', status: 'REVIEW_REQUIRED', tone: 'bad', money: '2,000 → Official Receiver' },
	]
	const W = 1000
	const H = 692
	const tone = { ok: [C.green, C.greenBg, '✓'], warn: [C.amber, C.amberBg, '!'], bad: [C.red, C.redBg, '■'] } as const
	let body = frame(W, H)
	body += text(40, 58, 'What the loan contract did on Sepolia', { size: 22, weight: 600 })
	body += text(40, 82, 'Fictional borrower DM000001 via a local Gazette mirror · compressed time · 30-day carve-out · every check a CRE run', { size: 14, fill: C.ink2 })
	const cols = { step: 52, event: 110, status: 590, money: 770 }
	let yy = 112
	const header = (label: string) => {
		let s = text(40, yy, label, { size: 13, weight: 700, fill: C.ink2 })
		yy += 14
		return s
	}
	const row = (r: Row) => {
		const [fg, bg, icon] = tone[r.tone]
		let s = card(40, yy, W - 80, 44, C.surface, C.border, 1.5)
		s += text(cols.step, yy + 28, r.step, { size: 13, weight: 600, fill: C.ink2 })
		s += text(cols.event, yy + 28, r.event, { size: 14 })
		s += `<rect x="${cols.status}" y="${yy + 10}" width="${r.status.length * 8.6 + 28}" height="24" rx="2" fill="${bg}" stroke="${fg}" stroke-width="1.2"/>`
		s += text(cols.status + 10, yy + 27, `${icon} ${r.status}`, { size: 12, weight: 600, fill: fg, mono: true })
		s += text(cols.money, yy + 28, r.money, { size: 14, weight: 600, fill: r.money.includes('reverts') || r.money.includes('not stopped') ? C.red : C.ink })
		yy += 52
		return s
	}
	body += header('ACT 1 · A PETITION')
	for (const r of act1) body += row(r)
	yy += 14
	body += header('ACT 2 · A WINDING-UP ORDER')
	for (const r of act2) body += row(r)
	yy += 6
	body += `<rect x="40" y="${yy}" width="${W - 80}" height="56" fill="${C.panel}"/><rect x="40" y="${yy}" width="4" height="56" fill="${C.red}"/>`
	body += text(56, yy + 23, 's.127 statement rebuilt from on-chain events: at least 8,000 reached the lender after presentation, not 3,000.', { size: 14, weight: 600 })
	body += text(56, yy + 43, "The 5,000 released after act 1's dismissal came after act 2's petition. Facts for a court; whether it is void is the court's call.", { size: 13, fill: C.ink2 })
	writeFileSync(join(OUT, 'demo.svg'), svg(W, H, 'Loan contract on Sepolia: drawdown, petition drawstop, suspense, dismissal; then a winding-up order, flagged repayment, suspense returned to the Official Receiver', body))
}

// ── 4. How it was checked: stat tiles ────────────────────────────────────────────────────
{
	const tiles = [
		{ value: '3 / 3', label: 'contracts source-verified', sub: 'Sourcify: creation + runtime match' },
		{ value: '128,000', label: 'random calls, 5 invariants', sub: 'Foundry stateful fuzzing' },
		{ value: '5 / 5', label: 'planted bugs caught', sub: 'mutation test; first suite missed 2' },
		{ value: '2,868', label: 'Gazette notices analysed', sub: 'same parsers as the workflow' },
		{ value: '42 + 24', label: 'unit + workflow tests', sub: 'incl. real responses from 3 sources' },
		{ value: '11 / 11', label: 'loan steps run on Sepolia', sub: 'step 11 on 22 Oct, after the 2-day delay' },
	]
	const W = 960
	const H = 420
	let body = frame(W, H)
	body += text(40, 58, 'How it was checked: every claim has a check behind it', { size: 22, weight: 600 })
	const tw = 280
	const th = 140
	tiles.forEach((t, i) => {
		const tx = 40 + (i % 3) * (tw + 20)
		const ty = 84 + Math.floor(i / 3) * (th + 20)
		body += card(tx, ty, tw, th, C.panel)
		body += text(tx + 20, ty + 54, t.value, { size: 40, weight: 500, fill: i === 5 ? C.red : C.ink })
		body += text(tx + 20, ty + 82, t.label, { size: 15, weight: 600 })
		body += text(tx + 20, ty + 108, t.sub, { size: 12.5, fill: C.ink2 })
	})
	writeFileSync(join(OUT, 'proof.svg'), svg(W, H, 'Verification: 3 of 3 contracts source-verified, 128,000 fuzzing calls, 5 of 5 planted bugs caught, 2,868 notices analysed, 66 tests, 11 of 11 loan steps run on Sepolia', body))
}

// ── 5. Why it is buildable: today vs production ─────────────────────────────────────────
{
	const today = [
		'Free, licensed public data: Gazette (OGL), Companies House API, GLEIF (CC0)',
		'Workflow runs in the CRE CLI against live sources today',
		'Contracts deployed and source-verified on Sepolia',
		'Every result reproduces with one command: forge test, bun test, cre simulate',
		'Agreement rider maps each clause to code (docs/agreement-rider.md)',
	]
	const next = [
		'CRE deploy access (requested), so a DON runs it on a schedule',
		'Switch registry to the production KeystoneForwarder; pin workflow ID',
		'Registry owner becomes a multisig with a timelock, or is renounced',
		'Optional court-filing source: 99% of E&W petitions are in CE-File courts',
		'Pilot with a facility agent or pool delegate on one real facility',
	]
	const W = 960
	const H = 450
	let body = frame(W, H)
	body += text(40, 58, 'Why it is buildable', { size: 22, weight: 600 })
	body += text(40, 82, 'Nothing here needs a consortium, a paid data feed or a new law', { size: 14, fill: C.ink2 })
	const col = (x: number, title: string, items: string[], color: string, bg: string, mark: string) => {
		let s = `<rect x="${x}" y="100" width="430" height="320" fill="${bg}"/><rect x="${x}" y="100" width="430" height="3" fill="${color}"/>`
		s += text(x + 20, 130, title, { size: 15, weight: 700, fill: color })
		let yy = 166
		items.forEach((it) => {
			s += text(x + 20, yy, mark, { size: 15, weight: 700, fill: color })
			const words = it.split(' ')
			let line = ''
			let lines: string[] = []
			for (const w of words) {
				if ((line + ' ' + w).trim().length > 52) {
					lines.push(line.trim())
					line = w
				} else line += ' ' + w
			}
			lines.push(line.trim())
			lines.forEach((l, j) => (s += text(x + 42, yy + j * 18, l, { size: 13.5 })))
			yy += lines.length * 18 + 16
		})
		return s
	}
	body += col(40, 'BUILT AND RUNNING TODAY', today, C.green, C.greenBg, '✓')
	body += col(490, 'PATH TO PRODUCTION', next, C.red, C.panel, '→')
	writeFileSync(join(OUT, 'buildable.svg'), svg(W, H, 'Why it is buildable: built today versus path to production', body))
}
console.log('svg written to', OUT)

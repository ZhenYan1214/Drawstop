// Builds the DoraHacks submission figures as SVG (then render.ts makes PNGs). Data figures read the committed study
// CSV, so every bar is reproducible. Style matches docs/assets (light surface, GitHub-like ink and accents).
//
//   cd docs/dorahacks && bun figures.ts && for f in svg/*.svg; do bun render.ts $f png/$(basename $f .svg).png; done

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(import.meta.dir, 'svg')
mkdirSync(OUT, { recursive: true })

// Tokens (light; the BUIDL page is light)
const C = {
	surface: '#ffffff',
	panel: '#f6f8fa',
	border: '#d0d7de',
	ink: '#1f2328',
	ink2: '#57606a',
	muted: '#8c959f',
	series: '#2a78d6', // categorical slot 1 (single series)
	seriesSoft: '#dbe9fa',
	amber: '#9a6700',
	amberBg: '#fff8c5',
	red: '#cf222e',
	redBg: '#ffebe9',
	green: '#1a7f37',
	greenBg: '#dafbe1',
	dark: '#0d1117',
}
const FONT = `font-family="Segoe UI, Helvetica, Arial, sans-serif"`
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const svg = (w: number, h: number, label: string, body: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" ${FONT}>\n${body}\n</svg>\n`
const text = (x: number, y: number, s: string, o: { size?: number; weight?: number; fill?: string; anchor?: string; mono?: boolean } = {}) =>
	`<text x="${x}" y="${y}" font-size="${o.size ?? 14}" font-weight="${o.weight ?? 400}" fill="${o.fill ?? C.ink}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.mono ? ' font-family="Consolas, monospace"' : ''}>${esc(s)}</text>`
const card = (x: number, y: number, w: number, h: number, fill = C.surface, stroke = C.border, r = 10) =>
	`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`
const frame = (w: number, h: number) => `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="14" fill="${C.surface}" stroke="${C.border}" stroke-width="1.5"/>`

// ── 1. The gap: distribution from the study data ─────────────────────────────────────────
{
	const csv = readFileSync(join(import.meta.dir, '../../research/petition-lag/data/notices.csv'), 'utf-8').trim().split('\n').slice(1)
	const q3s = Date.UTC(2026, 6, 1) / 1000
	const q3e = Date.UTC(2026, 9, 1) / 1000
	const lags = csv
		.map((l) => l.split(','))
		.filter((r) => (r[1] === '2450' || r[1] === '2451') && +r[3] >= q3s && +r[3] < q3e && +r[4] > 0)
		.map((r) => (+r[3] - +r[4]) / 86400)
	const n = lags.length
	const sorted = [...lags].sort((a, b) => a - b)
	const median = sorted[Math.floor(n / 2)]
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
	body += text(40, 50, 'Most winding-up petitions become public after a typical carve-out has closed', { size: 22, weight: 600 })
	body += text(40, 78, `Days from presentation (s.127 exposure starts) to advertisement in The Gazette · ${n.toLocaleString('en')} petitions advertised Jul–Sep 2026`, { size: 14, fill: C.ink2 })
	// shaded "carve-out already closed" zones
	body += `<rect x="${x(30)}" y="${py}" width="${x(maxDay) - x(30)}" height="${ph}" fill="${C.redBg}" opacity="0.55"/>`
	// grid + y axis
	for (const t of [0, 100, 200, 300, 400, 500]) {
		body += `<line x1="${px}" y1="${y(t)}" x2="${px + pw}" y2="${y(t)}" stroke="#eaeef2" stroke-width="1"/>`
		body += text(px - 10, y(t) + 5, String(t), { size: 12, fill: C.muted, anchor: 'end' })
	}
	body += text(px - 10, py - 14, 'petitions', { size: 12, fill: C.muted, anchor: 'end' })
	// bars (2px surface gap between adjacent bars, 4px rounded tops anchored to baseline)
	for (const b of bins) {
		const bx = x(b.from) + 1
		const by = y(b.count)
		const h = py + ph - by
		const w = bw - 2
		body += `<path d="M${bx},${py + ph} V${by + 4} Q${bx},${by} ${bx + 4},${by} H${bx + w - 4} Q${bx + w},${by} ${bx + w},${by + 4} V${py + ph} Z" fill="${C.series}"/>`
		if (h < 3) continue
	}
	// x axis
	body += `<line x1="${px}" y1="${py + ph}" x2="${px + pw}" y2="${py + ph}" stroke="${C.ink2}" stroke-width="1"/>`
	for (let d = 0; d <= LAST; d += 10) body += text(x(d), py + ph + 20, d === LAST ? '70+' : String(d), { size: 12, fill: C.ink2, anchor: 'middle' })
	body += text(px + pw / 2, py + ph + 44, 'days after the petition was presented', { size: 13, fill: C.ink2, anchor: 'middle' })
	// reference lines: 14 and 30 day carve-outs, and the median
	const ref = (d: number, label: string, sub: string, color: string, yLabel: number) => {
		let s = `<line x1="${x(d)}" y1="${py - 6}" x2="${x(d)}" y2="${py + ph}" stroke="${color}" stroke-width="2" stroke-dasharray="5 4"/>`
		s += text(x(47), yLabel, label, { size: 14, weight: 600, fill: color })
		s += text(x(47), yLabel + 18, sub, { size: 13, fill: C.ink2 })
		return s
	}
	body += ref(14, `14-day carve-out: ${pct(14).toFixed(0)}%`, 'of petitions public only after it closed', C.amber, py + 24)
	body += ref(30, `30-day carve-out: ${pct(30).toFixed(0)}%`, 'of petitions public only after it closed', C.red, py + 70)
	body += `<line x1="${x(median)}" y1="${py + ph}" x2="${x(median)}" y2="${py + ph + 6}" stroke="${C.ink}" stroke-width="2"/>`
	body += text(x(47), py + 128, `median ${median.toFixed(0)} days`, { size: 14, weight: 600, fill: C.ink })
	body += text(x(47), py + 146, '(middle half 31–41 days)', { size: 13, fill: C.ink2 })
	body += text(40, H - 24, 'Source: The Gazette linked data (OGL), Drawstop petition-lag study, research/petition-lag · carve-outs counted from presentation, as in LMA-style agreements', { size: 11.5, fill: C.muted })
	writeFileSync(join(OUT, 'gap.svg'), svg(W, H, `Histogram of ${n} petitions: median ${median.toFixed(0)} days from presentation to advertisement; ${pct(14).toFixed(0)}% after a 14-day and ${pct(30).toFixed(0)}% after a 30-day carve-out`, body))
	console.log(`gap: n=${n} median=${median.toFixed(1)} >14=${pct(14).toFixed(1)} >30=${pct(30).toFixed(1)}`)
}

// ── 2. Cover (card thumbnail ~222x128: keep it big and sparse) ───────────────────────────
{
	const W = 960
	const H = 554
	const logo = readFileSync(join(import.meta.dir, '../assets/logo.svg'), 'utf-8').replace(/<svg[^>]*>/, '').replace('</svg>', '')
	let body = `<rect width="${W}" height="${H}" fill="${C.dark}"/>`
	body += `<g transform="translate(70,150) scale(1.55)">${logo}</g>`
	body += text(355, 245, 'Drawstop', { size: 92, weight: 700, fill: '#ffffff' })
	body += text(360, 300, 'UK insolvency notices in,', { size: 30, fill: '#c9d1d9' })
	body += text(360, 340, 'LMA-style pause-and-review out', { size: 30, fill: '#c9d1d9' })
	body += `<rect x="360" y="380" width="250" height="40" rx="20" fill="none" stroke="#3987e5" stroke-width="2"/>`
	body += text(485, 406, 'Chainlink CRE · Sepolia', { size: 17, weight: 600, fill: '#79b8ff', anchor: 'middle' })
	body += text(630, 406, 'live · source-verified', { size: 17, fill: '#8b949e' })
	writeFileSync(join(OUT, 'cover.svg'), svg(W, H, 'Drawstop: UK insolvency notices in, LMA-style pause-and-review out. Chainlink CRE on Sepolia.', body))
}

// ── 3. What the contract did on Sepolia: two acts ───────────────────────────────────────
{
	type Row = { step: string; event: string; status: string; tone: 'ok' | 'warn' | 'bad'; money: string }
	const act1: Row[] = [
		{ step: '1–2', event: 'Clean record · borrower requests 10,000 → fresh CRE check', status: 'NORMAL', tone: 'ok', money: '10,000 drawn' },
		{ step: '3–4', event: 'Petition advertised · next request → fresh check', status: 'PETITION_PENDING', tone: 'warn', money: 'drawdown reverts' },
		{ step: '5', event: 'Borrower repays 5,000 while the petition is live', status: 'PETITION_PENDING', tone: 'warn', money: '5,000 held in suspense' },
		{ step: '6', event: 'Dismissal for the same court case', status: 'NORMAL', tone: 'ok', money: 'suspense → lender' },
	]
	const act2: Row[] = [
		{ step: '7', event: 'Borrower repays 3,000; the record still looks clean', status: 'NORMAL', tone: 'ok', money: '3,000 → lender' },
		{ step: '8', event: 'Winding-up order; its petition was presented 12 days earlier', status: 'REVIEW_REQUIRED', tone: 'bad', money: '3,000 flagged, not stopped' },
		{ step: '9', event: 'Borrower repays 2,000 after the order', status: 'REVIEW_REQUIRED', tone: 'bad', money: '2,000 held in suspense' },
		{ step: '10', event: 'Arbiter nominates the Official Receiver; an early transfer reverts', status: 'REVIEW_REQUIRED', tone: 'bad', money: 'effective after 2 days' },
		{ step: '11', event: 'After the delay, suspense goes back to the estate (scheduled 19 Oct)', status: 'REVIEW_REQUIRED', tone: 'bad', money: '2,000 → Official Receiver' },
	]
	const W = 1000
	const H = 692
	const tone = { ok: [C.green, C.greenBg, '✓'], warn: [C.amber, C.amberBg, '!'], bad: [C.red, C.redBg, '■'] } as const
	let body = frame(W, H)
	body += text(40, 50, 'What the loan contract did on Sepolia', { size: 22, weight: 600 })
	body += text(40, 76, 'Fictional borrower DM000001 · 30-day carve-out from presentation · every check is a Chainlink CRE workflow run', { size: 14, fill: C.ink2 })
	const cols = { step: 52, event: 110, status: 590, money: 770 }
	let yy = 112
	const header = (label: string) => {
		let s = text(40, yy, label, { size: 13, weight: 700, fill: C.ink2 })
		yy += 14
		return s
	}
	const row = (r: Row) => {
		const [fg, bg, icon] = tone[r.tone]
		let s = card(40, yy, W - 80, 44, C.surface, C.border, 8)
		s += text(cols.step, yy + 28, r.step, { size: 13, weight: 600, fill: C.ink2 })
		s += text(cols.event, yy + 28, r.event, { size: 14 })
		s += `<rect x="${cols.status}" y="${yy + 10}" width="${r.status.length * 8.6 + 28}" height="24" rx="12" fill="${bg}" stroke="${fg}" stroke-width="1"/>`
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
	body += `<rect x="40" y="${yy}" width="${W - 80}" height="56" rx="8" fill="${C.amberBg}" stroke="#d4a72c" stroke-width="1.5"/>`
	body += text(56, yy + 23, 's.127 statement rebuilt from on-chain events: 8,000 reached the lender after presentation, not 3,000.', { size: 14, weight: 600 })
	body += text(56, yy + 43, "The 5,000 released after act 1's dismissal landed after act 2's petition was presented. A dismissal clears only its own petition.", { size: 13, fill: C.ink2 })
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
		{ value: '10 / 11', label: 'loan steps run on Sepolia', sub: 'step 11 after the 2-day delay (19 Oct)' },
	]
	const W = 960
	const H = 420
	let body = frame(W, H)
	body += text(40, 50, "How it was checked: we didn't let the code's author be its only judge", { size: 22, weight: 600 })
	const tw = 280
	const th = 140
	tiles.forEach((t, i) => {
		const tx = 40 + (i % 3) * (tw + 20)
		const ty = 80 + Math.floor(i / 3) * (th + 20)
		body += card(tx, ty, tw, th, C.panel)
		body += text(tx + 20, ty + 52, t.value, { size: 36, weight: 700 })
		body += text(tx + 20, ty + 82, t.label, { size: 15, weight: 600 })
		body += text(tx + 20, ty + 108, t.sub, { size: 12.5, fill: C.ink2 })
	})
	writeFileSync(join(OUT, 'proof.svg'), svg(W, H, 'Verification: 3 of 3 contracts source-verified, 128,000 fuzzing calls, 5 of 5 planted bugs caught, 2,868 notices analysed, 66 tests, 11-step scenario on Sepolia', body))
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
		'CRE deploy access (requested) → DON runs it on a schedule',
		'Switch registry to the production KeystoneForwarder; pin workflow ID',
		'Registry owner → multisig + timelock, or renounced',
		'Optional court-filing source: 99% of E&W petitions are in CE-File courts',
		'Pilot with a facility agent or pool delegate on one real facility',
	]
	const W = 960
	const H = 450
	let body = frame(W, H)
	body += text(40, 50, 'Why it is buildable', { size: 22, weight: 600 })
	body += text(40, 76, 'Nothing here needs a consortium, a paid data feed or a new law', { size: 14, fill: C.ink2 })
	const col = (x: number, title: string, items: string[], color: string, bg: string, mark: string) => {
		let s = `<rect x="${x}" y="100" width="430" height="320" rx="10" fill="${bg}" stroke="${color}" stroke-width="1.5"/>`
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
	body += col(490, 'PATH TO PRODUCTION', next, C.series, '#ddf4ff', '→')
	writeFileSync(join(OUT, 'buildable.svg'), svg(W, H, 'Why it is buildable: built today versus path to production', body))
}
console.log('svg written to', OUT)

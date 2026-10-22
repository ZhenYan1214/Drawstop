// Statistics for the petition-lag study. Reads the CSVs written by fetch.ts (and ch.ts, if present) and writes
// results.json. Every figure is reproducible from the committed CSVs.
//
//   bun research/petition-lag/analyze.ts <noticesCsv> [chCsv] <outJson>

import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
const outJson = args.pop()!
const [noticesCsv, chCsv] = args
const DAY = 86400

type Notice = { id: string; code: string; companies: string[]; publishedAt: number; presentedAt: number; caseRef: string }
const notices: Notice[] = readFileSync(noticesCsv, 'utf-8')
	.trim()
	.split('\n')
	.slice(1)
	.map((l) => {
		const [id, code, companies, publishedAt, presentedAt, caseRef] = l.split(',')
		return { id, code, companies: companies ? companies.split(';') : [], publishedAt: +publishedAt, presentedAt: +presentedAt, caseRef: caseRef ?? '' }
	})

const utc = (d: string) => Date.parse(`${d}T00:00:00Z`) / 1000
const Q3_START = utc('2026-07-01')
const Q3_END = utc('2026-10-01')

const quantile = (sorted: number[], q: number) => {
	if (sorted.length === 0) return null
	const i = (sorted.length - 1) * q
	const lo = Math.floor(i)
	const hi = Math.ceil(i)
	return +(sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo)).toFixed(1)
}
const describe = (values: number[]) => {
	const s = [...values].sort((a, b) => a - b)
	return {
		n: s.length,
		min: s.length ? +s[0].toFixed(1) : null,
		p10: quantile(s, 0.1),
		p25: quantile(s, 0.25),
		median: quantile(s, 0.5),
		p75: quantile(s, 0.75),
		p90: quantile(s, 0.9),
		max: s.length ? +s[s.length - 1].toFixed(1) : null,
		mean: s.length ? +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(1) : null,
	}
}
const pct = (k: number, n: number) => (n === 0 ? null : +((100 * k) / n).toFixed(1))
const days = (from: number, to: number) => (to - from) / DAY

// ── 1. Petitions advertised in Q3 2026: presentation → advertisement ─────────────
const petitions = notices.filter((n) => (n.code === '2450' || n.code === '2451') && n.publishedAt >= Q3_START && n.publishedAt < Q3_END)
const withDate = petitions.filter((p) => p.presentedAt > 0 && p.presentedAt <= p.publishedAt)
// Whole calendar days (UTC dates): a carve-out "within N days of commencement" is still open on day N, and most
// notices carry a publication time of 00:00, so comparing exact timestamps would count day-N adverts as late.
const calendarDays = (from: number, to: number) => Math.floor(to / DAY) - Math.floor(from / DAY)
const lags = withDate.map((p) => calendarDays(p.presentedAt, p.publishedAt))
const carveOutClosedBeforeAdvert = Object.fromEntries(
	[7, 10, 14, 30, 60].map((d) => [`${d}d`, { count: lags.filter((l) => l > d).length, pct: pct(lags.filter((l) => l > d).length, lags.length) }]),
)

// ── 2. Winding-up orders: presentation → order notice ─────────────────────────────
const orders = notices.filter((n) => n.code === '2452')
const orderLags = orders.filter((o) => o.presentedAt > 0 && o.presentedAt <= o.publishedAt).map((o) => days(o.presentedAt, o.publishedAt))

// ── 3. What happened to the Q3 petitions (as advertised in the Gazette, by 15 Oct) ──
const sameProceeding = (a: Notice, b: Notice) =>
	(a.caseRef !== '' && a.caseRef === b.caseRef) ||
	(a.presentedAt !== 0 && a.presentedAt === b.presentedAt && a.companies.some((c) => b.companies.includes(c)))
const dismissals = notices.filter((n) => n.code === '2461')
const outcomes = { order: 0, dismissalAdvertised: 0, noNoticeYet: 0 }
const petitionToOrder: number[] = []
for (const p of petitions) {
	const order = orders.find((o) => o.publishedAt >= p.publishedAt && sameProceeding(p, o))
	const dismissal = dismissals.find((d) => d.publishedAt >= p.publishedAt && sameProceeding(p, d))
	if (order) {
		outcomes.order++
		petitionToOrder.push(days(p.publishedAt, order.publishedAt))
	} else if (dismissal) outcomes.dismissalAdvertised++
	else outcomes.noNoticeYet++
}

// ── 4. Companies House: what a register-only watcher sees ─────────────────────────
let companiesHouse: any = null
if (chCsv && existsSync(chCsv)) {
	const ch = new Map(
		readFileSync(chCsv, 'utf-8')
			.trim()
			.split('\n')
			.slice(1)
			.map((l) => {
				const [company, status, history, filings, checkedOn] = l.split(',')
				return [company, { status, history: history === 'true', filings: filings ? filings.split(';').map(utc) : [], checkedOn }] as const
			}),
	)
	const checkedOn = [...ch.values()][0]?.checkedOn ?? ''
	const nonActive = (s: string) => s !== 'active'

	// Companies whose petition was advertised in Q3: is there anything on the register?
	const petitionCompanies = [...new Set(petitions.flatMap((p) => (p.companies.length === 1 ? p.companies : [])))].filter((c) => ch.has(c))
	const petitionNoOrder = petitionCompanies.filter((c) => !orders.some((o) => o.companies.includes(c)))

	// Companies with a winding-up order advertised 1 Jul – 30 Sep (at least 16 days before the check).
	const orderedQ3 = orders.filter((o) => o.publishedAt >= Q3_START && o.publishedAt < Q3_END && o.companies.length === 1 && ch.has(o.companies[0]))
	const leads: number[] = []
	const leadsAfterPetitionAdvert: number[] = []
	const leadsOrderNoticeOnly: number[] = []
	const registerLag: number[] = []
	let noFilingYet = 0
	for (const o of orderedQ3) {
		const c = ch.get(o.companies[0])!
		// First moment Drawstop would see an adverse Gazette notice: the petition advertisement if it is in the dataset,
		// otherwise the order notice itself (conservative: understates the lead for petitions advertised before July).
		const petition = notices.find((p) => (p.code === '2450' || p.code === '2451') && sameProceeding(p, o))
		const gazetteFirst = Math.min(o.publishedAt, petition?.publishedAt ?? Number.POSITIVE_INFINITY)
		// First insolvency filing for this proceeding: on or after the petition's presentation date (or, if unknown,
		// no earlier than 60 days before the order notice).
		const from = o.presentedAt > 0 ? o.presentedAt - DAY : o.publishedAt - 60 * DAY
		const filed = c.filings.find((d) => d >= from)
		if (filed === undefined) {
			noFilingYet++
			continue
		}
		registerLag.push(days(o.publishedAt, filed))
		leads.push(days(gazetteFirst, filed))
		;(petition ? leadsAfterPetitionAdvert : leadsOrderNoticeOnly).push(days(gazetteFirst, filed))
	}
	// Orders advertised in the two weeks before the check: how many still read "active" on the register?
	const recentOrders = orders.filter((o) => o.publishedAt >= utc('2026-10-01') && o.companies.length === 1 && ch.has(o.companies[0]))
	companiesHouse = {
		checkedOn,
		ordersAdvertised1to15Oct: {
			companies: recentOrders.length,
			stillActivePct: pct(recentOrders.filter((o) => ch.get(o.companies[0])!.status === 'active').length, recentOrders.length),
		},
		petitionedNoOrder: {
			companies: petitionNoOrder.length,
			stillActivePct: pct(petitionNoOrder.filter((c) => ch.get(c)!.status === 'active').length, petitionNoOrder.length),
			noInsolvencyHistoryPct: pct(petitionNoOrder.filter((c) => !ch.get(c)!.history).length, petitionNoOrder.length),
		},
		orderedQ3: {
			companies: orderedQ3.length,
			stillActivePct: pct(orderedQ3.filter((o) => ch.get(o.companies[0])!.status === 'active').length, orderedQ3.length),
			nonActivePct: pct(orderedQ3.filter((o) => nonActive(ch.get(o.companies[0])!.status)).length, orderedQ3.length),
			noInsolvencyFilingYet: noFilingYet,
			orderNoticeToFirstInsolvencyFilingDays: describe(registerLag),
			drawstopLeadOverRegisterDays: describe(leads),
			drawstopEarlierPct: pct(leads.filter((l) => l > 0).length, leads.length),
			leadWhenPetitionWasAdvertised: { ...describe(leadsAfterPetitionAdvert), earlierPct: pct(leadsAfterPetitionAdvert.filter((l) => l > 0).length, leadsAfterPetitionAdvert.length) },
			leadFromOrderNoticeOnly: { ...describe(leadsOrderNoticeOnly), earlierPct: pct(leadsOrderNoticeOnly.filter((l) => l > 0).length, leadsOrderNoticeOnly.length) },
		},
	}
}

const results = {
	generatedFrom: { notices: notices.length, window: 'petitions advertised 2026-07-01..2026-09-30; orders and dismissals 2026-07-01..2026-10-15' },
	petitions: {
		advertised: petitions.length,
		withPresentationDate: withDate.length,
		presentationToAdvertisementDays: describe(lags),
		carveOutClosedBeforeAdvertisement: carveOutClosedBeforeAdvert,
	},
	orders: { notices: orders.length, presentationToOrderNoticeDays: describe(orderLags) },
	q3PetitionOutcomesBy15Oct: { ...outcomes, petitionAdvertToOrderNoticeDays: describe(petitionToOrder) },
	companiesHouse,
}
writeFileSync(outJson, JSON.stringify(results, null, 2) + '\n')
console.log(JSON.stringify(results, null, 2))

// Scenario mirror for the loan demo. Serves Gazette- and Companies House-shaped JSON for a FICTIONAL company so the
// facility lifecycle can be shown end to end without binding a real company to a test wallet.
//
//   bun run demo/scenario-server.ts            # http://localhost:8787
//   curl "http://localhost:8787/_scenario?set=petition"
//
// Scenarios: clean | petition | dismissed | order
// Dates are fixed relative to the moment a scenario is set, so a petition is always "presented 12 days ago,
// advertised 1 hour ago" when it first appears.

const PORT = Number(process.env.SCENARIO_PORT ?? 8787)
export const DEMO_COMPANY = 'DM000001' // not a valid Companies House prefix; clearly fictional
const DEMO_NAME = 'DEMO BORROWER LTD (FICTIONAL)'
const CASE_NUMBER = 'CR-2026-009999'
const NOTICE = { petition: '9000001', dismissal: '9000002', order: '9000003' }

type Scenario = 'clean' | 'petition' | 'dismissed' | 'order'
let scenario: Scenario = 'clean'
let setAt = Date.now()

const DAY = 86_400_000
const iso = (ms: number) => new Date(ms).toISOString().replace('.000Z', '+00:00')
const gazetteDate = (ms: number) => {
	const d = new Date(ms)
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const p = (n: number) => String(n).padStart(2, '0')
	return `${days[d.getUTCDay()]}, ${p(d.getUTCDate())}-${months[d.getUTCMonth()]}-${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`
}

const presentedAt = () => setAt - 12 * DAY
const petitionPublishedAt = () => setAt - 3_600_000

const noticesFor = (s: Scenario) => {
	const list: { id: string; code: string; label: string; published: number }[] = []
	if (s !== 'clean') list.push({ id: NOTICE.petition, code: '2450', label: 'Petitions to Wind Up (Companies)', published: petitionPublishedAt() })
	if (s === 'dismissed') list.push({ id: NOTICE.dismissal, code: '2461', label: 'Dismissal of Winding Up Petition', published: setAt })
	if (s === 'order') list.push({ id: NOTICE.order, code: '2452', label: 'Winding-Up Orders', published: setAt })
	return list
}

const linkedData = (n: { id: string; code: string; published: number }) => ({
	format: 'linked-data-api',
	version: '0.2',
	result: {
		primaryTopic: {
			hasNoticeCode: Number(n.code),
			hasNoticeID: Number(n.id),
			hasPublicationDate: gazetteDate(n.published),
			isAbout: {
				company: { companyNumber: DEMO_COMPANY, organisationName: DEMO_NAME },
				hasCourtCase: n.code === '2450' ? { caseNumber: CASE_NUMBER, caseYear: '2026' } : { caseNumber: '009999', caseYear: '2026' },
				...(n.code === '2450' ? { dateOfPetitionPresentation: iso(presentedAt()) } : { datePetitionFiled: iso(presentedAt()) }),
			},
		},
	},
})

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

Bun.serve({
	port: PORT,
	fetch(req) {
		const url = new URL(req.url)
		const path = url.pathname

		if (path === '/_scenario') {
			const set = url.searchParams.get('set') as Scenario | null
			if (set && ['clean', 'petition', 'dismissed', 'order'].includes(set)) {
				scenario = set
				setAt = Date.now()
			}
			return json({ scenario, setAt: new Date(setAt).toISOString(), notices: noticesFor(scenario) })
		}

		// Gazette corporate-insolvency search
		if (path === '/insolvency/notice/data.json') {
			const text = url.searchParams.get('text') ?? ''
			const entries = text.toUpperCase() === DEMO_COMPANY ? noticesFor(scenario) : []
			return json({
				'f:total': String(entries.length),
				entry: entries.map((n) => ({
					id: `https://www.thegazette.co.uk/id/notice/${n.id}`,
					'f:notice-code': n.code,
					category: { '@term': n.label },
					title: DEMO_NAME,
					published: new Date(n.published).toISOString().slice(0, 19),
				})),
			})
		}

		// Gazette notice linked data
		const m = path.match(/^\/notice\/(\d+)\/data\.json$/)
		if (m) {
			const n = noticesFor(scenario).find((x) => x.id === m[1])
			return n ? json(linkedData(n)) : json({ error: 'not found' }, 404)
		}

		// Companies House company profile. Stays "active" in every scenario, mirroring what the real register showed
		// for AMS FACILITIES (SW) LTD one week after its winding-up order.
		if (path === `/company/${DEMO_COMPANY}`) {
			return json({
				company_number: DEMO_COMPANY,
				company_name: DEMO_NAME,
				company_status: 'active',
				has_insolvency_history: false,
			})
		}

		return json({ error: 'not found' }, 404)
	},
})

console.log(`Scenario mirror on http://localhost:${PORT} (scenario: ${scenario})`)

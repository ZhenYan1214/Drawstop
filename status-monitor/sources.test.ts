// Tests against real responses recorded on 2026-10-14 (personal fields removed), for
// AMS FACILITIES (SW) LTD (11877818): petition presented 2026-08-11, advertised 2026-09-29 (notice 5219886),
// winding-up order 2026-10-07 advertised 2026-10-14 (notice 5229442); Companies House still "active".

import { describe, expect, test } from 'bun:test'
import gazetteSearch from './fixtures/gazette-search-11877818.json'
import petitionNotice from './fixtures/gazette-notice-5219886.json'
import orderNotice from './fixtures/gazette-notice-5229442.json'
import chProfile from './fixtures/ch-company-11877818.json'
import gleifRecord from './fixtures/gleif-2138002P5RNKC5W2JZ46.json'
import {
	classifyNotices,
	crossCheck,
	EV_CH_STATUS_ADVERSE,
	EV_GLEIF_LEI_LAPSED,
	EV_GZ_INSOLVENCY_PROCEEDING,
	EV_GZ_PETITION_DISMISSED,
	EV_GZ_PETITION_PENDING,
	EV_SOURCE_CONFLICT,
	fetchCompaniesHouse,
	fetchGazette,
	fetchGleif,
	type GazetteNotice,
	normalizeCaseRef,
	normalizeCompanyNumber,
	parseNotice,
	parseTimestamp,
} from './sources'

const utc = (iso: string) => Date.parse(iso) / 1000

/** Fake HTTPSendRequester that serves fixtures by URL and records the calls made. */
const fakeRequester = (routes: Record<string, { status?: number; body: unknown }>) => {
	const calls: { url: string; headers?: Record<string, string> }[] = []
	const requester = {
		sendRequest: (req: { url: string; headers?: Record<string, string> }) => ({
			result: () => {
				calls.push({ url: req.url, headers: req.headers })
				const key = Object.keys(routes).find((k) => req.url.includes(k))
				if (!key) return { statusCode: 404, body: Buffer.from('{}') }
				return { statusCode: routes[key].status ?? 200, body: Buffer.from(JSON.stringify(routes[key].body)) }
			},
		}),
	}
	return { requester: requester as any, calls }
}

const notice = (o: Partial<GazetteNotice>): GazetteNotice => ({
	id: '1',
	code: '2450',
	publishedAt: 0,
	presentedAt: 0,
	caseRef: '',
	...o,
})

describe('parsing helpers', () => {
	test('timestamps from every source format', () => {
		expect(parseTimestamp('2026-08-11T00:00:00+00:00')).toBe(utc('2026-08-11T00:00:00Z'))
		expect(parseTimestamp('Tuesday, 29-Sep-2026 09:30:08 UTC')).toBe(utc('2026-09-29T09:30:08Z'))
		expect(parseTimestamp('2025-11-21T07:42:21Z')).toBe(utc('2025-11-21T07:42:21Z'))
		expect(parseTimestamp(undefined)).toBe(0)
		expect(parseTimestamp('soon')).toBe(0)
	})

	test('court case references in both Gazette formats normalize to the same value', () => {
		expect(normalizeCaseRef('CR-2026-006286', '2026')).toBe('2026/006286')
		expect(normalizeCaseRef('006286', '2026')).toBe('2026/006286')
		expect(normalizeCaseRef('6286', '2026')).toBe('2026/006286')
		expect(normalizeCaseRef(undefined, '2026')).toBe('')
	})

	test('company numbers are zero-padded', () => {
		expect(normalizeCompanyNumber('445790')).toBe('00445790')
		expect(normalizeCompanyNumber('sc123456')).toBe('SC123456')
	})
})

describe('Gazette', () => {
	test('reads structured petition details from the real petition notice', () => {
		expect(parseNotice(petitionNotice, '11877818')).toEqual({
			id: '5219886',
			code: '2450',
			publishedAt: utc('2026-09-29T09:30:08Z'),
			presentedAt: utc('2026-08-11T00:00:00Z'),
			caseRef: '2026/006286',
		})
	})

	test('ignores a notice about a different company', () => {
		expect(parseNotice(petitionNotice, '00445790')).toBeNull()
	})

	test('real timeline: winding-up order supersedes the petition', () => {
		const { requester, calls } = fakeRequester({
			'insolvency/notice/data.json': { body: gazetteSearch },
			'notice/5219886/': { body: petitionNotice },
			'notice/5229442/': { body: orderNotice },
		})
		const r = fetchGazette(requester, { baseUrl: 'https://gz', companyNumber: '11877818', maxConfirmations: 4 })
		expect(r.ok).toBe(true)
		expect(r.eventBits).toBe(EV_GZ_INSOLVENCY_PROCEEDING)
		// s.127 exposure still runs from the presentation date of the petition the order was made on
		expect(r.petitionPresentedAt).toBe(utc('2026-08-11T00:00:00Z'))
		expect(r.petitionPublishedAt).toBe(utc('2026-09-29T09:30:08Z'))
		expect(r.petitionCaseRef).toBe('2026/006286')
		expect(r.updatedAt).toBe(utc('2026-10-14T14:00:14Z'))
		expect(r.notices).toBe('2450:5219886:2026/006286,2452:5229442:2026/006286')
		expect(calls.length).toBe(3) // search + 2 confirmations
		expect(calls[0].url).toContain('categorycode=G205010000')
	})

	test('real timeline as of 2026-09-29: petition pending with its presentation date', () => {
		const searchBeforeOrder = {
			...gazetteSearch,
			'f:total': '1',
			entry: (gazetteSearch as any).entry.filter((e: any) => e['f:notice-code'] === '2450'),
		}
		const { requester } = fakeRequester({
			'insolvency/notice/data.json': { body: searchBeforeOrder },
			'notice/5219886/': { body: petitionNotice },
		})
		const r = fetchGazette(requester, { baseUrl: 'https://gz', companyNumber: '11877818', maxConfirmations: 4 })
		expect(r.eventBits).toBe(EV_GZ_PETITION_PENDING)
		expect(r.petitionPresentedAt).toBe(utc('2026-08-11T00:00:00Z'))
		expect(r.petitionPublishedAt).toBe(utc('2026-09-29T09:30:08Z'))
		expect(r.petitionCaseRef).toBe('2026/006286')
	})

	test('respects the confirmation budget', () => {
		const { requester, calls } = fakeRequester({
			'insolvency/notice/data.json': { body: gazetteSearch },
			'notice/5229442/': { body: orderNotice },
		})
		fetchGazette(requester, { baseUrl: 'https://gz', companyNumber: '11877818', maxConfirmations: 1 })
		expect(calls.length).toBe(2)
		expect(calls[1].url).toContain('5229442') // newest first
	})

	test('a search with more results than one page is an error, not a clean result', () => {
		const { requester } = fakeRequester({
			'insolvency/notice/data.json': { body: { ...gazetteSearch, 'f:total': '25' } },
			'notice/5219886/': { body: petitionNotice },
			'notice/5229442/': { body: orderNotice },
		})
		expect(() => fetchGazette(requester, { baseUrl: 'https://gz', companyNumber: '11877818', maxConfirmations: 4 })).toThrow(
			'Gazette search incomplete: 2 of 25 results',
		)
	})

	test('unconfirmed older notices are an error unless a proceeding was confirmed', () => {
		const searchPetitionOnly = { ...gazetteSearch, entry: [...(gazetteSearch as any).entry] }
		// Order notice not served: the newest relevant notice confirms as nothing, the petition stays unconfirmed.
		searchPetitionOnly.entry[1] = { ...searchPetitionOnly.entry[1], 'f:notice-code': '2450' }
		const { requester } = fakeRequester({
			'insolvency/notice/data.json': { body: searchPetitionOnly },
			'notice/5229442/': { body: { result: { primaryTopic: {} } } }, // not about this company
		})
		expect(() => fetchGazette(requester, { baseUrl: 'https://gz', companyNumber: '11877818', maxConfirmations: 1 })).toThrow(
			'Gazette: 2 relevant notices, only 1 confirmable in one run',
		)
	})

	test('a failing search is an error, not a clean result', () => {
		const { requester } = fakeRequester({ 'insolvency/notice/data.json': { status: 503, body: {} } })
		expect(() => fetchGazette(requester, { baseUrl: 'https://gz', companyNumber: '11877818', maxConfirmations: 4 })).toThrow(
			'Gazette search HTTP 503',
		)
	})

	test('a dismissal clears only the petition with the same case reference', () => {
		const old = notice({ id: '10', code: '2450', caseRef: '2025/000001', presentedAt: 100 })
		const dismissedOld = notice({ id: '11', code: '2461', caseRef: '2025/000001' })
		const fresh = notice({ id: '20', code: '2450', caseRef: '2026/000002', presentedAt: 200, publishedAt: 250 })
		const r = classifyNotices([old, dismissedOld, fresh])
		expect(r.eventBits).toBe(EV_GZ_PETITION_PENDING | EV_GZ_PETITION_DISMISSED)
		expect(r.petitionPresentedAt).toBe(200)
	})

	test('a dismissed petition alone leaves only the dismissal flag', () => {
		const r = classifyNotices([
			notice({ id: '10', code: '2450', caseRef: '2026/000001' }),
			notice({ id: '11', code: '2461', caseRef: '2026/000001' }),
		])
		expect(r.eventBits).toBe(EV_GZ_PETITION_DISMISSED)
	})

	test('an order whose petition notice was not confirmed still carries the presentation date', () => {
		const r = classifyNotices([notice({ id: '20', code: '2452', caseRef: '2026/000001', presentedAt: 100, publishedAt: 300 })])
		expect(r.eventBits).toBe(EV_GZ_INSOLVENCY_PROCEEDING)
		expect(r.petitionPresentedAt).toBe(100)
		expect(r.petitionPublishedAt).toBe(0) // the petition's own advertisement was not seen
	})

	test('a dismissed petition carries no presentation date', () => {
		const r = classifyNotices([
			notice({ id: '10', code: '2450', caseRef: '2026/000001', presentedAt: 100 }),
			notice({ id: '11', code: '2461', caseRef: '2026/000001' }),
		])
		expect(r.petitionPresentedAt).toBe(0)
	})

	test('administration appointment is a proceeding', () => {
		expect(classifyNotices([notice({ code: '2410' })]).eventBits).toBe(EV_GZ_INSOLVENCY_PROCEEDING)
	})
})

describe('Companies House', () => {
	test('real profile one week after the winding-up order: still active, nothing flagged', () => {
		const { requester, calls } = fakeRequester({ '/company/11877818': { body: chProfile } })
		const r = fetchCompaniesHouse(requester, { baseUrl: 'https://ch', companyNumber: '11877818', apiKey: 'k' })
		expect(r).toEqual({ ok: true, error: '', eventBits: 0, companyStatus: 'active' })
		expect(calls[0].headers?.Authorization).toBe(`Basic ${Buffer.from('k:').toString('base64')}`)
	})

	test('adverse status is flagged', () => {
		const { requester } = fakeRequester({
			'/company/11877818': { body: { ...(chProfile as any), company_status: 'liquidation', has_insolvency_history: true } },
		})
		const r = fetchCompaniesHouse(requester, { baseUrl: 'https://ch', companyNumber: '11877818', apiKey: 'k' })
		expect(r.eventBits).toBe(EV_CH_STATUS_ADVERSE | 0b10)
	})

	test('a response for another company is rejected', () => {
		const { requester } = fakeRequester({ '/company/11877818': { body: { ...(chProfile as any), company_number: '00000001' } } })
		expect(() => fetchCompaniesHouse(requester, { baseUrl: 'https://ch', companyNumber: '11877818', apiKey: 'k' })).toThrow(
			'different company',
		)
	})
})

describe('GLEIF cross-check', () => {
	const fetchReal = () => {
		const { requester } = fakeRequester({ 'lei-records/2138002P5RNKC5W2JZ46': { body: gleifRecord } })
		return fetchGleif(requester, { baseUrl: 'https://gleif', lei: '2138002P5RNKC5W2JZ46' })
	}
	const chActive = { ok: true, error: '', eventBits: 0, companyStatus: 'active' }

	test('real Tesco record matches its company number', () => {
		const g = fetchReal()
		expect(g.registeredAs).toBe('00445790')
		expect(g.entityStatus).toBe('ACTIVE')
		expect(crossCheck('00445790', g, chActive)).toBe(0)
	})

	test('LEI bound to the wrong company is a conflict, not a pause', () => {
		expect(crossCheck('11877818', fetchReal(), chActive)).toBe(EV_SOURCE_CONFLICT)
	})

	test('lapsed LEI is watch only', () => {
		const lapsed = {
			...(gleifRecord as any),
			data: {
				...(gleifRecord as any).data,
				attributes: {
					...(gleifRecord as any).data.attributes,
					registration: { ...(gleifRecord as any).data.attributes.registration, status: 'LAPSED' },
				},
			},
		}
		const { requester } = fakeRequester({ 'lei-records/': { body: lapsed } })
		expect(fetchGleif(requester, { baseUrl: 'https://gleif', lei: '2138002P5RNKC5W2JZ46' }).eventBits).toBe(
			EV_GLEIF_LEI_LAPSED,
		)
	})
})

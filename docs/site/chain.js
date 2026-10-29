// Live reads from the Drawstop contracts on Ethereum Sepolia, shared by the landing page and the console.
// Read-only: eth_call / getLogs-free. Uses ethers (loaded from cdnjs) and a public RPC.
;(() => {
	const RPC = 'https://ethereum-sepolia-rpc.publicnode.com'
	const ADDR = {
		registry: '0x1AE232515B9C011152335e68314f12926e4d1245',
		facility: '0x911646d683e2d9bff45dec5bcee9b0bc142a0ab0',
		token: '0x687d8a7c046f6e44bfc9f031411fa5618d17645d',
		forwarder: '0x15fC6ae953E024d975e77382eEeC56A9101f9F88',
	}
	const NAMES = {
		'11877818': { name: 'AMS Facilities (SW) Ltd', note: 'Real company · public-record monitoring only, no loan' },
		'00445790': { name: 'Tesco PLC', note: 'Real company · control case, no loan' },
		DM000001: { name: 'DM000001 Borrower Ltd', note: 'Fictional borrower of the demo facility' },
	}
	const TXS = {
		'11877818': '0xfd78a1e72de6589e2dd1dda06b23b19219d9811de464011d0d4e437e10f1743e',
		'00445790': '0xeb8dc9acdb12b147e43d8673dc88e26480c876ea56b99849c447bca859e33e6a',
	}
	const BITS = [
		['Companies House status adverse', 'bad'],
		['Insolvency history at Companies House', 'watch'],
		['Winding-up petition pending', 'warn'],
		['Insolvency proceeding (order, resolution or appointment)', 'bad'],
		['Petition dismissed', 'ok'],
		['LEI lapsed', 'watch'],
		['Sources disagree', 'watch'],
	]
	const SOURCES = ['Companies House', 'The Gazette', 'GLEIF']
	const STATUS = {
		0: ['Unbound', 'muted', 'The borrower and lender have not both confirmed the binding yet.'],
		1: ['Stale', 'muted', 'The last check has expired. Drawdowns wait for a fresh check; nothing moves.'],
		2: ['Unverified', 'warn', 'A required source could not be checked. Drawdowns wait; this is not an adverse finding.'],
		3: ['Petition pending', 'warn', 'A winding-up petition is public and its carve-out is running. New drawdowns are stopped; repayments are held.'],
		4: ['Review required', 'bad', 'An insolvency proceeding is known. Drawdowns stop; a human decides what happens next.'],
		5: ['Watch', 'watch', 'A watch-only signal. Drawdowns continue.'],
		6: ['Normal', 'ok', 'Nothing adverse on record. Drawdowns are released after a fresh check.'],
		7: ['Defaulted', 'bad', 'The lender has declared a default.'],
	}
	const ABI = {
		registry: [
			'function getMonitored() view returns (bytes32[] ids, string[] companyNumbers, string[] leis)',
			'function getLatest(bytes32) view returns (tuple(uint256 id, uint64 checkedAt, uint64 validUntil, uint32 eventBits, uint32 unavailableBits, uint32 activeBits, uint64 chUpdatedAt, uint64 gazetteUpdatedAt, uint64 gleifUpdatedAt, uint64 petitionPresentedAt, uint64 petitionPublishedAt, bytes32 petitionCaseRef, bytes32 evidenceHash, bytes32 requestId))',
			'function attestationCount() view returns (uint256)',
		],
		facility: [
			'function status() view returns (uint8)',
			'function suspenseBalance() view returns (uint256)',
			'function lender() view returns (address)',
			'function borrower() view returns (address)',
			'function arbiter() view returns (address)',
			'function officeHolder() view returns (address)',
			'function officeHolderFrom() view returns (uint64)',
			'function petitionGracePeriod() view returns (uint64)',
			'function repaidSincePetitionPresented() view returns (uint256)',
			'function drawdowns(uint256) view returns (uint256 amount, uint64 requestedAt, bool executed)',
			'function repayments(uint256) view returns (uint256 amount, uint64 at, bool heldInSuspense)',
		],
		token: ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
	}
	let provider, registry, facility, token
	const ready = () => {
		if (provider) return
		provider = new ethers.JsonRpcProvider(RPC, 11155111, { staticNetwork: true })
		registry = new ethers.Contract(ADDR.registry, ABI.registry, provider)
		facility = new ethers.Contract(ADDR.facility, ABI.facility, provider)
		token = new ethers.Contract(ADDR.token, ABI.token, provider)
	}
	const usd = (v) => Number(ethers.formatUnits(v, 6)).toLocaleString('en-GB', { maximumFractionDigits: 0 })
	const date = (s) => (Number(s) ? new Date(Number(s) * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')
	const datetime = (s) => (Number(s) ? new Date(Number(s) * 1000).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC' : '—')
	const short = (a) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '—')

	// What a company's latest attestation means, in one headline
	const verdict = (a) => {
		if (!a || a.id === 0n) return ['No check yet', 'muted']
		const bits = Number(a.eventBits), un = Number(a.unavailableBits)
		if (bits & 8) return ['Winding-up order found', 'bad']
		if (bits & 1) return ['Adverse status at Companies House', 'bad']
		if (bits & 4) return ['Petition pending', 'warn']
		if (bits & 16) return ['Petition dismissed', 'ok']
		if (un) return ['Could not be checked', 'warn']
		if (bits) return ['Watch signal', 'watch']
		return ['Nothing found in any source', 'ok']
	}

	async function companies() {
		ready()
		const [ids, nums, leis] = await registry.getMonitored()
		const latest = await Promise.all(ids.map((id) => registry.getLatest(id)))
		return ids.map((id, i) => ({ id, number: nums[i], lei: leis[i], ...(NAMES[nums[i]] || { name: nums[i], note: '' }), tx: TXS[nums[i]], a: latest[i], verdict: verdict(latest[i]) }))
	}
	async function facilityState() {
		ready()
		const [st, susp, lender, borrower, arbiter, oh, ohFrom, grace, repaid] = await Promise.all([
			facility.status(), facility.suspenseBalance(), facility.lender(), facility.borrower(), facility.arbiter(),
			facility.officeHolder(), facility.officeHolderFrom(), facility.petitionGracePeriod(), facility.repaidSincePetitionPresented(),
		])
		const [bL, bB, bF, bO] = await Promise.all([token.balanceOf(lender), token.balanceOf(borrower), token.balanceOf(ADDR.facility), token.balanceOf(oh)])
		const list = async (fn) => { const out = []; for (let i = 0; i < 20; i++) { try { out.push(await facility[fn](i)) } catch (e) { break } } return out }
		const [draws, pays] = await Promise.all([list('drawdowns'), list('repayments')])
		return { status: Number(st), suspense: susp, lender, borrower, arbiter, officeHolder: oh, officeHolderFrom: ohFrom, grace, repaid, balances: { lender: bL, borrower: bB, facility: bF, officeHolder: bO }, draws, pays }
	}
	async function block() { ready(); return provider.getBlockNumber() }

	window.Drawstop = { RPC, ADDR, NAMES, BITS, SOURCES, STATUS, companies, facilityState, block, usd, date, datetime, short, verdict }
})()

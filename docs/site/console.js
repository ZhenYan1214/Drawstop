// Drawstop console: monitored companies and the demo facility, read live from Sepolia; "try to break it" as real
// eth_calls; an optional wallet connection that only reads your address (nothing is ever signed or sent).
;(() => {
	const $ = (s) => document.querySelector(s)
	const view = $('#view')
	let D, cos = [], fac = null, me = null, current = null

	const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
	const etherscan = (kind, x) => `https://sepolia.etherscan.io/${kind}/${x}`
	const icon = (cls) => `<svg><use href="#v-${cls === 'ok' ? 'ok' : cls === 'bad' ? 'bad' : cls === 'muted' ? 'muted' : 'warn'}"/></svg>`
	const kv = (rows) => `<dl class="kv">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`
	const now = () => Math.floor(Date.now() / 1000)

	// ── what the loan does with a company's record ─────────────────────────────
	const meaning = (c) => {
		const b = Number(c.a.eventBits)
		if (b & 8) return 'A winding-up order (or another insolvency proceeding) is on record. A facility for this company would refuse every drawdown, hold any repayment in suspense, and wait for a human decision.'
		if (b & 4) return 'A petition is on record. Drawdowns stop while the carve-out runs, repayments are held, and a dismissal for the same court case would release them.'
		if (Number(c.a.unavailableBits)) return 'At least one source could not be checked. A facility treats that as “wait and check again”, never as clean.'
		return 'Nothing adverse is on record. A facility would release a drawdown after a fresh check made after the request.'
	}

	function companyView(c) {
		const a = c.a
		const expired = Number(a.validUntil) < now()
		const found = D.BITS.map((bit, i) => (Number(a.eventBits) & (1 << i) ? `<span class="pill ${bit[1]}" style="margin:0 6px 6px 0">${bit[0]}</span>` : '')).join('') || '<span class="muted">Nothing</span>'
		const src = D.SOURCES.map((name, i) => {
			if (i === 2 && !c.lei) return `<div>${name} · <span class="muted">not checked (no LEI bound)</span></div>`
			return Number(a.unavailableBits) & (1 << i) ? `<div>${name} · <b style="color:var(--warn)">could not be checked</b></div>` : `<div>${name} · answered</div>`
		}).join('')
		const links = c.number === 'DM000001' ? '<span class="muted">Fictional company: its notices come from the demo’s local mirror.</span>'
			: `<a class="btn ghost small" href="https://www.thegazette.co.uk/company/${c.number}">The Gazette ↗</a> <a class="btn ghost small" href="https://find-and-update.company-information.service.gov.uk/company/${c.number}">Companies House ↗</a>`
		return `
			<div class="title-row"><div><h2>${esc(c.name)}</h2><p>Company ${c.number} · ${esc(c.note)}</p></div><div style="display:flex;gap:8px;flex-wrap:wrap">${links}</div></div>
			<div class="verdict ${c.verdict[1]}">${icon(c.verdict[1])}<div><b>${c.verdict[0]}</b><span>${meaning(c)}</span></div></div>
			<div class="grid2">
				<div class="panel"><h3>Latest signed record</h3><p class="lead">Written to the StatusRegistry by the CRE workflow.</p>
					${kv([
						['Checked', D.datetime(a.checkedAt)],
						['Valid until', D.datetime(a.validUntil) + (expired ? ' <span class="pill muted" style="margin-left:6px">expired</span>' : '')],
						['Found', found],
						['Sources', src],
						['Attestation', '#' + a.id + (c.tx ? ` · <a href="${etherscan('tx', c.tx)}">transaction ↗</a>` : '')],
						['Evidence hash', `<span class="mono">${D.short(a.evidenceHash)}</span>`],
					])}
				</div>
				<div class="panel"><h3>Petition on record</h3><p class="lead">Dates from The Gazette's linked data.</p>
					${kv([
						['Presented', D.date(a.petitionPresentedAt)],
						['Advertised', D.date(a.petitionPublishedAt)],
						['Gap', Number(a.petitionPresentedAt) ? Math.round((Number(a.petitionPublishedAt) - Number(a.petitionPresentedAt)) / 86400) + ' days hidden from free open data' : '—'],
					])}
					${c.number === '11877818' ? '<p class="note">Companies House registered this company’s winding-up order on 27 Oct 2026, 77 days after the petition was presented (filing history, COCOMP).</p>' : ''}
				</div>
			</div>
			${expired ? '<p class="note">This record has expired: the demo workflow is not running continuously on a DON yet, so records age out. A facility treats an expired record as “check again”, never as clean.</p>' : ''}`
	}

	// ── the demo facility ─────────────────────────────────────────────────────
	function role(addr) {
		if (!addr || !fac) return null
		const a = addr.toLowerCase()
		return a === fac.lender.toLowerCase() ? 'the lender' : a === fac.borrower.toLowerCase() ? 'the borrower' : a === fac.arbiter.toLowerCase() ? 'the arbiter' : 'not a party to this facility'
	}
	function facilityView() {
		const st = D.STATUS[fac.status]
		const ohFrom = Number(fac.officeHolderFrom)
		const rows = (list, f) => list.map(f).join('') || '<tr><td colspan="3" class="muted">None</td></tr>'
		return `
			<div class="title-row"><div><h2>Demo loan facility</h2><p>DM000001 Borrower Ltd · fictional borrower · mUSDC on Ethereum Sepolia</p></div>
				<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn ghost small" href="${etherscan('address', D.ADDR.facility)}">Contract ↗</a><a class="btn ghost small" href="https://repo.sourcify.dev/11155111/0x911646d683E2D9bFF45DEc5BcEE9b0bc142a0Ab0">Source-verified ↗</a></div></div>
			<div class="verdict ${st[1]}">${icon(st[1])}<div><b>${st[0]}</b><span>${st[2]}</span></div></div>
			<div class="money" style="margin-bottom:18px">
				<div><small>Held in suspense</small><b>${D.usd(fac.suspense)}</b></div>
				<div><small>Official Receiver (stand-in)</small><b>${D.usd(fac.balances.officeHolder)}</b></div>
				<div><small>Lender</small><b>${D.usd(fac.balances.lender)}</b></div>
				<div><small>Borrower</small><b>${D.usd(fac.balances.borrower)}</b></div>
			</div>
			<div class="grid2">
				<div class="panel"><h3>Drawdowns</h3><p class="lead">Each one needs a check made after the request.</p>
					<table class="t"><tr><th>#</th><th>Amount</th><th>Result</th></tr>${rows(fac.draws, (d, i) => `<tr><td>${i}</td><td class="mono">${D.usd(d.amount)}</td><td>${d.executed ? '<span class="pill ok">Released</span>' : '<span class="pill bad">Not released</span>'}</td></tr>`)}</table>
				</div>
				<div class="panel"><h3>Repayments</h3><p class="lead">Held when a petition or proceeding is known.</p>
					<table class="t"><tr><th>#</th><th>Amount</th><th>Went to</th></tr>${rows(fac.pays, (p, i) => `<tr><td>${i}</td><td class="mono">${D.usd(p.amount)}</td><td>${p.heldInSuspense ? '<span class="pill warn">Suspense</span>' : '<span class="pill ok">Lender</span>'}</td></tr>`)}</table>
				</div>
			</div>
			<div class="panel"><h3>Terms and parties</h3>
				${kv([
					['Petition carve-out', `${Number(fac.grace) / 86400} days from presentation`],
					['Lender', `<span class="mono">${D.short(fac.lender)}</span>`],
					['Borrower', `<span class="mono">${D.short(fac.borrower)}</span>`],
					['Arbiter (neutral reviewer)', `<span class="mono">${D.short(fac.arbiter)}</span>`],
					['Office-holder', fac.officeHolder === ethers.ZeroAddress ? '—' : `<span class="mono">${D.short(fac.officeHolder)}</span> · could receive suspense from ${D.datetime(ohFrom)}`],
				])}
				<p class="note">Every transaction of the 11-step scenario is linked on the <a href="story.html#sepolia">evidence page</a>. The full s.127 statement shows at least 8,000 reached the lender after the second petition was presented, more than the contract's own counter (${D.usd(fac.repaid)}) because it counts direct pass-throughs only.</p>
			</div>
			${tryPanel()}`
	}

	// ── try to break it ───────────────────────────────────────────────────────
	const RANDOM = '0x' + [...crypto.getRandomValues(new Uint8Array(20))].map((b) => b.toString(16).padStart(2, '0')).join('')
	const who = () => me || RANDOM
	function tryPanel() {
		const r = role(me)
		return `<div class="panel" id="try"><h3>Try to break it</h3>
			<p class="lead">Each button sends a real <span class="mono">eth_call</span> to the deployed contracts. The network runs the contract code and returns what it would do. Nothing is signed, sent or spent.
			You act as <span class="mono">${D.short(who())}</span>${me ? ` (your wallet: ${r})` : ' (a random address)'}.</p>
			<div class="attempt"><button class="btn ghost" data-attempt="report">Write a status into the registry yourself</button><div class="out"></div></div>
			<div class="attempt"><button class="btn ghost" data-attempt="payme">Pay the money held in suspense to yourself</button><div class="out"></div></div>
			<div class="attempt"><button class="btn ghost" data-attempt="arbiter">Do it as the arbiter instead</button><div class="out"></div></div>
			<div class="attempt"><button class="btn ghost" data-attempt="release">Release the held money to the lender now</button><div class="out"></div></div>
			<p class="note">Each attempt targets the contract directly. On testnet the simulation forwarder itself does not check signatures (see <a href="story.html#limits">limits</a>); production uses the KeystoneForwarder, which does. Suspense is empty today, and the refusals do not depend on the balance.</p></div>`
	}
	const word = (h) => h.replace(/^0x/, '').toLowerCase().padStart(64, '0')
	const reason = word('01')
	const attempts = () => ({
		report: { from: who(), to: D.ADDR.registry, data: '0x805f2132' + word('40') + word('60') + word('0') + word('0') },
		payme: { from: who(), to: D.ADDR.facility, data: '0xe6f6f6a2' + word(who()) + reason },
		arbiter: { from: fac.arbiter, to: D.ADDR.facility, data: '0xe6f6f6a2' + word(who()) + reason },
		release: { from: who(), to: D.ADDR.facility, data: '0xb9ab8455' },
	})
	const addr = (data, i) => '0x' + data.slice(10 + 64 * i + 24, 10 + 64 * (i + 1))
	const errors = {
		'0xe1130dba': (d) => [`InvalidSender(${D.short(addr(d, 0))}, ${D.short(addr(d, 1))})`, `Only the forwarder (${D.short(addr(d, 1))}) may write a status, so the registry refuses before reading your report.`],
		'0xe598e3ce': () => ['OnlyArbiter()', 'Money held in suspense can be moved only by the arbiter named in the agreement.'],
		'0x17858bbe': (d) => [`InvalidRecipient(${D.short(addr(d, 0))})`, 'Even the arbiter can pay suspense only to the lender, the borrower, or an office-holder nominated two days in advance.'],
		'0x52eb2647': (d) => { const s = D.STATUS[parseInt(d.slice(10, 74), 16)]; return [`SuspenseNotReleasable(${s ? s[0].toUpperCase().replace(' ', '_') : '?'})`, `Held money goes back to the lender only on a fresh record that shows no petition. The facility reads “${s ? s[0] : '?'}”.`] },
	}
	async function attempt(btn) {
		const out = btn.parentElement.querySelector('.out')
		out.innerHTML = '<span class="pill muted">Asking Sepolia…</span>'
		btn.disabled = true
		try {
			const body = (id, method, params) => fetch(D.RPC, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id, method, params }) }).then((r) => r.json())
			const [r, b] = await Promise.all([body(1, 'eth_call', [attempts()[btn.dataset.attempt], 'latest']), body(2, 'eth_blockNumber', [])])
			const data = r.error && typeof r.error.data === 'string' ? r.error.data : ''
			const decoder = errors[data.slice(0, 10)], dec = decoder && decoder(data)
			const blk = b.result ? parseInt(b.result, 16).toLocaleString('en-GB') : '?'
			out.innerHTML = dec ? `<span class="pill bad">Refused</span> <code>${dec[0]}</code><p>${dec[1]}</p><p class="meta">Answered by the deployed contract at block ${blk}.</p>`
				: r.error ? `<span class="pill warn">Reverted</span> <code>${esc((r.error.message || '').slice(0, 80))}</code>` : '<span class="pill warn">Not refused</span><p>The call went through. That should not happen; please open an issue on GitHub.</p>'
		} catch (e) { out.innerHTML = '<span class="pill muted">No answer</span><p>Could not reach the Sepolia node from this browser. Try again.</p>' }
		btn.disabled = false
	}

	// ── navigation ────────────────────────────────────────────────────────────
	function show(key) {
		current = key
		document.querySelectorAll('.item[data-view]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === key)))
		if (key === 'facility') view.innerHTML = facilityView()
		else { const c = cos.find((x) => x.number === key); view.innerHTML = c ? companyView(c) : '' }
		view.querySelectorAll('[data-attempt]').forEach((b) => b.addEventListener('click', () => attempt(b)))
		if (location.hash.slice(1) !== key && !(key === 'facility' && location.hash === '#try')) history.replaceState(null, '', '#' + key)
	}
	function sidebar() {
		$('#companies').innerHTML = cos.map((c) => `<button class="item" type="button" data-view="${c.number}" aria-selected="false"><span class="dot ${c.verdict[1]}"></span><span><b>${esc(c.name)}</b><small>${c.verdict[0]}</small></span></button>`).join('')
		$('#dot-facility').className = 'dot ' + D.STATUS[fac.status][1]
		document.querySelectorAll('.item[data-view]').forEach((b) => b.addEventListener('click', () => show(b.dataset.view)))
	}

	// ── wallet (optional, read-only) ──────────────────────────────────────────
	$('#connect').addEventListener('click', async () => {
		if (!window.ethereum) { alert('No browser wallet found. You do not need one: everything on this page works without it.'); return }
		try {
			const [a] = await window.ethereum.request({ method: 'eth_requestAccounts' })
			me = a
			$('#connect').textContent = D.short(a)
			if (current) show(current)
		} catch (e) { /* user declined */ }
	})

	async function boot() {
		D = window.Drawstop
		try {
			const [c, f, blk] = await Promise.all([D.companies(), D.facilityState(), D.block()])
			cos = c; fac = f
			$('#net').textContent = `Sepolia · block ${blk.toLocaleString('en-GB')}`
			sidebar()
			const h = location.hash.slice(1)
			show(h === 'try' || h === 'facility' ? 'facility' : cos.some((x) => x.number === h) ? h : '11877818')
			if (h === 'try') setTimeout(() => $('#try') && $('#try').scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
		} catch (e) {
			$('#net').textContent = 'Sepolia · unreachable'; $('#net').className = 'pill warn'
			view.innerHTML = '<div class="panel"><h3>Could not reach Sepolia from this browser</h3><p class="lead">The public RPC did not answer. Try again in a moment, or see every transaction on the <a href="story.html#sepolia">evidence page</a>.</p></div>'
		}
	}
	addEventListener('hashchange', () => {
		if (!fac) return
		const h = location.hash.slice(1)
		const key = h === 'try' || h === 'facility' ? 'facility' : cos.some((x) => x.number === h) ? h : null
		if (key && key !== current) show(key)
		if (h === 'try') setTimeout(() => $('#try') && $('#try').scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
	})
	const wait = () => (window.ethers && window.Drawstop ? boot() : setTimeout(wait, 100))
	wait()
})()

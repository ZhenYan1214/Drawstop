// "Try to break it": each attempt is a real eth_call against the contracts deployed on Ethereum Sepolia. The node runs
// the contract code and returns the revert; nothing is signed, sent or spent. The arbiter attempt borrows the
// arbiter's address as `from`, which eth_call allows without its key: that is the point, even the arbiter is refused.
;(() => {
	const RPC = 'https://ethereum-sepolia-rpc.publicnode.com'
	const REGISTRY = '0x1AE232515B9C011152335e68314f12926e4d1245'
	const FACILITY = '0x911646d683e2d9bff45dec5bcee9b0bc142a0ab0'
	const ARBITER = '0xd85fc9E99902967BC115026A13f7C57152D9CC8d'
	const STATUS = ['UNBOUND', 'STALE', 'UNVERIFIED', 'PETITION_PENDING', 'REVIEW_REQUIRED', 'WATCH', 'NORMAL', 'DEFAULTED']

	const root = document.getElementById('try')
	if (!root) return
	const hex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
	const you = '0x' + hex(crypto.getRandomValues(new Uint8Array(20)))
	const word = (h) => h.replace(/^0x/, '').toLowerCase().padStart(64, '0')
	const short = (a) => a.slice(0, 6) + '…' + a.slice(-4)
	const reason = word('01') // any non-zero reason hash
	root.querySelector('#try-you').textContent = short(you)

	const attempts = {
		report: { from: you, to: REGISTRY, data: '0x805f2132' + word('40') + word('60') + word('0') + word('0') },
		payme: { from: you, to: FACILITY, data: '0xe6f6f6a2' + word(you) + reason },
		arbiter: { from: ARBITER, to: FACILITY, data: '0xe6f6f6a2' + word(you) + reason },
		release: { from: you, to: FACILITY, data: '0xb9ab8455' },
	}
	const addr = (data, i) => '0x' + data.slice(10 + 64 * i + 24, 10 + 64 * (i + 1))
	const errors = {
		'0xe1130dba': (d) => ({
			name: `InvalidSender(${short(addr(d, 0))}, ${short(addr(d, 1))})`,
			why: `Only the Chainlink forwarder (${short(addr(d, 1))}) can write a status. You are ${short(addr(d, 0))}, so the registry refuses before reading a word of your report.`,
		}),
		'0xe598e3ce': () => ({ name: 'OnlyArbiter()', why: 'Money held in suspense can be moved only by the arbiter named in the agreement.' }),
		'0x17858bbe': (d) => ({
			name: `InvalidRecipient(${short(addr(d, 0))})`,
			why: 'Even the arbiter can pay suspense only to the lender, the borrower, or an office-holder nominated two days in advance. Not to itself, not to you.',
		}),
		'0x52eb2647': (d) => {
			const s = STATUS[parseInt(d.slice(10, 74), 16)] || 'unknown'
			return {
				name: `SuspenseNotReleasable(${s})`,
				why: `Held money goes back to the lender only on a fresh record that shows no petition. The facility reads ${s}${s === 'STALE' ? ': its last check has expired, so nothing moves until the workflow checks again' : ''}.`,
			}
		},
	}

	const call = async (body) => {
		const res = await fetch(RPC, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
		return res.json()
	}

	root.querySelectorAll('button[data-attempt]').forEach((btn) =>
		btn.addEventListener('click', async () => {
			const out = btn.parentElement.querySelector('.out')
			out.className = 'out wait'
			out.innerHTML = '<span class="stamp">Asking Sepolia…</span>'
			btn.disabled = true
			try {
				const [r, b] = await Promise.all([
					call({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [attempts[btn.dataset.attempt], 'latest'] }),
					call({ jsonrpc: '2.0', id: 2, method: 'eth_blockNumber', params: [] }),
				])
				const block = b.result ? parseInt(b.result, 16).toLocaleString('en-GB') : '?'
				const data = r.error && typeof r.error.data === 'string' ? r.error.data : ''
				const decode = errors[data.slice(0, 10)]
				if (decode) {
					const e = decode(data)
					out.className = 'out refused'
					out.innerHTML = `<span class="stamp">Refused</span> <code class="mono">${e.name}</code><p>${e.why}</p><p class="meta">Answered by the deployed contract at block ${block}.</p>`
				} else if (r.error) {
					out.className = 'out'
					out.innerHTML = `<span class="stamp">Reverted</span> <code class="mono">${(r.error.message || 'unknown').slice(0, 80)}</code><p class="meta">Block ${block}. Unexpected reason; please open an issue on GitHub.</p>`
				} else {
					out.className = 'out'
					out.innerHTML = `<span class="stamp">Not refused</span><p>The call went through. That should not happen; please open an issue on GitHub.</p>`
				}
			} catch (e) {
				out.className = 'out'
				out.innerHTML = '<span class="stamp">No answer</span><p>Could not reach the Sepolia node from this browser. Try again in a moment.</p>'
			}
			btn.disabled = false
		}),
	)
})()

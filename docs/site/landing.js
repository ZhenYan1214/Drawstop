// Landing page: nav shadow, scroll reveal, count-up stats, the animated facility mock, and live cards from Sepolia.
;(() => {
	const $ = (s) => document.querySelector(s)
	const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

	// nav
	const nav = $('#nav')
	addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true })

	// reveal + count-up
	const count = (el) => {
		const to = +el.dataset.count, suf = el.dataset.suffix || ''
		if (reduced) return (el.textContent = to + suf)
		const t0 = performance.now(), d = 1300
		const tick = (t) => { const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(tick) }
		requestAnimationFrame(tick)
	}
	const io = new IntersectionObserver((es) => es.forEach((e) => {
		if (!e.isIntersecting) return
		e.target.classList.add('in')
		e.target.querySelectorAll('[data-count]').forEach(count)
		io.unobserve(e.target)
	}), { threshold: 0.2 })
	document.querySelectorAll('.rv').forEach((el) => io.observe(el))

	// animated mock: Normal -> petition advertised -> drawdown refused -> repayment held, on a loop
	const m = { toast: $('#m-toast'), status: $('#m-status'), drawn: $('#m-drawn'), held: $('#m-held'), what: $('#m-what'), stamp: $('#m-stamp'), prog: $('#m-prog'), live: $('#m-live') }
	const setStatus = (txt, cls) => { m.status.textContent = txt; m.status.className = 'pill ' + cls }
	const act = (what, sub, stamp, cls) => {
		m.stamp.classList.remove('show')
		setTimeout(() => { m.what.innerHTML = `${what}<small>${sub}</small>`; m.stamp.textContent = stamp; m.stamp.className = 'stamp ' + cls; requestAnimationFrame(() => m.stamp.classList.add('show')) }, 250)
	}
	const LOOP = 12000
	const run = () => {
		setStatus('Normal', 'ok'); m.drawn.textContent = '0'; m.held.textContent = '0'; m.toast.classList.remove('show')
		act('Drawdown request · 10,000', 'Fresh check of the public record: nothing found', 'Released', 'ok')
		const at = (ms, f) => setTimeout(f, ms)
		at(1300, () => (m.drawn.textContent = '10,000'))
		at(3600, () => m.toast.classList.add('show'))
		at(4700, () => setStatus('Petition pending', 'warn'))
		at(5600, () => m.toast.classList.remove('show'))
		at(5900, () => act('Drawdown request · 10,000', 'Fresh check: petition on record', 'Refused', 'bad'))
		at(8300, () => act('Repayment · 5,000', 'Paid while the petition is known', 'Held', 'warn'))
		at(8900, () => (m.held.textContent = '5,000'))
		if (!reduced) { m.prog.style.transition = 'none'; m.prog.style.width = '0'; requestAnimationFrame(() => requestAnimationFrame(() => { m.prog.style.transition = `width ${LOOP}ms linear`; m.prog.style.width = '100%' })) }
	}
	if (reduced) { setStatus('Petition pending', 'warn'); m.drawn.textContent = '10,000'; m.held.textContent = '5,000'; m.what.innerHTML = 'Drawdown request · 10,000<small>Fresh check: petition on record</small>'; m.stamp.textContent = 'Refused'; m.stamp.className = 'stamp bad show' }
	else { run(); setInterval(run, LOOP) }

	// live cards
	const card = (title, sub, pill, cls, facts) => `<div class="live"><div class="who">${title}<small>${sub}</small></div><span class="pill ${cls}" style="align-self:flex-start">${pill}</span><div class="facts">${facts.map(([k, v]) => `<div><span class="muted">${k}</span><span>${v}</span></div>`).join('')}</div></div>`
	const load = async () => {
		const D = window.Drawstop
		try {
			const [cos, fac, blk] = await Promise.all([D.companies(), D.facilityState(), D.block()])
			const real = cos.filter((c) => c.number !== 'DM000001')
			const html = real.map((c) => card(c.name, `Company ${c.number} · ${c.note}`, c.verdict[0], c.verdict[1], [
				['Last checked', D.datetime(c.a.checkedAt)],
				['Attestation', '#' + c.a.id],
			]))
			const st = D.STATUS[fac.status]
			html.push(card('Demo loan facility', 'Fictional borrower DM000001 · mUSDC', st[0], st[1], [
				['Meaning', fac.status === 1 ? 'last check expired, nothing moves' : st[0]],
				['Held in suspense', D.usd(fac.suspense)],
				['Returned to Official Receiver', D.usd(fac.balances.officeHolder)],
			]))
			$('#live-grid').innerHTML = html.join('')
			$('#live-block').textContent = `Block ${blk.toLocaleString('en-GB')}.`
		} catch (e) {
			$('#live-grid').innerHTML = `<div class="live" style="grid-column:1/-1"><b>Could not reach Sepolia from this browser.</b><span class="muted">The public RPC did not answer. Try again in a moment, or see the transactions in the <a href="story.html#sepolia">evidence</a>.</span></div>`
		}
	}
	const waitEthers = () => (window.ethers && window.Drawstop ? load() : setTimeout(waitEthers, 100))
	waitEthers()
})()

// Drawstop site: ruler, Exhibit A (carve-out chart), Sepolia docket, running head, editions.
;(() => {
	const $ = (s, el = document) => el.querySelector(s)
	const $$ = (s, el = document) => [...el.querySelectorAll(s)]
	const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
	const fmt = (n) => n.toLocaleString('en-GB')
	const SVG = 'http://www.w3.org/2000/svg'
	const el = (name, attrs = {}, parent) => {
		const node = document.createElementNS(SVG, name)
		for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v)
		if (parent) parent.appendChild(node)
		return node
	}

	// ── Editions (day / night) ────────────────────────────────────────────────
	const root = document.documentElement
	const isDark = () => root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches)
	const labelEditions = () => $$('[data-edition]').forEach((b) => (b.textContent = isDark() ? 'Day edition' : 'Night edition'))
	$$('[data-edition]').forEach((b) =>
		b.addEventListener('click', () => {
			root.dataset.theme = isDark() ? 'light' : 'dark'
			try { localStorage.setItem('drawstop-edition', root.dataset.theme) } catch (e) {}
			labelEditions()
		}),
	)
	labelEditions()
	matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', labelEditions)

	// ── Running head, reading progress, active section ───────────────────────
	const runner = $('#runner')
	const progress = $('#progress')
	const masthead = $('.masthead')
	new IntersectionObserver(([e]) => {
		const show = !e.isIntersecting
		runner.classList.toggle('show', show)
		runner.setAttribute('aria-hidden', String(!show))
		$$('a, button', runner).forEach((a) => (a.tabIndex = show ? 0 : -1))
	}).observe(masthead)
	const onScroll = () => {
		const max = document.documentElement.scrollHeight - innerHeight
		progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`
	}
	addEventListener('scroll', onScroll, { passive: true })
	onScroll()
	// active section: the last one whose top has passed the upper third of the window
	const links = new Map($$('nav a', runner).map((a) => [a.getAttribute('href').slice(1), a]))
	const sections = $$('section.part')
	let active = null
	const markActive = () => {
		const line = innerHeight * 0.33
		let id = null
		for (const s of sections) if (s.getBoundingClientRect().top <= line) id = s.id
		if (id === active) return
		active = id
		links.forEach((a, key) => a.classList.toggle('active', key === id))
	}
	addEventListener('scroll', markActive, { passive: true })
	markActive()

	// ── Reveal on scroll ─────────────────────────────────────────────────────
	const revealObs = new IntersectionObserver(
		(entries) => entries.forEach((e) => {
			if (!e.isIntersecting) return
			e.target.classList.add('in')
			if (e.target.id === 'flow') e.target.classList.add('in')
			revealObs.unobserve(e.target)
		}),
		{ rootMargin: '0px 0px -8% 0px' },
	)
	$$('.reveal').forEach((n) => revealObs.observe(n))

	// ── The ruler ────────────────────────────────────────────────────────────
	const ruler = $('#ruler')
	const ticks = $('#ticks')
	const X0 = 20
	const PX = (1080 - 20) / 42
	for (let d = 0; d <= 42; d++) {
		const major = d % 7 === 0
		el('line', { class: 'tick' + (major ? ' major' : ''), x1: X0 + d * PX, x2: X0 + d * PX, y1: 80, y2: major ? 66 : 74 }, ticks)
		if (major && d > 0) el('text', { class: 'daynum', x: X0 + d * PX, y: 108, 'text-anchor': 'middle' }, ticks).textContent = d
	}
	const drawRuler = () => requestAnimationFrame(() => ruler.classList.add('drawn'))
	if (reduced) ruler.classList.add('drawn')
	else if (document.fonts?.ready) document.fonts.ready.then(drawRuler)
	else drawRuler()

	// ── Exhibit A: the carve-out chart ───────────────────────────────────────
	const lags = (window.DRAWSTOP_LAGS || []).slice().sort((a, b) => a - b)
	const N = lags.length
	const CAP = 70 // last bar is 71+
	const counts = new Array(CAP + 2).fill(0)
	for (const l of lags) counts[Math.min(l, CAP + 1)]++
	const median = lags[Math.floor((N - 1) / 2)]

	const svg = $('#hist')
	const chartBox = $('#chart')
	let W, H, L = 40, R = 8, T = 30, B = 40, bw, yMax, y, xOf, shade, bars, cut, cutLabel, hit
	const bins = counts.length
	const build = () => {
		W = Math.round(Math.max(320, Math.min(760, chartBox.clientWidth || 760)))
		const narrow = W < 520
		H = narrow ? 270 : 340
		L = narrow ? 30 : 40
		svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
		svg.replaceChildren()
		bw = (W - L - R) / bins
		yMax = Math.ceil(Math.max(...counts) / 25) * 25
		y = (v) => H - B - (v / yMax) * (H - T - B)
		xOf = (day) => L + day * bw
		for (let v = 0; v <= yMax; v += 25) {
			el('line', { class: 'grid', x1: L, x2: W - R, y1: y(v), y2: y(v) }, svg)
			if (v % 50 === 0) el('text', { x: L - 6, y: y(v) + 4, 'text-anchor': 'end' }, svg).textContent = v
		}
		shade = el('rect', { class: 'shade', y: T - 10, height: H - B - T + 10 }, svg)
		bars = counts.map((c, d) => el('rect', { class: 'bar', x: xOf(d) + (narrow ? 0.3 : 0.6), width: Math.max(bw - (narrow ? 0.6 : 1.2), 1), y: y(c), height: H - B - y(c) }, svg))
		el('line', { class: 'axis', x1: L, x2: W - R, y1: H - B, y2: H - B }, svg)
		for (const d of narrow ? [0, 14, 28, 42, 56] : [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]) {
			el('line', { class: 'axis', x1: xOf(d) + bw / 2, x2: xOf(d) + bw / 2, y1: H - B, y2: H - B + 5 }, svg)
			el('text', { x: xOf(d) + bw / 2, y: H - B + 19, 'text-anchor': 'middle' }, svg).textContent = d
		}
		el('text', { x: xOf(CAP + 1) + bw / 2, y: H - B + 19, 'text-anchor': 'end' }, svg).textContent = '71+'
		el('text', { x: (L + W - R) / 2, y: H - 4, 'text-anchor': 'middle' }, svg).textContent = 'days from presentation to advertisement'
		const mx = xOf(median) + bw / 2
		el('line', { class: 'median', x1: mx, x2: mx, y1: T - 4, y2: H - B }, svg)
		el('text', { class: 'median-label', x: mx + 6, y: T + 4 }, svg).textContent = `median ${median} days`
		cut = el('line', { class: 'cut', y1: T - 18, y2: H - B }, svg)
		cutLabel = el('text', { class: 'cut-label', y: T - 22 }, svg)
		hit = el('rect', { class: 'hit', x: L, y: 0, width: W - L - R, height: H - B }, svg)
		bindChart()
	}

	const pct = $('#pct'), sentence = $('#sentence'), count = $('#count'), slider = $('#days'), daysOut = $('#days-out'), tip = $('#tip')
	const presets = $$('.presets button')
	let current = 14
	const render = (days) => {
		current = Math.max(0, Math.min(CAP, Math.round(days)))
		const late = lags.filter((l) => l > current).length
		const share = (100 * late) / N
		pct.innerHTML = `${share.toFixed(1)}<small>%</small>`
		sentence.innerHTML = `of petitions became public only after a <b>${current}-day</b> carve-out, counted from presentation, had already closed.`
		count.textContent = `${fmt(late)} of ${fmt(N)} petitions`
		daysOut.textContent = current
		slider.value = current
		slider.setAttribute('aria-valuetext', `${current} days: ${share.toFixed(1)} percent public after the carve-out closed`)
		const cx = xOf(current + 1)
		cut.setAttribute('x1', cx); cut.setAttribute('x2', cx)
		shade.setAttribute('x', cx); shade.setAttribute('width', Math.max(0, W - R - cx))
		const anchorEnd = cx > W - 180
		cutLabel.setAttribute('x', anchorEnd ? cx - 6 : cx + 6)
		cutLabel.setAttribute('text-anchor', anchorEnd ? 'end' : 'start')
		cutLabel.textContent = `day ${current}: carve-out closes`
		bars.forEach((b, d) => b.classList.toggle('late', d > current))
		presets.forEach((p) => p.setAttribute('aria-pressed', String(Number(p.dataset.days) === current)))
	}
	slider.addEventListener('input', () => render(Number(slider.value)))
	presets.forEach((p) => p.addEventListener('click', () => animateTo(Number(p.dataset.days))))
	const animateTo = (target) => {
		if (reduced) return render(target)
		const from = current, start = performance.now(), dur = 420
		const step = (t) => {
			const k = Math.min(1, (t - start) / dur)
			render(from + (target - from) * (1 - Math.pow(1 - k, 3)))
			if (k < 1) requestAnimationFrame(step)
		}
		requestAnimationFrame(step)
	}

	// drag / hover on the chart
	const toDay = (evt) => {
		const r = svg.getBoundingClientRect()
		const sx = ((evt.clientX - r.left) / r.width) * W
		return { day: Math.floor((sx - L) / bw), sx, r }
	}
	let dragging = false
	function bindChart() {
	hit.addEventListener('pointerdown', (e) => { dragging = true; hit.setPointerCapture(e.pointerId); render(toDay(e).day - 1) })
	hit.addEventListener('pointerup', () => (dragging = false))
	hit.addEventListener('pointercancel', () => (dragging = false))
	hit.addEventListener('pointermove', (e) => {
		const { day, r } = toDay(e)
		if (dragging) render(day - 1)
		if (day < 0 || day >= bins) return tip.classList.remove('on')
		const c = counts[day]
		const label = day === CAP + 1 ? `${CAP + 1}+ days` : `day ${day}`
		tip.textContent = `${label}: ${fmt(c)} petition${c === 1 ? '' : 's'}`
		const bx = ((xOf(day) + bw / 2) / W) * r.width
		const by = (y(c) / H) * r.height
		tip.style.left = `${bx}px`
		tip.style.top = `${by}px`
		tip.classList.add('on')
	})
	hit.addEventListener('pointerleave', () => tip.classList.remove('on'))
	}
	build()
	render(14)
	let resizeTimer
	new ResizeObserver(() => {
		clearTimeout(resizeTimer)
		resizeTimer = setTimeout(() => {
			const w = Math.round(Math.max(320, Math.min(760, chartBox.clientWidth || 760)))
			if (w !== W) { build(); render(current) }
		}, 120)
	}).observe(chartBox)

	// ── § 3 timeline fill ────────────────────────────────────────────────────
	const track = $('#track')
	new IntersectionObserver(([e], o) => { if (e.isIntersecting) { track.style.setProperty('--fill', '100%'); o.disconnect() } }, { threshold: 0.4 }).observe(track)

	// ── § 5 Sepolia docket ───────────────────────────────────────────────────
	const TX = 'https://sepolia.etherscan.io/tx/'
	const S = { open: ['Drawdowns open', 'open'], pending: ['Drawstop · carve-out open', 'stop'], review: ['Drawstop · review required', 'review'] }
	const steps = [
		{ act: 'Act I · a petition, then its dismissal' },
		{ t: 'A clean record', d: 'The cron trigger checks the three sources. Nothing found; the facility opens.', s: 'open', b: 100000, l: 0, x: 0, tx: '0x0340ef5295cc614bd42bfcd40769ba9c08b46da35bd728002843fde2890a52fd' },
		{ t: 'Drawdown of 10,000 released', d: 'The request emits an event; the EVM log trigger runs a fresh check before money moves.', s: 'open', b: 110000, l: 0, x: 0, tx: '0x2e662911011d6f321e8d119e555ca96c9cafb3a5497c0c2ac730eb5f456dbaca' },
		{ t: 'A petition is advertised', d: 'Presented 12 days earlier. The carve-out window opens; drawdowns stop.', s: 'pending', b: 110000, l: 0, x: 0, tx: '0xabba91904c9e9e4e364e9e9484c81b034fcdeca76740d4dc1f4da19c855011d1' },
		{ t: 'Second drawdown refused', d: 'A fresh check confirms the petition. executeDrawdown reverts with DrawdownsBlocked.', s: 'pending', b: 110000, l: 0, x: 0, tx: '0xcdc4cae53fde6cf25feb7a001465572ea0bf75918e19a03d8ae174e6a44c601a', stamp: ['Refused', 'stop'] },
		{ t: 'Repayment of 5,000 held', d: 'Paid while the petition is live, so it waits in suspense instead of reaching the lender.', s: 'pending', b: 105000, l: 0, x: 5000, tx: '0x11d9768f3f02f9a97e1d2956e3a319e041a02365bbb96c0a60634128c46a127d', stamp: ['Held', 'held'] },
		{ t: 'Dismissed; suspense released', d: 'A dismissal for the same court case. The facility reopens and the 5,000 goes to the lender.', s: 'open', b: 105000, l: 5000, x: 0, tx: '0x2534f98492169e5063779f546763f8eebeb1fa4aaa5af809b3a6222e4011c483' },
		{ act: 'Act II · a petition nobody saw, then the order' },
		{ t: 'Repayment of 3,000 passes through', d: 'A new petition has been presented but not advertised. The public record looks clean.', s: 'open', b: 102000, l: 8000, x: 0, tx: '0x474eee8cb42a4ffa6906679ec445e5733de0e1a8f73c0594c533744ea1b1328a' },
		{ t: 'Winding-up order advertised', d: 'Its petition was presented 12 days earlier and never seen. The 3,000 is surfaced, not stopped.', s: 'review', b: 102000, l: 8000, x: 0, tx: '0x22f114ba458bf1efb5568caa55b6013e48824564c705db8819c799ff781025d2', stamp: ['Surfaced', 'stop'] },
		{ t: 'Repayment of 2,000 held', d: 'After the order, repayments wait in suspense for the office-holder.', s: 'review', b: 100000, l: 8000, x: 2000, tx: '0x8e884ef9d70d724bf8d3924403a27310afb2aa04002be53121030ebc08ff17a6', stamp: ['Held', 'held'] },
		{ t: 'Official Receiver nominated', d: 'The arbiter names the office-holder, effective two days later. An immediate release reverts.', s: 'review', b: 100000, l: 8000, x: 2000, tx: '0x541378601a872a36e1d3774d0acaca45583168b6ce31343ab7f79ba0deb117fe' },
		{ t: '2,000 returned to the estate', d: 'After the delay, the arbiter returns the suspense to the Official Receiver stand-in (22 October).', s: 'review', b: 100000, l: 8000, x: 0, tx: '0x92e216a23b9b57b38204073b746ee5b6a924032651fbaa921f59df0b6b50e327', stamp: ['Returned', 'held'] },
	]
	const real = steps.filter((s) => !s.act)
	const list = $('#steps')
	const buttons = []
	let n = 0
	steps.forEach((s) => {
		const li = document.createElement('li')
		if (s.act) {
			li.className = 'act caps'
			li.textContent = s.act
		} else {
			const i = real.indexOf(s)
			const b = document.createElement('button')
			b.type = 'button'
			b.innerHTML = `<span class="n">${String(i + 1).padStart(2, '0')}</span><span>${s.t}</span><span class="stamp ${S[s.s][1]}" aria-hidden="true">${s.s === 'open' ? 'Open' : s.s === 'pending' ? 'Stop' : 'Review'}</span>`
			b.addEventListener('click', () => show(i))
			buttons.push(b)
			li.appendChild(b)
		}
		list.appendChild(li)
	})
	const fields = { status: $('#l-status'), b: $('#l-borrower'), l: $('#l-lender'), x: $('#l-suspense') }
	const impress = $('#impress')
	let prevStep = null
	const show = (i) => {
		n = Math.max(0, Math.min(real.length - 1, i))
		const s = real[n]
		buttons.forEach((b, j) => (j === n ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')))
		$('#ledger-step').textContent = `Step ${n + 1} of ${real.length}`
		$('#ledger-title').textContent = s.t
		$('#ledger-detail').textContent = s.d
		const set = (node, value, changed) => { node.innerHTML = value; node.classList.toggle('changed', changed) }
		set(fields.status, `<span class="stamp ${S[s.s][1]}">${S[s.s][0]}</span>`, false)
		set(fields.b, fmt(s.b), prevStep && prevStep.b !== s.b)
		set(fields.l, fmt(s.l), prevStep && prevStep.l !== s.l)
		set(fields.x, fmt(s.x), prevStep && prevStep.x !== s.x)
		const tx = $('#ledger-tx')
		tx.href = TX + s.tx
		tx.innerHTML = `Transaction <span class="mono">${s.tx.slice(0, 8)}…${s.tx.slice(-4)}</span> ↗`
		impress.className = 'stamp impress'
		if (s.stamp) {
			impress.textContent = s.stamp[0]
			impress.classList.add(s.stamp[1])
			void impress.offsetWidth
			impress.classList.add('go')
		}
		$('#prev').disabled = n === 0
		$('#next').disabled = n === real.length - 1
		prevStep = s
	}
	$('#prev').addEventListener('click', () => show(n - 1))
	$('#next').addEventListener('click', () => show(n + 1))
	list.addEventListener('keydown', (e) => {
		if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
		e.preventDefault()
		show(n + (e.key === 'ArrowDown' ? 1 : -1))
		buttons[n].focus()
	})
	show(0)

	// ── Copy buttons ─────────────────────────────────────────────────────────
	$$('.copy').forEach((btn) =>
		btn.addEventListener('click', async () => {
			const pre = document.getElementById(btn.dataset.copy)
			const text = [...pre.childNodes].filter((c) => c !== btn).map((c) => c.textContent).join('')
				.split('\n').map((l) => l.replace(/^\$ /, '').replace(/\s+#.*$/, '')).join('\n').trim()
			try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied' } catch (e) { btn.textContent = 'Select and copy' }
			setTimeout(() => (btn.textContent = 'Copy'), 1600)
		}),
	)
})()

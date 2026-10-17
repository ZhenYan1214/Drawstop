// Times the narration in demo/video-script.md instead of guessing: words per scene at a speaking rate, plus a short
// pause per scene for the screen to land. Rerun after editing the narration.
//
//   bun demo/script-timing.ts [wordsPerMinute=150] [pauseSecondsPerScene=1.5]

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const wpm = Number(process.argv[2] ?? 150)
const pause = Number(process.argv[3] ?? 1.5)
const md = readFileSync(join(import.meta.dir, 'video-script.md'), 'utf-8')

// Scene rows: "| <n> | screen | narration | notes |"
const rows = md
	.split('\n')
	.filter((l) => /^\|\s*\d+\s*\|/.test(l))
	.map((l) => l.split('|').map((c) => c.trim()))
	.map((c) => ({ n: Number(c[1]), narration: c[3] }))

const words = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length

let t = 0
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
console.log(`scene  words  seconds  starts`)
for (const r of rows) {
	const w = words(r.narration)
	const s = (w / wpm) * 60 + pause
	console.log(`${String(r.n).padStart(5)}  ${String(w).padStart(5)}  ${s.toFixed(1).padStart(7)}  ${fmt(t)}`)
	t += s
}
const total = rows.reduce((a, r) => a + words(r.narration), 0)
console.log(`total  ${String(total).padStart(5)}  ${t.toFixed(0).padStart(7)}  -> ${fmt(t)} at ${wpm} wpm (+${pause}s per scene)`)

// SVG -> PNG for the DoraHacks submission (the BUIDL page needs raster images).
//
//   cd docs/dorahacks && bun install && bun render.ts <in.svg> <out.png> [widthPx]

import { readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const [input, output, width = '1600'] = process.argv.slice(2)
if (!input || !output) throw new Error('usage: render.ts <in.svg> <out.png> [widthPx]')
const png = new Resvg(readFileSync(input, 'utf-8'), {
	fitTo: { mode: 'width', value: Number(width) },
	font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' },
	background: 'rgba(0,0,0,0)',
}).render()
writeFileSync(output, png.asPng())
console.log(`${output}: ${png.width}x${png.height}`)

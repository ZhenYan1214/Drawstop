import { describe, expect, test } from 'bun:test'
import { selectBatch } from './workflow'

describe('selectBatch', () => {
	test('returns everything when it fits', () => {
		expect(selectBatch(['a', 'b'], 2, 7)).toEqual(['a', 'b'])
	})

	test('rotates so every entity is checked across runs', () => {
		const all = ['a', 'b', 'c', 'd', 'e']
		const seen = new Set<string>()
		for (let round = 0; round < 3; round++) for (const e of selectBatch(all, 2, round)) seen.add(e)
		expect([...seen].sort()).toEqual(all)
		expect(selectBatch(all, 2, 0)).toEqual(['a', 'b'])
		expect(selectBatch(all, 2, 2)).toEqual(['e', 'a'])
	})
})

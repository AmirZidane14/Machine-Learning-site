import { describe, expect, it } from 'vitest'
import { clamp, linearScale, ticks } from './scale'

describe('linearScale', () => {
  it('maps data to pixels', () => {
    const x = linearScale([0, 10], [0, 500])
    expect(x(0)).toBe(0)
    expect(x(5)).toBe(250)
    expect(x(10)).toBe(500)
  })

  it('supports a flipped range (SVG y axis points down)', () => {
    const y = linearScale([0, 10], [400, 0])
    expect(y(0)).toBe(400)
    expect(y(10)).toBe(0)
  })

  it('invert is the exact reverse of the scale', () => {
    const y = linearScale([-5, 5], [300, 0])
    for (const v of [-5, -1.5, 0, 2.25, 5]) expect(y.invert(y(v))).toBeCloseTo(v, 10)
  })

  it('does not divide by zero for a zero-width domain', () => {
    const s = linearScale([3, 3], [0, 100])
    expect(s(3)).toBe(0)
    expect(Number.isFinite(s(7))).toBe(true)
  })
})

describe('ticks', () => {
  it('gives round numbers', () => {
    expect(ticks(0, 10, 5)).toEqual([0, 2, 4, 6, 8, 10])
  })

  it('handles fractional ranges without floating-point noise', () => {
    expect(ticks(0, 1, 5)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1])
  })

  it('includes negative values', () => {
    expect(ticks(-10, 10, 4)).toEqual([-10, -5, 0, 5, 10])
  })

  it('returns a single tick for an empty range', () => {
    expect(ticks(4, 4)).toEqual([4])
  })
})

describe('clamp', () => {
  it('limits values to the range', () => {
    expect(clamp(15, 0, 10)).toBe(10)
    expect(clamp(-3, 0, 10)).toBe(0)
    expect(clamp(4, 0, 10)).toBe(4)
  })
})

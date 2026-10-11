import { describe, expect, it } from 'vitest'
import { mean } from './stats'

describe('mean', () => {
  it('matches the worked example from the blueprint (2 3 3 4 8 -> 4)', () => {
    expect(mean([2, 3, 3, 4, 8])).toBe(4)
  })

  it('handles negative numbers', () => {
    expect(mean([-2, 2])).toBe(0)
  })

  it('returns NaN for an empty dataset instead of crashing', () => {
    expect(mean([])).toBeNaN()
  })
})

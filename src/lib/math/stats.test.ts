import { describe, expect, it } from 'vitest'
import { mean, mse } from './stats'

describe('mse', () => {
  it('is 0 for a perfect prediction', () => {
    expect(mse([1, 2, 3], [1, 2, 3])).toBe(0)
  })

  it('squares the errors, so big misses count more (errors 1 and 3 -> (1 + 9) / 2 = 5)', () => {
    expect(mse([0, 0], [1, 3])).toBe(5)
  })

  it('returns NaN for empty or mismatched input', () => {
    expect(mse([], [])).toBeNaN()
    expect(mse([1, 2], [1])).toBeNaN()
  })
})

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

import { describe, expect, it } from 'vitest'
import { dodgeOffset } from './dodge'

const center = { x: 100, y: 100 }

describe('dodgeOffset', () => {
  it('does nothing when the pointer is outside the radius', () => {
    expect(dodgeOffset({ x: 300, y: 100 }, center, 120, 60)).toEqual({ x: 0, y: 0, strength: 0 })
  })

  it('does nothing exactly at the radius edge (no sudden jump)', () => {
    expect(dodgeOffset({ x: 220, y: 100 }, center, 120, 60).strength).toBe(0)
  })

  it('pushes directly away from the pointer (pointer on the left -> push right)', () => {
    const d = dodgeOffset({ x: 40, y: 100 }, center, 120, 60) // 60px away = half the radius
    expect(d.strength).toBeCloseTo(0.5)
    expect(d.x).toBeCloseTo(30) // 0.5 * 60
    expect(d.y).toBeCloseTo(0)
  })

  it('pushes harder the closer the pointer is', () => {
    const near = Math.abs(dodgeOffset({ x: 90, y: 100 }, center, 120, 60).x)
    const far = Math.abs(dodgeOffset({ x: 30, y: 100 }, center, 120, 60).x)
    expect(near).toBeGreaterThan(far)
  })

  it('never pushes further than maxPush', () => {
    const d = dodgeOffset({ x: 99, y: 100 }, center, 120, 60)
    expect(Math.hypot(d.x, d.y)).toBeLessThanOrEqual(60)
  })

  it('handles the pointer exactly on the center without dividing by zero', () => {
    const d = dodgeOffset(center, center, 120, 60)
    expect(Number.isFinite(d.x) && Number.isFinite(d.y)).toBe(true)
    expect(d).toEqual({ x: 0, y: -60, strength: 1 })
  })
})

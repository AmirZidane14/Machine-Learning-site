/*
  Scales: the bridge between DATA coordinates and SCREEN (pixel) coordinates.
  Pure functions, no React, so they are easy to test.

    const x = linearScale([0, 10], [0, 500])
    x(5)        // 250   data -> pixels
    x.invert(250) // 5   pixels -> data (used when dragging with the mouse)
*/

export type Range = [number, number]

export interface Scale {
  (value: number): number
  invert(pixel: number): number
}

export function linearScale(domain: Range, range: Range): Scale {
  const [d0, d1] = domain
  const [r0, r1] = range
  const span = d1 - d0

  // A zero-width domain would divide by zero; collapse to the start of the range instead.
  const scale = (value: number) => (span === 0 ? r0 : r0 + ((value - d0) / span) * (r1 - r0))
  const invert = (pixel: number) => (r1 === r0 ? d0 : d0 + ((pixel - r0) / (r1 - r0)) * span)

  return Object.assign(scale, { invert })
}

/**
 * "Nice" tick values between min and max (1, 2, 5, 10 x a power of ten),
 * roughly `target` of them. Used for axis labels and gridlines.
 */
export function ticks(min: number, max: number, target = 5): number[] {
  const span = max - min
  if (!(span > 0)) return [min]

  const rough = span / target
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const fraction = rough / magnitude
  const niceFraction = fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10
  const step = niceFraction * magnitude

  const result: number[] = []
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) {
    result.push(Number(v.toFixed(10))) // trim floating-point noise like 0.30000000000000004
  }
  return result
}

/** Keep a value inside [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

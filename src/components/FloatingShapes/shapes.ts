/*
  The cast of shapes. Pure data: to add, remove, move or recolor a shape, edit this list.
  Nothing here knows how shapes are drawn or animated.
*/

export type ShapeKind = 'circle' | 'square' | 'triangle' | 'ring' | 'plus'

export interface ShapeSpec {
  kind: ShapeKind
  /** Center of the shape as a percentage of the field (0-100). */
  x: number
  y: number
  size: number // pixels
  tone: 1 | 2 | 3 | 4 // which --color-shape-N token to use
  /** How far the slow idle float travels, in pixels, and how long one trip takes. */
  driftX: number
  driftY: number
  driftRotate: number // degrees
  driftSeconds: number
  delaySeconds: number // negative = start part-way through, so shapes aren't in sync
}

export const shapes: ShapeSpec[] = [
  { kind: 'circle', x: 22, y: 26, size: 84, tone: 2, driftX: 14, driftY: -18, driftRotate: 0, driftSeconds: 7, delaySeconds: 0 },
  { kind: 'ring', x: 70, y: 20, size: 96, tone: 1, driftX: -16, driftY: 12, driftRotate: 30, driftSeconds: 9, delaySeconds: -3 },
  { kind: 'triangle', x: 48, y: 52, size: 78, tone: 3, driftX: 12, driftY: 16, driftRotate: 25, driftSeconds: 8, delaySeconds: -5 },
  { kind: 'square', x: 82, y: 58, size: 66, tone: 2, driftX: -12, driftY: -14, driftRotate: -20, driftSeconds: 10, delaySeconds: -2 },
  { kind: 'plus', x: 18, y: 72, size: 62, tone: 4, driftX: 16, driftY: -10, driftRotate: 45, driftSeconds: 6.5, delaySeconds: -4 },
  { kind: 'circle', x: 62, y: 86, size: 44, tone: 1, driftX: -10, driftY: -16, driftRotate: 0, driftSeconds: 7.5, delaySeconds: -1 },
  { kind: 'square', x: 38, y: 12, size: 40, tone: 4, driftX: 10, driftY: 14, driftRotate: 35, driftSeconds: 8.5, delaySeconds: -6 },
  { kind: 'ring', x: 90, y: 88, size: 52, tone: 3, driftX: -14, driftY: -10, driftRotate: -25, driftSeconds: 9.5, delaySeconds: -7 },
]

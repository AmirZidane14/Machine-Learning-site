/*
  "Dodge" math for the floating shapes: given where the pointer is and where a shape is,
  how far (and in which direction) should the shape be pushed away?
  Pure function, no DOM, so it is easy to test and tune.
*/

export interface Vec {
  x: number
  y: number
}

export interface Dodge {
  x: number // pixels to push horizontally
  y: number // pixels to push vertically
  strength: number // 0 = pointer is far away ... 1 = pointer is right on top of the shape
}

/**
 * Pointer outside `radius` -> no push. Inside, the push grows linearly as the pointer gets
 * closer (up to `maxPush` pixels) and points directly away from the pointer.
 */
export function dodgeOffset(pointer: Vec, center: Vec, radius: number, maxPush: number): Dodge {
  const dx = center.x - pointer.x
  const dy = center.y - pointer.y
  const distance = Math.hypot(dx, dy)

  if (distance >= radius) return { x: 0, y: 0, strength: 0 }

  const strength = 1 - distance / radius
  // Pointer exactly on the center has no "away" direction (it would divide by zero): pop upward.
  if (distance === 0) return { x: 0, y: -maxPush, strength }

  const push = strength * maxPush
  return { x: (dx / distance) * push, y: (dy / distance) * push, strength }
}

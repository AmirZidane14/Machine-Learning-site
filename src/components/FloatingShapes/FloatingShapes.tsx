import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { dodgeOffset } from '../../lib/motion/dodge'
import { shapes } from './shapes'

const DODGE_RADIUS = 130 // pointer within this many pixels of a shape makes it react
const MAX_PUSH = 70 // furthest a shape gets shoved, in pixels
const TAP_RESET_MS = 700 // on touch screens, how long a shape stays shoved after a tap

/*
  A decorative field of drifting shapes that dodge and wobble when the pointer comes near.

  Each shape is four nested layers, because two animations can't share one `transform`:
    .shape          fixed position in the field
     .shape__dodge   JS sets --dx/--dy here; a springy CSS transition does the moving
      .shape__drift   slow endless CSS float
       .shape__body    the visible shape (wobbles when `shape--near` is set)

  Why JS writes CSS variables instead of React state: pointer-move fires dozens of times a second.
  Re-rendering React each time would be wasteful; setting a CSS variable directly is cheap,
  and the browser animates the change itself.
*/
export default function FloatingShapes() {
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([])
  const resetTimer = useRef<number | undefined>(undefined)

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const setDodge = (element: HTMLDivElement, x: number, y: number, near: boolean) => {
    element.style.setProperty('--dx', `${x}px`)
    element.style.setProperty('--dy', `${y}px`)
    element.classList.toggle('shape--near', near)
  }

  const reactToPointer = (clientX: number, clientY: number) => {
    if (reduceMotion()) return
    for (const element of shapeRefs.current) {
      if (!element) continue
      // Measure the OUTER layer: it never moves, so the shape can't "chase" its own motion.
      const box = element.getBoundingClientRect()
      const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
      const dodge = dodgeOffset({ x: clientX, y: clientY }, center, DODGE_RADIUS, MAX_PUSH)
      setDodge(element, dodge.x, dodge.y, dodge.strength > 0)
    }
  }

  const reset = () => {
    window.clearTimeout(resetTimer.current)
    for (const element of shapeRefs.current) if (element) setDodge(element, 0, 0, false)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => reactToPointer(e.clientX, e.clientY)

  // A mouse "leaves" when it exits the field. A finger "leaves" the instant it lifts, which
  // would undo a tap immediately, so touch is left to the settle timer in onPointerDown.
  const onPointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') reset()
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    reactToPointer(e.clientX, e.clientY)
    // A finger has no "hover", so after a tap let the shapes settle back by themselves.
    if (e.pointerType !== 'mouse') {
      window.clearTimeout(resetTimer.current)
      resetTimer.current = window.setTimeout(reset, TAP_RESET_MS)
    }
  }

  return (
    // Purely decorative, so hidden from screen readers.
    <div
      className="shape-field"
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
    >
      {shapes.map((s, index) => (
        <div
          key={index}
          ref={(element) => {
            shapeRefs.current[index] = element
          }}
          className={`shape shape--${s.kind} shape--tone-${s.tone}`}
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              '--size': `${s.size}px`,
              '--drift-x': `${s.driftX}px`,
              '--drift-y': `${s.driftY}px`,
              '--drift-rotate': `${s.driftRotate}deg`,
              '--drift-seconds': `${s.driftSeconds}s`,
              '--drift-delay': `${s.delaySeconds}s`,
            } as CSSProperties
          }
        >
          <div className="shape__dodge">
            <div className="shape__drift">
              <div className="shape__body" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

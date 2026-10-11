import type { KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { clamp, type Range } from '../../lib/graph/scale'
import InteractiveGraph, { type GraphContext } from './InteractiveGraph'

export interface Point {
  x: number
  y: number
}

interface ScatterPlotProps {
  points: Point[]
  /** If given, points become draggable and this is called with the updated list. */
  onPointsChange?: (points: Point[]) => void
  xDomain: Range
  yDomain: Range
  xLabel?: string
  yLabel?: string
  ariaLabel: string
  /** Optional extra drawing UNDER the points (e.g. a regression line). Gets the same context. */
  overlay?: (context: GraphContext) => ReactNode
}

/*
  A scatter plot whose points can be dragged with mouse, finger or arrow keys.

  Dragging, step by step:
    1. pointerdown on a dot  -> "capture" the pointer so we keep receiving its moves
    2. pointermove           -> convert the pointer position back to data (toData)
    3. we build a NEW points array and call onPointsChange
    4. the parent stores it in state -> everything (line, metrics) redraws
  The plot itself stores nothing: the parent owns the data ("controlled component").
*/
export default function ScatterPlot({
  points,
  onPointsChange,
  xDomain,
  yDomain,
  xLabel,
  yLabel,
  ariaLabel,
  overlay,
}: ScatterPlotProps) {
  const draggable = Boolean(onPointsChange)

  const movePoint = (index: number, x: number, y: number) => {
    if (!onPointsChange) return
    const next = points.map((p, i) =>
      i === index ? { x: clamp(x, xDomain[0], xDomain[1]), y: clamp(y, yDomain[0], yDomain[1]) } : p,
    )
    onPointsChange(next)
  }

  return (
    <InteractiveGraph xDomain={xDomain} yDomain={yDomain} xLabel={xLabel} yLabel={yLabel} ariaLabel={ariaLabel}>
      {(context) => {
        const { xScale, yScale, toData } = context

        const onPointerDown = (e: PointerEvent<SVGGElement>) => {
          e.currentTarget.setPointerCapture(e.pointerId)
        }
        const onPointerMove = (e: PointerEvent<SVGGElement>, index: number) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return // not dragging
          const { x, y } = toData(e.currentTarget, e.clientX, e.clientY)
          movePoint(index, x, y)
        }
        const onKeyDown = (e: KeyboardEvent<SVGGElement>, index: number) => {
          const stepX = (xDomain[1] - xDomain[0]) / 50
          const stepY = (yDomain[1] - yDomain[0]) / 50
          const p = points[index]
          const moves: Record<string, [number, number]> = {
            ArrowLeft: [-stepX, 0],
            ArrowRight: [stepX, 0],
            ArrowUp: [0, stepY],
            ArrowDown: [0, -stepY],
          }
          const move = moves[e.key]
          if (!move) return
          e.preventDefault() // stop the page from scrolling
          movePoint(index, p.x + move[0], p.y + move[1])
        }

        return (
          <>
            {overlay?.(context)}
            {points.map((p, index) => (
              <g
                key={index}
                className={draggable ? 'scatter__point scatter__point--draggable' : 'scatter__point'}
                transform={`translate(${xScale(p.x)},${yScale(p.y)})`}
                tabIndex={draggable ? 0 : undefined}
                role={draggable ? 'slider' : undefined}
                aria-label={`Point ${index + 1}`}
                aria-valuetext={`x ${p.x.toFixed(1)}, y ${p.y.toFixed(1)}`}
                onPointerDown={draggable ? onPointerDown : undefined}
                onPointerMove={draggable ? (e) => onPointerMove(e, index) : undefined}
                onKeyDown={draggable ? (e) => onKeyDown(e, index) : undefined}
              >
                {/* Invisible bigger circle = easier to grab with a finger */}
                <circle className="scatter__hit" r={18} />
                <circle className="scatter__dot" r={7} />
              </g>
            ))}
          </>
        )
      }}
    </InteractiveGraph>
  )
}

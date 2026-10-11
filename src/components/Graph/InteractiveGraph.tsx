import { useId, type ReactNode } from 'react'
import { clamp, linearScale, ticks, type Range, type Scale } from '../../lib/graph/scale'
import { useElementWidth } from '../../lib/hooks/useElementWidth'

/** Everything a child needs to draw on the graph or react to the mouse. */
export interface GraphContext {
  xScale: Scale // data x -> pixel x
  yScale: Scale // data y -> pixel y
  /**
   * Convert a mouse/touch position on the screen back into data coordinates.
   * Pass any element drawn inside the graph (e.g. the dragged dot); it finds its parent <svg>.
   */
  toData: (element: SVGGraphicsElement, clientX: number, clientY: number) => { x: number; y: number }
  innerWidth: number
  innerHeight: number
}

interface InteractiveGraphProps {
  xDomain: Range // e.g. [0, 10] = the x axis shows values from 0 to 10
  yDomain: Range
  xLabel?: string
  yLabel?: string
  ariaLabel: string // describes the graph for screen readers
  /**
   * Render prop: a function we call with the GraphContext. This lets each caller decide
   * what to draw (points, lines, curves...) while sharing the same axes and scales.
   */
  children: (context: GraphContext) => ReactNode
}

const MARGIN = { top: 16, right: 20, bottom: 48, left: 56 }
const MIN_WIDTH = 260
const MAX_WIDTH = 760
const ASPECT = 0.62 // height = width x 0.62

/*
  Draws axes, gridlines and tick labels, then calls `children` to draw the data on top.
  Contents are clipped to the plot area so a line that leaves the graph doesn't spill out.
*/
export default function InteractiveGraph({ xDomain, yDomain, xLabel, yLabel, ariaLabel, children }: InteractiveGraphProps) {
  const clipId = `clip-${useId().replace(/:/g, '')}` // unique per graph; colons break url(#...)

  // Draw at the container's real pixel size, so text stays a readable size on phones
  // (scaling a fixed-size drawing down would shrink the labels too).
  const { ref, width: measured } = useElementWidth<HTMLDivElement>(640)
  const width = clamp(measured, MIN_WIDTH, MAX_WIDTH)
  const height = Math.round(width * ASPECT)

  const innerWidth = width - MARGIN.left - MARGIN.right
  const innerHeight = height - MARGIN.top - MARGIN.bottom
  const xScale = linearScale(xDomain, [0, innerWidth])
  const yScale = linearScale(yDomain, [innerHeight, 0]) // flipped: SVG y grows downward

  const toData = (element: SVGGraphicsElement, clientX: number, clientY: number) => {
    const svg = element.ownerSVGElement ?? (element as SVGSVGElement)
    const matrix = svg.getScreenCTM()
    if (!matrix) return { x: xDomain[0], y: yDomain[0] }
    // Screen pixels -> SVG units (undoes CSS scaling) -> inside the margins -> data values.
    const p = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse())
    return { x: xScale.invert(p.x - MARGIN.left), y: yScale.invert(p.y - MARGIN.top) }
  }

  const xTicks = ticks(xDomain[0], xDomain[1])
  const yTicks = ticks(yDomain[0], yDomain[1])

  return (
    <div ref={ref} className="graph-wrap">
    <svg className="graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
      <defs>
        <clipPath id={clipId}>
          <rect width={innerWidth} height={innerHeight} />
        </clipPath>
      </defs>

      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        <rect className="graph__bg" width={innerWidth} height={innerHeight} />

        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line className="graph__grid" x1={xScale(t)} x2={xScale(t)} y1={0} y2={innerHeight} />
            <text className="graph__tick" x={xScale(t)} y={innerHeight + 20} textAnchor="middle">
              {t}
            </text>
          </g>
        ))}
        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line className="graph__grid" x1={0} x2={innerWidth} y1={yScale(t)} y2={yScale(t)} />
            <text className="graph__tick" x={-10} y={yScale(t)} textAnchor="end" dominantBaseline="middle">
              {t}
            </text>
          </g>
        ))}

        <line className="graph__axis" x1={0} x2={innerWidth} y1={innerHeight} y2={innerHeight} />
        <line className="graph__axis" x1={0} x2={0} y1={0} y2={innerHeight} />

        {xLabel && (
          <text className="graph__label" x={innerWidth / 2} y={innerHeight + 42} textAnchor="middle">
            {xLabel}
          </text>
        )}
        {yLabel && (
          <text
            className="graph__label"
            transform={`translate(-42,${innerHeight / 2}) rotate(-90)`}
            textAnchor="middle"
          >
            {yLabel}
          </text>
        )}

        <g clipPath={`url(#${clipId})`}>{children({ xScale, yScale, toData, innerWidth, innerHeight })}</g>
      </g>
    </svg>
    </div>
  )
}

import { useState } from 'react'
import FormulaDisplay from '../components/Formula/FormulaDisplay'
import ScatterPlot, { type Point } from '../components/Graph/ScatterPlot'
import MetricCard from '../components/MetricCard/MetricCard'
import ParameterSlider from '../components/Slider/ParameterSlider'
import { mse } from '../lib/math/stats'

const INITIAL_POINTS: Point[] = [
  { x: 1, y: 2.2 },
  { x: 2, y: 2.9 },
  { x: 3, y: 4.1 },
  { x: 4, y: 4.4 },
  { x: 5, y: 6.2 },
  { x: 6, y: 6.1 },
  { x: 7, y: 8.3 },
]

/*
  COMPONENT LAB: a developer page that proves the Phase 2 building blocks work together.
  It is NOT a lesson. The real Linear Regression lesson arrives in Phase 3.

  Data flow (the heart of React):
    state (points, w, b)  ->  props for graph / formula / metrics  ->  screen
    user drags or slides  ->  onChange calls a setter  ->  state changes  ->  everything redraws
*/
export default function ComponentLabPage() {
  const [points, setPoints] = useState<Point[]>(INITIAL_POINTS)
  const [w, setW] = useState(1)
  const [b, setB] = useState(1)
  const [activeVariable, setActiveVariable] = useState<string | undefined>()

  // Derived values: recomputed on every redraw from the state above, never stored separately.
  const predictions = points.map((p) => w * p.x + b)
  const error = mse(
    points.map((p) => p.y),
    predictions,
  )

  return (
    <div className="page stack">
      <h1>Component lab</h1>
      <p>
        A test bench for the reusable building blocks. Drag the dots (or focus one and use the arrow keys), move the
        sliders, and watch the line, formula and error react.
      </p>

      <div className="card">
        <FormulaDisplay
          tex={String.raw`\hat{y} = \htmlData{var=w}{w}\,x + \htmlData{var=b}{b}`}
          activeVariable={activeVariable}
          ariaLabel="y hat equals w times x plus b"
        />

        <ScatterPlot
          points={points}
          onPointsChange={setPoints}
          xDomain={[0, 8]}
          yDomain={[0, 10]}
          xLabel="x (input)"
          yLabel="y (output)"
          ariaLabel="Scatter plot of 7 draggable points with a straight line y equals w x plus b"
          overlay={({ xScale, yScale }) => (
            <line
              className={activeVariable ? 'graph__line graph__line--highlight' : 'graph__line'}
              x1={xScale(0)}
              y1={yScale(b)}
              x2={xScale(8)}
              y2={yScale(w * 8 + b)}
            />
          )}
        />

        <div className="control-row">
          <ParameterSlider
            label="Slope (w)"
            value={w}
            min={-2}
            max={3}
            step={0.05}
            onChange={setW}
            onHighlightChange={(on) => setActiveVariable(on ? 'w' : undefined)}
          />
          <ParameterSlider
            label="Intercept (b)"
            value={b}
            min={-3}
            max={8}
            step={0.05}
            onChange={setB}
            onHighlightChange={(on) => setActiveVariable(on ? 'b' : undefined)}
          />
          <MetricCard label="MSE" value={error} hint="Average squared error: lower is better" />
        </div>
      </div>
    </div>
  )
}

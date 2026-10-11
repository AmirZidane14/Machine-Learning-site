import { useId } from 'react'
import { formatNumber } from '../../lib/format'

interface ParameterSliderProps {
  label: string // human name, e.g. "Slope (w)"
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  /** Called with true when the user hovers/focuses this slider, false when they leave. */
  onHighlightChange?: (active: boolean) => void
  digits?: number // decimals shown next to the label
}

/*
  A labelled slider. It is a "controlled component": it stores NOTHING itself.
  The parent passes the current `value` and gets `onChange` calls, so the parent's state
  is the single source of truth shared by the slider, the graph and the formula.
*/
export default function ParameterSlider({
  label,
  value,
  min,
  max,
  step = 0.1,
  onChange,
  onHighlightChange,
  digits = 2,
}: ParameterSliderProps) {
  const id = useId()
  const highlight = (active: boolean) => () => onHighlightChange?.(active)

  return (
    <div
      className="slider"
      onPointerEnter={highlight(true)}
      onPointerLeave={highlight(false)}
      onFocus={highlight(true)}
      onBlur={highlight(false)}
    >
      <div className="slider__header">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="slider__value">
          {formatNumber(value, digits)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

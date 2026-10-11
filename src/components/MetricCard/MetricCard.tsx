import { formatNumber } from '../../lib/format'

interface MetricCardProps {
  label: string // e.g. "MSE"
  value: number
  hint?: string // short explanation under the number
  digits?: number
}

/* A small card that shows one live number, such as MSE, recall or loss. */
export default function MetricCard({ label, value, hint, digits = 2 }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-card__label">{label}</div>
      <div className="metric-card__value">{formatNumber(value, digits)}</div>
      {hint && <div className="metric-card__hint">{hint}</div>}
    </div>
  )
}

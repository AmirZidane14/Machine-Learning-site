/** Show a number for humans: fixed decimals, and an em dash instead of "NaN"/"Infinity". */
export function formatNumber(value: number, digits = 2): string {
  return Number.isFinite(value) ? value.toFixed(digits) : '—'
}

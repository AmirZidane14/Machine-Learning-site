/*
  Pure math functions: numbers in, numbers out. They know nothing about React
  or the screen, which makes them easy to test and reuse in every topic.
*/

/**
 * Arithmetic mean: the sum of the values divided by how many there are.
 *   mean = (x1 + x2 + ... + xn) / n
 * An empty list has no mean, so it returns NaN ("not a number") instead of crashing.
 */
export function mean(values: number[]): number {
  if (values.length === 0) return NaN
  const sum = values.reduce((total, x) => total + x, 0)
  return sum / values.length
}

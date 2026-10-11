/*
  Pure math functions: numbers in, numbers out. They know nothing about React
  or the screen, which makes them easy to test and reuse in every topic.
*/

/**
 * Mean squared error: the average of the squared differences between actual and predicted values.
 *   MSE = (1/n) * sum((y - yhat)^2)
 * Returns NaN for empty input or if the two lists differ in length.
 */
export function mse(actual: number[], predicted: number[]): number {
  if (actual.length === 0 || actual.length !== predicted.length) return NaN
  const total = actual.reduce((sum, y, i) => sum + (y - predicted[i]) ** 2, 0)
  return total / actual.length
}

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

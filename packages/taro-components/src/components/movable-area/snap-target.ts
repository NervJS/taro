/** 未启用吸附或该轴没有实际位移时，不返回吸附目标。 */
export function snapTarget (start: number, end: number, min: number, max: number, threshold?: number | null): number | null {
  if (threshold == null || !Number.isFinite(threshold) || threshold < 0 || min >= max) return null

  const from = Math.max(min, Math.min(max, start))
  const position = Math.max(min, Math.min(max, end))
  if (Math.abs(position - from) < 0.05) return null // MovableView 将位置保留到 0.1px。

  const fromMax = max - from <= from - min
  if (fromMax) return max - position > threshold ? min : max
  return position - min >= threshold ? max : min
}

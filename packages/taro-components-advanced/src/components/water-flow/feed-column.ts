/** 单列基准宽度(含系数),与原生 getFeedColumnSync 对齐,勿改 */
const FEED_COLUMN_BASE_WIDTH = 176 * 1.2

/** 根据窗口宽度计算推荐列数,下限为 2 */
export function getFeedColumn(width: number): number {
  const computed = Math.floor(width / FEED_COLUMN_BASE_WIDTH)
  return computed >= 2 ? computed : 2
}

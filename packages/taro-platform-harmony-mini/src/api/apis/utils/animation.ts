/**
 * ease-in-out的函数
 * @param t 0-1的数字
 */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1)

export const getTimingFunc = (easeFunc, frameCnt) => {
  return (x) => {
    if (frameCnt <= 1) {
      return easeFunc(1)
    }
    const t = x / (frameCnt - 1)
    return easeFunc(t)
  }
}

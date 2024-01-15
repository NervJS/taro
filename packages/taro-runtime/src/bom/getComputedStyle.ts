import env from '../env'

import type { TaroElement } from '../dom/element'
import type { Style } from '../dom/style'

export type TGetComputedStyle = typeof window.getComputedStyle | ((el: TaroElement) => Style)
export const getComputedStyle: TGetComputedStyle = process.env.TARO_PLATFORM === 'web' ? env.window.getComputedStyle : function (element: TaroElement): Style {
  return element.style
}

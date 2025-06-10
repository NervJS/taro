import env from '../env'

import type { TaroElement } from '../dom/element'
import type { Style } from '../dom/style'

export type TGetComputedStyle = typeof window.getComputedStyle | ((el: TaroElement) => Style)

// Note: 小程序端 vite 打包成 commonjs，const getComputedStyle = xxx 会报错，所以把 GetComputedStyle 改为 taroGetComputedStyleProvider
export const taroGetComputedStyleProvider: TGetComputedStyle = process.env.TARO_PLATFORM === 'web' ? env.window.getComputedStyle : function (element: TaroElement): Style {
  return element.style
}

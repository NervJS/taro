import * as ComponentsReact from '@tarojs/components-react'
import { createContext } from 'react'

import type { MutableRefObject } from 'react'

/** 与 ScrollElementContextValue 同构，components-react 未导出时兜底 */
export interface ScrollElementContextValueShape {
  scrollRef: MutableRefObject<HTMLElement | null>
  containerHeight: number
  startOffset: number
  reportNestedHeightChange?: (scrollHeight: number) => void
}

/**
 * 当 @tarojs/components-react 未导出 ScrollElementContext 时（版本过旧）兜底，
 * 避免 useContext(undefined) 报错。等效于无 Context，useContext 返回 null。
 */
export const FALLBACK_SCROLL_ELEMENT_CTX =
  createContext<ScrollElementContextValueShape | null>(null)

/** 安全获取 ScrollElementContext：存在则用原版，否则用兜底 */
export const ScrollElementContextOrFallback =
  (ComponentsReact as { ScrollElementContext?: typeof FALLBACK_SCROLL_ELEMENT_CTX }).ScrollElementContext ??
  FALLBACK_SCROLL_ELEMENT_CTX

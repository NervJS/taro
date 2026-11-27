import { EMPTY_OBJ } from '@tarojs/shared'

import type React from 'react'

interface ReactMeta {
  PageContext: React.Context<string>
  R: typeof React
}

// reactMeta 是模块级可变单例，R 与 PageContext 由 createReactApp 等入口函数在
// 冷启动时赋值。HMR 使本模块 factory 重新执行时，模块级单例会重置为 EMPTY_OBJ，
// 但 createReactApp 只在入口 bootstrap 冷启动执行一次、不会重跑，导致 R 为空、
// 后续 React.useContext is not a function。故把 reactMeta 挂到 globalThis 上
// 跨 factory 重建持久，避免 HMR 后丢失真实实例。
const GLOBAL_KEY = '__taroReactMeta'

export const reactMeta: ReactMeta = (globalThis as any)[GLOBAL_KEY] || {
  PageContext: EMPTY_OBJ,
  R: EMPTY_OBJ,
}

;(globalThis as any)[GLOBAL_KEY] = reactMeta

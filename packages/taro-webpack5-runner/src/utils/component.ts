import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'

export const componentConfig: IComponentConfig = {
  includes: new Set(['view', 'catch-view', 'static-view', 'pure-view', 'scroll-view', 'image', 'static-image', 'text', 'static-text']),
  exclude: new Set(),
  thirdPartyComponents: new Map(),
  includeAll: false
}

// 用户 cache 功能开启时，记录 parser 过程中的组件信息
export const elementNameSet = new Set()
export const componentNameSet = new Set()

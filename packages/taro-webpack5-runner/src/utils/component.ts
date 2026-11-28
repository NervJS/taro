import { createComponentConfig } from '@tarojs/runner-utils'

import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'

export const componentConfig: IComponentConfig = createComponentConfig()

// 用户 cache 功能开启时，记录 parser 过程中的组件信息
export const elementNameSet = new Set()
export const componentNameSet = new Set()

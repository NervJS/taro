import type { ComponentInstance } from '@tarojs/runtime'
import { setData } from './utils'

export function Component (options: ComponentInstance) {
  const {
    data,
    attached,
    detached,
    // pageLifetimes: {
    //   show = null,
    //   hide = null
    // } = {},
    methods
  } = options

  return {
    data,
    onReady: attached,
    onDestroy: detached,
    setData,
    ...methods
  }
}

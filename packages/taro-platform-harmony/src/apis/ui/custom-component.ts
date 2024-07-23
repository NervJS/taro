import type Taro from '@tarojs/taro/types'

// 自定义组件
export const nextTick: typeof Taro.nextTick = (cb: (...args: any[]) => any, ctx?: Record<string, any>) => {
  setTimeout(function () {
    ctx ? cb.call(ctx) : cb()
  }, 1)
}

import type { TFunc } from './interface'

// 自定义组件
export const nextTick = (cb: TFunc, ctx?: Record<string, any>) => {
  nativeOtherManager.registryNextTick(function() {
    try {
      ctx ? cb.call(ctx) : cb()
    } catch (err) {
      console.error('Error(nextTick): callback error - ' + err + '\n' + err.stack)
    }
  })
}

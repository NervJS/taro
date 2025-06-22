import { ComponentType } from 'react'

import { StandardProps } from '../common'

interface ForcePressGestureHandlerProps extends StandardProps {
  /** 声明手势协商时的组件标识
   * @supported weapp
   */
  tag?: string
  /** 手势识别成功的回调
   * @supported weapp
   */
  onGestureWorklet?: string
  /** 手势是否应该被识别
   * @supported weapp
   */
  shouldAcceptGestureWorklet?: string
  /** 声明可同时触发的手势节点
   * @supported weapp
   */
  simultaneousHandlers?: string[]
  /** 代理的原生节点类型
   * @supported weapp
   */
  nativeView?: string
}

/**iPhone 设备重按时触发手势
 * 微信小程序下 skyline 的手势标签，只能在 CompileMode 中使用
 * @supported weapp
 * @example_react
 * ```tsx
 * import { Component } from 'react'
 * import { View, ForcePressGestureHandler } from '@tarojs/components'
 *
 * export function Index () {
 *   return (
 *     <View compileMode>
 *       <ForcePressGestureHandler onGestureWorklet="onGesture">
 *          <View className='circle'></View>
 *       </ForcePressGestureHandler>
 *     </View>
 *   )
 * }
 * ```
 */
declare const ForcePressGestureHandler: ComponentType<ForcePressGestureHandlerProps>

export { ForcePressGestureHandler, ForcePressGestureHandlerProps }

import { ComponentType } from 'react'

import { StandardProps } from '../common'

interface HorizontalDragGestureHandlerProps extends StandardProps {
  /** 声明手势协商时的组件标识
   * @supported weapp
   */
  tag?: string
  /** 手势识别成功的回调
   * @supported weapp
   */
  onGestureWorklet?: string
  /** 手指移动过程中手势是否响应
   * @supported weapp
   */
  shouldResponseOnMoveWorklet?: string
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

/**横向滑动时触发手势
 * 微信小程序下 skyline 的手势标签，只能在 CompileMode 中使用
 * @supported weapp
 * @example_react
 * ```tsx
 * import { Component } from 'react'
 * import { View, HorizontalDragGestureHandler } from '@tarojs/components'
 *
 * export function Index () {
 *   return (
 *     <View compileMode>
 *       <HorizontalDragGestureHandler onGestureWorklet="onGesture">
 *          <View className='circle'></View>
 *       </HorizontalDragGestureHandler>
 *     </View>
 *   )
 * }
 * ```
 */
declare const HorizontalDragGestureHandler: ComponentType<HorizontalDragGestureHandlerProps>

export { HorizontalDragGestureHandler, HorizontalDragGestureHandlerProps }

import { ComponentType } from 'react'

import { StandardProps } from '../common'
import { CommonGestureProps } from './common'

interface VerticalDragGestureHandlerProps extends CommonGestureProps, StandardProps {
  /** 手指移动过程中手势是否响应
   * @supported weapp-skyline
   */
  shouldResponseOnMoveWorklet?: string
}

/**纵向滑动时触发手势
 * 微信小程序下 skyline 的手势标签，只能在 CompileMode 中使用
 * @supported weapp-skyline
 * @example_react
 * ```tsx
 * import { Component } from 'react'
 * import { View, VerticalDragGestureHandler } from '@tarojs/components'
 *
 * export function Index () {
 *   return (
 *     <View compileMode>
 *       <VerticalDragGestureHandler onGestureWorklet="onGesture">
 *          <View className='circle'></View>
 *       </VerticalDragGestureHandler>
 *     </View>
 *   )
 * }
 * ```
 */
declare const VerticalDragGestureHandler: ComponentType<VerticalDragGestureHandlerProps>

export { VerticalDragGestureHandler, VerticalDragGestureHandlerProps }

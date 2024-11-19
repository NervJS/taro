import { ComponentType } from 'react'

import { StandardProps } from '../common'
import { CommonGestureProps } from './common'

interface HorizontalDragGestureHandlerProps extends CommonGestureProps, StandardProps {
  /** 手指移动过程中手势是否响应
   * @supported weapp-skyline
   */
  shouldResponseOnMoveWorklet?: string
}

/**横向滑动时触发手势
 * 微信小程序下 skyline 的手势标签，只能在 CompileMode 中使用
 * @supported weapp-skyline
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

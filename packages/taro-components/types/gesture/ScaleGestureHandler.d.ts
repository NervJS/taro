import { ComponentType } from 'react'

import { StandardProps } from '../common'
import { CommonGestureProps } from './common'

interface ScaleGestureHandlerProps extends CommonGestureProps, StandardProps {
  /** 手指移动过程中手势是否响应
   * @supported weapp-skyline
   */
  shouldResponseOnMoveWorklet?: string
}

/**多指缩放时触发手势
 * 微信小程序下 skyline 的手势标签，只能在 CompileMode 中使用
 * @supported weapp-skyline
 * @example_react
 * ```tsx
 * import { Component } from 'react'
 * import { View, ScaleGestureHandler } from '@tarojs/components'
 *
 * export function Index () {
 *   return (
 *     <View compileMode>
 *       <ScaleGestureHandler onGestureWorklet="onGesture">
 *          <View className='circle'></View>
 *       </ScaleGestureHandler>
 *     </View>
 *   )
 * }
 * ```
 */
declare const ScaleGestureHandler: ComponentType<ScaleGestureHandlerProps>

export { ScaleGestureHandler, ScaleGestureHandlerProps }

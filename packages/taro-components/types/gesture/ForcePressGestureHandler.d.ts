import { ComponentType } from 'react'

import { StandardProps } from './common'
import { CommonGestureProps } from './common'

interface ForcePressGestureHandlerProps extends CommonGestureProps, StandardProps {
}

/**iPhone 设备重按时触发手势
 * 微信小程序下 skyline 的手势标签，只能在 CompileMode 中使用
 * @supported weapp-skyline
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

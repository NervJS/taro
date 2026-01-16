import { ComponentType } from 'react'
import { StandardProps } from './common'

interface CustomWrapperProps extends StandardProps {
}

/** custom-wrapper 自定义组件包裹器
 * 当数据更新层级较深时，可用此组件将需要更新的区域包裹起来，这样更新层级将大大减少
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, jd, qq, h5, harmony_hybrid
 * @example
 * ```tsx
 * import { Component } from 'react'
 * import { CustomWrapper, View, Text } from '@tarojs/components'
 *
 * export default class C extends Component {
 *   render () {
 *     return (
 *       <View>
 *         <CustomWrapper>
 *            <Text>Hello, world!</Text>
 *         </CustomWrapper>
 *       </View>
 *     )
 *   }
 * }
 * ```
 */
declare const CustomWrapper: ComponentType<CustomWrapperProps>

export { CustomWrapper, CustomWrapperProps }

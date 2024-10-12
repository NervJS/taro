import { StandardProps } from './common'

import type { ComponentType, ReactNode } from 'react'

interface SlotProps extends StandardProps {
  /** 指定插入的 slot 位置
   * @default none
   * @supported weapp, swan, alipay, tt, jd, qq
   */
  name?: string
  /** scoped slot 传入数据源
   * @default none
   * @supported swan
   */
  varName?: string
}

/** slot 插槽
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, jd, qq, harmony, h5, harmony_hybrid
 * @example
 * ```tsx
 * import { Slot, View, Text } from '@tarojs/components'
 *
 * export default class SlotView extends Component {
 *   render () {
 *     return (
 *       <View>
 *         <custom-component>
 *           <Slot name='title'>
 *            <Text>Hello, world!</Text>
 *           </Slot>
 *         </custom-component>
 *       </View>
 *     )
 *   }
 * }
 * ```
 */
declare const Slot: ComponentType<SlotProps>

export { Slot, SlotProps }

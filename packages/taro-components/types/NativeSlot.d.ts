import { StandardProps } from './common'

import type { ComponentType, ReactNode } from 'react'

interface NativeSlotProps extends StandardProps {
  /** 指定插入的 slot 位置
   * @default none
   * @supported weapp, swan, alipay, tt, jd, qq
   */
  name?: string
}

/** 编译的原生组件支持使用 slot 插槽
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, jd, qq, h5
 * @version 3.5.7+
 * @example
 * ```tsx
 * import { NativeSlot, View } from '@tarojs/components'
 *
 * export default function () {
 *   render () {
 *     return (
 *       <View>
 *         <NativeSlot />
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://github.com/NervJS/taro/pull/12627
 */
declare const NativeSlot: ComponentType<NativeSlotProps>

export { NativeSlot, NativeSlotProps }

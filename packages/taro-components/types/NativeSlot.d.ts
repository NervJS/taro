import { ComponentType } from 'react'

interface NativeSlotProps {
  /** 指定插入的 slot 位置
   * @default none
   * @supported weapp, swan, alipay, tt, jd, qq
   */
  name?: string,
}

/** native-slot 插槽
 * @supported weapp, swan, alipay, tt, jd, qq
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
 */
declare const NativeSlot: ComponentType<NativeSlotProps>

export { NativeSlot, NativeSlotProps }

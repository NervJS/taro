import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

interface SwitchProps extends StandardProps, FormItemProps {
  /** 是否选中
   * @default false
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  checked?: boolean

  /** 是否禁用
   * @default false
   * @supported weapp
   */
  disabled?: boolean

  /** 样式，有效值：switch, checkbox
   * @default "switch"
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  type?: 'switch' | 'checkbox'

  /** switch 的颜色，同 css 的 color
   * @default "#04BE02"
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  color?: string

  /** checked 改变时触发 change 事件
   * @supported weapp
   */
  onChange?: CommonEventFunction<SwitchProps.onChangeEventDetail>
}

declare namespace SwitchProps {
  interface onChangeEventDetail {
    value: boolean
  }
}

/** 开关选择器
 * @classification forms
 * @example
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 * 
 *   render() {
 *     return (
 *       <View className='components-page'>
 *         <Text>默认样式</Text>
 *         <Switch checked/>
 *         <Switch/>
 *         <Text>推荐展示样式</Text>
 *         <Switch checked/>
 *         <Switch/>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @supported weapp, h5, rn, swan, alipay, tt
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/switch.html
 */
declare const Switch: ComponentType<SwitchProps>

export { Switch, SwitchProps }

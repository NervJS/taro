import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

interface SwitchProps extends StandardProps, FormItemProps {
  /** 是否选中
   * @default false
   */
  checked?: boolean

  /** 是否禁用
   * @default false
   */
  disabled?: boolean

  /** 样式，有效值：switch, checkbox
   * @default "switch"
   */
  type?: 'switch' | 'checkbox'

  /** checked 改变时触发 change 事件，
   *
   * event.detail={ value: checked }
   */
  onChange?: CommonEventFunction<{ value: boolean }>

  /** switch 的颜色，同 css 的 color
   */
  color?: string
}

/** 开关选择器
 * @classification forms
 */
declare const Switch: ComponentType<SwitchProps>

export { Switch, SwitchProps }

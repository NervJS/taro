import { ComponentType } from 'react'
import { StandardProps, BaseEventFunction, FormItemProps } from './common'

interface SwitchProps extends StandardProps, FormItemProps {

  /**
   * 是否选中
   *
   * 默认值：`false`
   */
  checked?: boolean,

  /**
   * 样式，有效值：switch, checkbox
   *
   * 默认值：`switch`
   */
  type?: 'switch' | 'checkbox',

  /**
   * checked 改变时触发 change 事件，
   *
   * event.detail={ value:checked}
   */
  onChange?: BaseEventFunction,

  /**
   * switch 的颜色，同 css 的 color
   */
  color?: string
}

declare const Switch: ComponentType<SwitchProps>

export { Switch }

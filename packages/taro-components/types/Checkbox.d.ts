import { ComponentType } from 'react'
import { StandardProps, BaseEventFunction } from './common'

interface CheckboxGroupProps extends StandardProps {
  /**
   * 表单组件中加上 name 来作为 key
   */
  name: string;
  /**
   * <checkbox-group/>中选中项发生改变是触发 change 事件
   *
   * detail = {value:[选中的checkbox的value的数组]}
   *
   */
  onChange?: BaseEventFunction
}

declare const CheckboxGroup: ComponentType<CheckboxGroupProps>

interface CheckboxProps extends StandardProps {

  /**
   * <checkbox/>标识，选中时触发<checkbox-group/>的 change 事件，并携带 <checkbox/> 的 value
   */
  value: string,

  /**
   * 是否禁用
   */
  disabled?: boolean,

  /**
   * 当前是否选中，可用来设置默认选中
   */
  checked?: boolean,

  /**
   * checkbox的颜色，同css的color
   */
  color?: string
}

declare const Checkbox: ComponentType<CheckboxProps>


export { CheckboxGroup, Checkbox }

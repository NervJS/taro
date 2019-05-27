import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export interface FormProps extends StandardProps {
  /**
   * 是否返回 formId 用于发送模板消息
   */
  reportSubmit?: boolean,

  /**
   * 携带 form 中的数据触发 submit 事件
   *
   * event.detail = {value : {'name': 'value'} , formId: ''}
   */
  onSubmit?: CommonEventFunction,

  /**
   * 表单重置时会触发 reset 事件
   */
  onReset?: CommonEventFunction
}

declare const Form: ComponentType<FormProps>

export { Form }

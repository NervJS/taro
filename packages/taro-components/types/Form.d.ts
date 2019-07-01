import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export interface FormProps extends StandardProps {
  /**
   * 是否返回 `formId` 用于发送模板消息。
   *
   * @default false
   */
  reportSubmit?: boolean,

  /**
   * 等待一段时间（毫秒数）以确认 `formId` 是否生效。
   * 如果未指定这个参数，`formId` 有很小的概率是无效的（如遇到网络失败的情况）。
   * 指定这个参数将可以检测 `formId` 是否有效，
   * 以这个参数的时间作为这项检测的超时时间。
   * 如果失败，将返回 `requestFormId:fail` 开头的 `formId`。
   *
   * @default 0
   *
   * @since 2.6.2
   */
  reportSubmitTimeout?: number,

  /**
   * 携带 form 中的数据触发 submit 事件
   *
   * event.detail = {value : {'name': 'value'} , formId: ''}
   */
  onSubmit?: CommonEventFunction<{
    /**
     * 当点击 `<form>` 表单中 `form-type` 为 `submit` 的 `<button>` 组件时，
     * 会将表单组件中的 `value` 值进行提交，
     * 需要在表单组件中加上 `name` 来作为 `key`。
     */
    value?: {
      [formItemName: string]: any,
    },
    /**
     * 当 `reportSubmit` 为 `true` 时，返回 `formId` 用于发送模板消息。
     */
    formId?: string,
  }>,

  /**
   * 表单重置时会触发 reset 事件
   */
  onReset?: CommonEventFunction,
}

declare const Form: ComponentType<FormProps>

export { Form }

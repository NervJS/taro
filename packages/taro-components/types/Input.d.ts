import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

export interface InputProps extends StandardProps, FormItemProps {

  /**
   * 输入框的初始内容
   */
  value?: string,

  /**
   * input 的类型
   *
   * 默认值：`text`
   */
  type?: 'text' | 'number' | 'idcard' | 'digit',

  /**
   * 是否是密码类型
   */
  password?: boolean,

  /**
   * 输入框为空时占位符
   */
  placeholder?: string,

  /**
   * 指定 placeholder 的样式
   */
  placeholderStyle?: string,

  /**
   * 指定 placeholder 的样式类
   *
   * 默认值：`input-placeholder`
   */
  placeholderClass?: string,

  /**
   * 是否禁用
   */
  disabled?: boolean,

  /**
   * 最大输入长度，设置为 -1 的时候不限制最大长度
   *
   * 默认值：`140`
   */
  maxLength?: number,

  /**
   * 指定光标与键盘的距离，单位 px 。取 input 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离
   *
   * 默认值： `0`
   */
  cursorSpacing?: number,

  /**
   * (即将废弃，请直接使用 focus )自动聚焦，拉起键盘
   *
   * 默认值：false
   */
  autoFocus?: boolean,

  /**
   * 获取焦点
   */
  focus?: boolean,


  /**
   * 设置键盘右下角按钮的文字
   *
   * 默认值：`done`
   */
  confirmType?: 'send' | 'search' | 'next' | 'go' | 'done',

  /**
   * 点击键盘右下角按钮时是否保持键盘不收起
   *
   * 默认值：`false`
   */
  confirmHold?: boolean,

  /**
   * 指定focus时的光标位置
   */
  cursor?: number,

  /**
   * 光标起始位置，自动聚集时有效，需与selection-end搭配使用
   *
   * 默认值：`-1`
   */
  selectionStart?: number,

  /**
   * 光标结束位置，自动聚集时有效，需与selection-start搭配使用
   *
   * 默认值：`-1`
   */
  selectionEnd?: number,

  /**
   * 键盘弹起时，是否自动上推页面
   *
   * 默认值：`false`
   */
  adjustPosition?: boolean,

  /**
   * 当键盘输入时，触发input事件，event.detail = {value, cursor, keyCode}，处理函数可以直接 return 一个字符串，将替换输入框的内容。
   */
  onInput?: CommonEventFunction<{
    /** 输入值 */
    value: string,
    /** 光标位置 */
    cursor: number,
    /** 键值 */
    keyCode: number,
  }>,

  /**
   * 输入框聚焦时触发，event.detail = { value, height }，height 为键盘高度，在基础库 1.9.90 起支持
   */
  onFocus?: CommonEventFunction<{
    /** 输入值 */
    value: string,
    /** 键盘高度 */
    height: number,
  }>,

  /**
   * 输入框失去焦点时触发
   *
   * event.detail = {value: value}
   */
  onBlur?: CommonEventFunction<{
    /** 输入值 */
    value: string,
  }>,


  /**
   * 点击完成按钮时触发
   *
   * event.detail = {value: value}
   */
  onConfirm?: CommonEventFunction<{
    /** 输入值 */
    value: string,
  }>
}

declare const Input: ComponentType<InputProps>

export { Input }

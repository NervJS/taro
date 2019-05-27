import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

export interface TextareaProps extends StandardProps, FormItemProps {

  /**
   * 输入框的内容
   */
  value: string,

  /**
   * 输入框为空时占位符
   */
  placeholder?: string,

  /**
   * 指定 placeholder 的样式类
   *
   * 默认值：`textarea-placeholder`
   */
  placeholderClass?: string,

  /**
   * 指定 placeholder 的样式
   */
  placeholderStyle?: string,

  /**
   * 是否禁用
   *
   * 默认值：`false`
   */
  disabled?: boolean,

  /**
   * 最大输入长度，设置为 -1 的时候不限制最大长度
   *
   * 默认值：`140`
   */
  maxlength?: number,

  /**
   * 自动聚焦，拉起键盘。
   *
   * 默认值：`false`
   */
  autoFocus?: boolean,

  /**
   * 获取焦点
   *
   * 默认值：`false`
   */
  focus?: boolean,

  /**
   * 是否自动增高，设置auto-height时，style.height不生效
   *
   * 默认值：`false`
   */
  autoHeight?: boolean,

  /**
   * 如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true
   *
   * 默认值：`false`
   */
  fixed?: boolean,

  /**
   * 指定光标与键盘的距离，单位 px 。取 textarea 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离
   *
   * 默认值：`0`
   */
  cursorSpacing?: number,

  /**
   * 指定focus时的光标位置
   *
   */
  cursor?: number,

  /**
   * 是否显示键盘上方带有”完成“按钮那一栏
   *
   * 默认值：`true`
   */
  showConfirmBar?: boolean,

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
   * 默认值：`true`
   */
  adjustPosition?: boolean,

  /**
   * 输入框聚焦时触发
   *
   * event.detail = { value, height }
   *
   * height 为键盘高度
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
   * event.detail = {value, cursor}
   *
   */
  onBlur?: CommonEventFunction<{
    /** 输入值 */
    value: string,
    /** 光标位置 */
    cursor: number,
  }>,

  /**
   * 输入框行数变化时调用
   *
   * event.detail = {height: 0, heightRpx: 0, lineCount: 0}
   */
  onLineChange?: CommonEventFunction<{
    height: number,
    heightRpx: number,
    lineCount: number,
  }>,

  /**
   * 当键盘输入时，触发 input 事件
   *
   * event.detail = {value, cursor, keyCode}
   *
   * **onInput 处理函数的返回值并不会反映到 textarea 上**
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
   * 点击完成时， 触发 confirm 事件，
   *
   * event.detail = {value: value}
   */
  onConfirm?: CommonEventFunction<{
    /** 输入值 */
    value: string,
  }>
}

declare const Textarea: ComponentType<TextareaProps>

export { Textarea }


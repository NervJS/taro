import { ComponentType } from 'react'
import { StandardProps } from './common'

export interface TextProps extends StandardProps {

  /**
   * 文本是否可选
   *
   * 默认值：`false`
   */
  selectable?: boolean,

  /**
   * 显示连续空格, 可选值：
   *
   * `ensp`:	中文字符空格一半大小
   *
   * `emsp`:	中文字符空格大小
   *
   * `nbsp`:	根据字体设置的空格大小
   *
   * 默认值：`false`
   */
  space?: string,

  /**
   * 是否解码
   *
   * 默认值：`false`
   */
  decode?: boolean
}

declare const Text: ComponentType<TextProps>

export { Text }

import { ComponentType } from 'react'
import { StandardProps } from './common'

interface Text {

  /**
   * 文本字符串，支持 entities
   *
   * 默认值：``
   */
  text: string
}

interface HTMLElement {

  /**
   * 支持部分受信任的HTML节点
   *
   */
  name: string,

  /**
   * 支持部分受信任的属性，遵循Pascal命名法
   */
  attrs?: Object,

  /**
   * 结构和nodes一致
   */
  children?: Nodes
}

type Nodes = Array<Text | HTMLElement> | string

interface RichTextProps extends StandardProps {
  nodes: Nodes
}

declare const RichText: ComponentType<RichTextProps>

export { RichText }

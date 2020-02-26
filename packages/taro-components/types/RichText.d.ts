import { ComponentType } from 'react'
import { StandardProps } from './common'

interface RichTextProps extends StandardProps {
  /** 节点列表/ HTML String */
  nodes: Nodes
  /** 显示连续空格
   * @supported weapp
   */
  space: keyof RichTextProps.TSpace
}

/** 节点类型
 * > 现支持两种节点，通过type来区分，分别是元素节点和文本节点，默认是元素节点，在富文本区域里显示的HTML节点 元素节点：type = node*
 */
type Nodes = Array<RichTextProps.Text | RichTextProps.HTMLElement> | string

declare namespace RichTextProps {
  /** space 的合法值 */
  interface TSpace {
    /** 中文字符空格一半大小 */
    ensp
    /** 中文字符空格大小 */
    emsp
    /** 根据字体设置的空格大小 */
    nbsp
  }
  
  /** 文本节点 */
  interface Text {
    /** 文本类型 */
    type: 'text'
  
    /** 文本字符串
     * @remarks 支持 entities
     * @default ""
     */
    text: string
  }
  
  /** 元素节点，默认为元素节点
   * 全局支持class和style属性，不支持 id 属性。
   */
  interface HTMLElement {
    /** HTML 类型 */
    type?: 'node'
  
    /** 标签名
     * @remarks 支持部分受信任的 HTML 节点
     */
    name: string
  
    /** 属性
     * @remarks 支持部分受信任的属性，遵循 Pascal 命名法
     */
    attrs?: Object
  
    /** 子节点列表
     * @remarks 结构和 nodes 一致
     */
    children?: Nodes
  }
}

/** 富文本
 * @classification base
 * @supported weapp, swan, alipay, tt, h5, rn
 * @example
 * ```tsx
 * class App extends Components {
 *   state = {
 *     nodes: [{
 *       name: 'div',
 *       attrs: {
 *         class: 'div_class',
 *         style: 'line-height: 60px; color: red;'
 *       },
 *       children: [{
 *         type: 'text',
 *         text: 'Hello World!'
 *       }]
 *     }]
 *   }
 *   render () {
 *     return (
 *       <RichText nodes={this.state.nodes} />
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html
 */
declare const RichText: ComponentType<RichTextProps>

export { RichText, RichTextProps }

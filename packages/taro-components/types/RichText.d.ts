import { ComponentType } from 'react'
import { CommonEventFunction, StandardProps } from './common'
interface RichTextProps extends StandardProps {
  /** 文本是否可选，该属性会使节点显示为 block
   * @default false
   * @supported weapp, h5
   */
  userSelect?: boolean
  /** 节点列表/ HTML String
   * @supported weapp, alipay, swan, tt, qq, h5, rn, harmony
   */
  nodes?: Nodes
  /** 显示连续空格
   * @supported weapp, alipay, tt, qq, h5, rn
   */
  space?: keyof RichTextProps.TSpace
  /** 富文本是否可以长按选中，可用于复制，粘贴，长按搜索等场景
   * @default false（基础库 3.150.1 以前版本）true（基础库 3.150.1 及以后版本）
   * @supported swan, h5
   */
  selectable?: string
  /** 阻止长按图片时弹起默认菜单（将该属性设置为image-menu-prevent或image-menu-prevent="true"），只在初始化时有效，不能动态变更；若不想阻止弹起默认菜单，则不需要设置此属性
   * @default false
   * @supported swan
   */
  imageMenuPrevent?: string
  /** 富文本中的图片是否可点击预览。在不设置的情况下，若 rich-text 未监听点击事件，则默认开启。未显示设置 preview 时会进行点击默认预览判断，建议显示设置 preview
   * @supported swan
   */
  preview?: string
  /** 触摸。
   * @supported alipay
   */
  onTap?: CommonEventFunction
  /** 触摸动作开始。
   * @supported alipay
   */
  onTouchstart?: CommonEventFunction
  /** 触摸移动事件。
   * @supported alipay
   */
  onTouchmove?: CommonEventFunction
  /** 触摸动作被打断。
   * @supported alipay
   */
  onTouchcancel?: CommonEventFunction
  /** 触摸动作结束。
   * @supported alipay
   */
  onTouchend?: CommonEventFunction
  /** 触摸后，超过 500ms 再离开。
   * @supported alipay
   */
  onLongtap?: CommonEventFunction
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
 * @supported weapp, swan, alipay, tt, h5, rn, harmony
 * @example_react
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
 * @example_vue
 * ```html
 * <template>
 *   <view class="components-page">
 *     <rich-text :nodes="nodes"></rich-text>
 *   </view>
 * </template>
 *
 * <script>
 * export default {
 *   name: 'Index',
 *   data() {
 *     return {
 *       nodes: [{
 *         name: 'div',
 *         attrs: {
 *           class: 'div_class',
 *           style: 'line-height: 60px; color: red;'
 *         },
 *         children: [{
 *           type: 'text',
 *           text: 'Hello World!'
 *         }]
 *       }]
 *     }
 *   },
 *   onReady () {
 *     console.log('onReady')
 *   }
 * }
 * </script>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html
 */
declare const RichText: ComponentType<RichTextProps>
export { RichText, RichTextProps }

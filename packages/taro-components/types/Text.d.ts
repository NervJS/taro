import { ComponentType } from 'react'
import { StandardProps } from './common'
interface TextProps extends StandardProps {
  /** 文本是否可选
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  selectable?: boolean
  /** 文本是否可选，该属性会使文本节点显示为 inline-block
   * @default false
   * @supported weapp, h5, harmony_hybrid
   */
  userSelect?: boolean
  /** 显示连续空格
   * @supported weapp, alipay, swan, tt, qq, jd, h5, harmony_hybrid
   */
  space?: keyof TextProps.TSpace
  /** 是否解码
   * @default false
   * @supported weapp, alipay, tt, qq, jd
   * @h5 默认解码，不支持设置
   */
  decode?: boolean
  /** 多行省略，值须大于等于 1，表现同 css 的 -webkit-line-clamp 属性一致。
   * @supported alipay
   */
  numberOfLines?: number
  /** 限制文本最大行数
   * @supported weapp
   */
  maxLines?: number
}
declare namespace TextProps {
  /** space 的合法值 */
  interface TSpace {
    /** 中文字符空格一半大小 */
    ensp
    /** 中文字符空格大小 */
    emsp
    /** 根据字体设置的空格大小 */
    nbsp
  }
  interface Overflow {
    /** 修剪文本 */
    clip
    /** 淡出 */
    fade
    /** 显示省略号 */
    ellipsis
    /** 文本不截断 */
    visible
  }
}
/** 文本
 * @classification base
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
 * @example_react
 * ```tsx
 * export default class PageView extends Component {
 *   state = {
 *     contents: [],
 *     contentsLen: 0
 *   }
 *
 *   add = () => {
 *     this.setState(prev => {
 *       const cot = prev.contents.slice()
 *       cot.push({ text: 'hello world' })
 *       return {
 *         contents: cot,
 *         contentsLen: cot.length
 *       }
 *     })
 *   }
 *
 *   remove = () => {
 *     this.setState(prev => {
 *       const cot = prev.contents.slice()
 *       cot.pop()
 *       return {
 *         contents: cot,
 *         contentsLen: cot.length
 *       }
 *     })
 *   }
 *
 *   render () {
 *     return (
 *       <View className='container'>
 *         {this.state.contents.map((item, index) => (
 *           <Text key={index}>{item.text}</Text>
 *         ))}
 *         <Button className='btn-max-w button_style' plain type='default' onClick={this.add}>add line</Button>
 *         <Button className='btn-max-w button_style' plain type='default' disabled={this.state.contentsLen ? false : true} onClick={this.remove}>remove line</Button>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ``` html
 * <template>
 *   <view class="container">
 *     <view v-for="(item, index) in contents">
 *       <text>{{item.text}} line {{index + 1}}</text>
 *     </view>
 *     <button class="btn-max-w button_style" :plain="true" type="default" `@tap="add">add line</button>
 *     <button class="btn-max-w button_style" :plain="true" type="default" :disabled="contentsLen ? false : true" `@tap="remove">remove line</button>
 * </template>
 *
 * <script>
 * export default {
 *   data() {
 *     return {
 *       contents: [],
 *       contentsLen: 0
 *     }
 *   },
 *   methods: {
 *     add () {
 *       const cot = this.contents.slice()
 *       cot.push({ text: 'hello world' })
 *       this.contents = cot
 *       this.contentsLen = cot.length
 *     },
 *
 *     remove () {
 *       const cot = this.contents.slice()
 *       cot.pop()
 *       this.contents = cot
 *       this.contentsLen = cot.length
 *     }
 *   }
 * }
 * </script>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/text.html
 */
declare const Text: ComponentType<TextProps>
export { Text, TextProps }

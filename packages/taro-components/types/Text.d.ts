/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { ComponentType } from 'react'
import { StandardProps } from './common'
interface TextProps extends StandardProps {
  /** 文本是否可选
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  selectable?: boolean

  /** 文本是否可选，该属性会使文本节点显示为 inline-block
   * @default false
   * @supported weapp
   */
  userSelect?: boolean

  /** 显示连续空格
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  space?: keyof TextProps.TSpace

  /** 是否解码
   * @default false
   * @supported weapp, alipay, tt, qq, jd
   */
  decode?: boolean

  /** 多行省略，值须大于等于 1，表现同 css 的 -webkit-line-clamp 属性一致。
   * @supported alipay
   */
  numberOfLines?: string
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
}

/** 文本
 * @classification base
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
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

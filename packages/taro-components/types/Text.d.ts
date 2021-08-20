/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { ComponentType } from 'react'
import { StandardProps } from './common'

interface TextProps extends StandardProps {
  /** 文本是否可选
   * @default false
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  selectable?: boolean

  /** 显示连续空格
   * @supported weapp, swan, tt
   */
  space?: keyof TextProps.TSpace

  /** 是否解码
   * @default false
   * @supported weapp, tt
   */
  decode?: boolean
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
 * @supported weapp, swan, alipay, tt, h5, rn
 * @example
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
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/text.html
 */
declare const Text: ComponentType<TextProps>

export { Text, TextProps }

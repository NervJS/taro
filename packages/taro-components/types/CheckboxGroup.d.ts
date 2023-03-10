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
import { StandardProps, CommonEventFunction, FormItemProps } from './common'
interface CheckboxGroupProps extends StandardProps, FormItemProps {
  /** 表单组件中加上 name 来作为 key
   * @supported alipay, tt, h5
   */
  name?: string

  /** `<CheckboxGroup/>` 中选中项发生改变是触发 change 事件
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  onChange?: CommonEventFunction<{
    value: string[]
  }>
}

/** 多项选择器，内部由多个checkbox组成
 * @classification forms
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony
 * @example
 * ```tsx
 * export default class PageCheckbox extends Component {
 *   state = {
 *     list: [
 *       {
 *         value: '美国',
 *         text: '美国',
 *         checked: false
 *       },
 *       {
 *         value: '中国',
 *         text: '中国',
 *         checked: true
 *       },
 *       {
 *         value: '巴西',
 *         text: '巴西',
 *         checked: false
 *       },
 *       {
 *         value: '日本',
 *         text: '日本',
 *         checked: false
 *       },
 *       {
 *         value: '英国',
 *         text: '英国',
 *         checked: false
 *       },
 *       {
 *         value: '法国',
 *         text: '法国',
 *         checked: false
 *       }
 *     ]
 *   }
 *   render () {
 *     return (
 *       <View className='page-body'>
 *         <View className='page-section'>
 *           <Text>默认样式</Text>
 *           <Checkbox value='选中' checked>选中</Checkbox>
 *           <Checkbox style='margin-left: 20rpx' value='未选中'>未选中</Checkbox>
 *         </View>
 *         <View className='page-section'>
 *           <Text>推荐展示样式</Text>
 *           {this.state.list.map((item, i) => {
 *             return (
 *               <Label className='checkbox-list__label' for={i} key={i}>
 *                 <Checkbox className='checkbox-list__checkbox' value={item.value} checked={item.checked}>{item.text}</Checkbox>
 *               </Label>
 *             )
 *           })}
 *         </View>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/checkbox-group.html
 */
declare const CheckboxGroup: ComponentType<CheckboxGroupProps>
export { CheckboxGroup, CheckboxGroupProps }

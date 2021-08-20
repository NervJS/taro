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
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

interface CheckboxProps extends StandardProps {

  /** `<Checkbox/>`标识，选中时触发`<CheckboxGroup/>`的 change 事件，并携带 `<Checkbox/>` 的 value
   * @supported weapp, rn
   */
  value: string

  /** 是否禁用
   * @supported weapp, h5, rn
   * @default false
   */
  disabled?: boolean

  /** 当前是否选中，可用来设置默认选中
   * @supported weapp, h5, rn
   * @default false
   */
  checked?: boolean

  /** checkbox的颜色，同 css 的 color
   * @supported weapp, h5, rn
   */
  color?: string

  /** 选中项发生变化时触发 change 事件，小程序无此 API
   * @supported h5, rn
   */
  onChange?: CommonEventFunction<{ value: string[] }>
}

/** 多选项目
 * @classification forms
 * @supported weapp, h5, rn
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
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/checkbox.html
 */
declare const Checkbox: ComponentType<CheckboxProps>


export { Checkbox, CheckboxProps }

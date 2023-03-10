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
interface SwitchProps extends StandardProps, FormItemProps {
  /** 是否选中
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  checked?: boolean

  /** 是否禁用
   * @default false
   * @supported weapp, alipay, swan, tt, qq, rn
   */
  disabled?: boolean

  /** 样式，有效值：switch, checkbox
   * @default "switch"
   * @supported weapp, swan, tt, qq, jd, h5, rn
   */
  type?: 'switch' | 'checkbox'

  /** switch 的颜色，同 css 的 color
   * @default "#04BE02"
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  color?: string

  /** 用于透传 `WebComponents` 上的属性到内部 H5 标签上
   * @supported h5
   */
  nativeProps?: Record<string, unknown>

  /** 组件名字，用于表单提交获取数据。
   * @supported alipay
   */
  name?: string

  /** 是否为受控组件，为 true 时，checked 会完全受 setData 控制。
   * @default false
   * @supported alipay
   */
  controlled?: string

  /** 无障碍访问，（属性）元素的额外描述
   * @supported qq
   */
  ariaLabel?: string

  /** checked 改变时触发 change 事件
   * @supported weapp, alipay, swan, tt, qq, jd, rn
   */
  onChange?: CommonEventFunction<SwitchProps.onChangeEventDetail>
}
declare namespace SwitchProps {
  interface onChangeEventDetail {
    value: boolean
  }
}

/** 开关选择器
 * @classification forms
 * @example_react
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 *
 *   render() {
 *     return (
 *       <View className='components-page'>
 *         <Text>默认样式</Text>
 *         <Switch checked/>
 *         <Switch/>
 *         <Text>推荐展示样式</Text>
 *         <Switch checked/>
 *         <Switch/>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <view class='components-page'>
 *     <text>默认样式</text>
 *     <switch :checked="true" />
 *     <switch />
 *     <text>推荐展示样式</text>
 *     <switch :checked="true" />
 *     <switch />
 *   </view>
 * </template>
 * ```
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/switch.html
 */
declare const Switch: ComponentType<SwitchProps>
export { Switch, SwitchProps }

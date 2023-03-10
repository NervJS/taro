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
interface RadioGroupProps extends StandardProps, FormItemProps {
  /** 组件名字，用于表单提交获取数据。
   * @supported alipay, tt
   */
  name?: string

  /** RadioGroup 中选中项发生改变时触发 change 事件，detail = {value:[选中的radio的value的数组]}
   * @supported weapp, alipay, swan, tt, qq, jd, h5
   */
  onChange?: CommonEventFunction
}
declare namespace RadioGroupProps {
  interface onChangeEventDetail {
    value: string[]
  }
}

/** 单项选择器，内部由多个 Radio 组成。
 * @classification forms
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/radio-group.html
 */
declare const RadioGroup: ComponentType<RadioGroupProps>
export { RadioGroup, RadioGroupProps }

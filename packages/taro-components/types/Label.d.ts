/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
interface LabelProps extends StandardProps {
  /** 绑定控件的 id */
  for?: string
}

/** 用来改进表单组件的可用性。
 *
 * 使用for属性找到对应的id，或者将控件放在该标签下，当点击时，就会触发对应的控件。 for优先级高于内部控件，内部有多个控件的时候默认触发第一个控件。 目前可以绑定的控件有：button, checkbox, radio, switch。
 * @classification forms
 * @supported weapp, swan, alipay, tt, h5, rn, harmony
 * @example_react
 * ```tsx
 * class App extends Components {
 *
 *   render () {
 *     return (
 *       <RadioGroup>
 *         <Label className='example-body__label' for='1' key='1'>
 *           <Radio value='USA'>USA</Radio>
 *         </Label>
 *         <Label className='example-body__label' for='2' key='2'>
 *           <Radio value='CHN' checked>
 *           CHN
 *           </Radio>
 *         </Label>
 *       </RadioGroup>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <radio-group>
 *     <label class="example-body__label" for="1" key="1">
 *       <radio id="1" value="USA" />
 *       USA
 *     </label>
 *     <label class="example-body__label" for="2" key="2">
 *       <radio id="2" value="CHN" :checked="true" />
 *       CHN
 *     </label>
 *   </radio-group>
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/label.html
 */
declare const Label: ComponentType<LabelProps>
export { Label, LabelProps }

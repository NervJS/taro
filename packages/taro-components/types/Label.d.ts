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

interface LabelProps extends StandardProps {

  /** 绑定控件的 id
   */
  for?: string
}

/** 用来改进表单组件的可用性。
 * 
 * 使用for属性找到对应的id，或者将控件放在该标签下，当点击时，就会触发对应的控件。 for优先级高于内部控件，内部有多个控件的时候默认触发第一个控件。 目前可以绑定的控件有：button, checkbox, radio, switch。
 * @classification forms
 * @supported weapp, swan, alipay, tt, h5
 * @example
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
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/label.html
 */
declare const Label: ComponentType<LabelProps>

export { Label, LabelProps }

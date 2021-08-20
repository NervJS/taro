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

import { TaroElement } from './element'
import {
  VALUE,
  INPUT,
  CHANGE
} from '../constants'

import type { TaroEvent } from './event'

export class FormElement extends TaroElement {
  public get value () {
    // eslint-disable-next-line dot-notation
    const val = this.props[VALUE]
    return val == null ? '' : val
  }

  public set value (val: string | boolean | number | any[]) {
    this.setAttribute(VALUE, val)
  }

  public dispatchEvent (event: TaroEvent) {
    if (event.mpEvent) {
      const val = event.mpEvent.detail.value
      if (event.type === CHANGE) {
        this.props.value = val as string
      } else if (event.type === INPUT) {
        // Web 规范中表单组件的 value 应该跟着输入改变
        // 只是改 this.props.value 的话不会进行 setData，因此这里修改 this.value。
        // 只测试了 React、Vue、Vue3 input 组件的 onInput 事件，onChange 事件不确定有没有副作用，所以暂不修改。
        this.value = val as string
      }
    }

    return super.dispatchEvent(event)
  }
}

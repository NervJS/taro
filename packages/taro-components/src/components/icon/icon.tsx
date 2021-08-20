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

import { Component, h, ComponentInterface, Prop, Host } from '@stencil/core'
import classNames from 'classnames'

export type Type = 'success' | 'success_no_circle' | 'info'| 'warn'| 'waiting'| 'cancel'| 'download'| 'search'| 'clear'
type IconType = Exclude<Type, 'success_no_circle'> | 'success-no-circle'

@Component({
  tag: 'taro-icon-core'
})
export class Icon implements ComponentInterface {
  @Prop() type: Type
  @Prop() size: string | number = '23'
  @Prop() color: string

  render () {
    const {
      type,
      size,
      color
    } = this

    const iconType = type?.replace(/_/g, '-') as IconType

    const cls = classNames({
      [`weui-icon-${iconType}`]: true
    })

    const style = {
      'font-size': `${size}px`,
      color
    }

    return (
      <Host class={cls} style={style} />
    )
  }
}

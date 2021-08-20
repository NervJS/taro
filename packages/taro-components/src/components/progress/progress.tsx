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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Host } from '@stencil/core'

@Component({
  tag: 'taro-progress-core'
})
export class Index implements ComponentInterface {
  @Prop() percent = 0
  @Prop() showInfo = false
  @Prop() borderRadius: number | string = 0
  @Prop() fontSize: number | string = 16
  @Prop() strokeWidth: number | string = 6
  @Prop() activeColor = '#09BB07'
  @Prop() backgroundColor = '#EBEBEB'
  @Prop() active = false

  render () {
    const {
      percent,
      showInfo,
      borderRadius,
      fontSize,
      strokeWidth,
      activeColor,
      backgroundColor,
      active
    } = this

    const pgPercent = percent > 100 ? 100 : percent < 0 ? 0 : percent
    const pgHeight = {
      height: strokeWidth + 'px',
      backgroundColor
    }
    const transition = active ? 'width 1s ease-in-out' : 'none'
    const pgWdith = {
      width: `${pgPercent}%`,
      transition,
      WebkitTransition: transition,
      backgroundColor: activeColor,
      borderRadius: borderRadius ? `${borderRadius}px` : '0px'
    }

    return (
      <Host class='weui-progress'>
        <div class='weui-progress__bar' style={pgHeight}>
          <div class='weui-progress__inner-bar' style={pgWdith} />
        </div>

        {showInfo && (
          <div class='weui-progress__opr' style={{ 'font-size': `${fontSize}px` }}>
            <span>{pgPercent}%</span>
          </div>
        )}
      </Host>
    )
  }
}

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

import { Component, h, ComponentInterface, Prop, Host } from '@stencil/core'

@Component({
  tag: 'taro-progress-core'
})
export class Progress implements ComponentInterface {
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
    const pgWidth = {
      width: `${pgPercent}%`,
      transition,
      WebkitTransition: transition,
      backgroundColor: activeColor,
      borderRadius: borderRadius ? `${borderRadius}px` : '0px'
    }

    return (
      <Host class='weui-progress'>
        <div class='weui-progress__bar' style={pgHeight}>
          <div class='weui-progress__inner-bar' style={pgWidth} />
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

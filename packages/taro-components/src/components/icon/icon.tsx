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

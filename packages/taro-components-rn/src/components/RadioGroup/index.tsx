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

import * as React from 'react'
import {
  View
} from 'react-native'
import { noop } from '../../utils'
import { RadioGroupProps, RadioGroupState, EventOnChange } from './PropsType'

class _RadioGroup extends React.Component<RadioGroupProps, RadioGroupState> {
  static displayName = '_RadioGroup'
  state: RadioGroupState = {
    checkedValue: undefined
  }

  // eslint-disable-next-line default-param-last
  onValueChange = (radioOnChangeFn: () => void = noop, e: EventOnChange): void => {
    const { onChange = noop } = this.props
    this.setState({ checkedValue: e.value })
    radioOnChangeFn()
    onChange({
      detail: {
        value: e.value
      }
    })
  }

  findAndAttachCb = (children: React.ReactNode): React.ReactNode => {
    return React.Children.toArray(children).map((child: any) => {
      if (!child.type) return child

      const childTypeName = child.type.displayName
      if (childTypeName === '_Radio') {
        const { _onGroupDataInitial = noop } = this.props
        const { checkedValue } = this.state
        if (!checkedValue && child.props.checked) {
          _onGroupDataInitial(child.props.value)
        }
        return React.cloneElement(child, {
          checked: checkedValue ? checkedValue === child.props.value : child.props.checked,
          onChange: this.onValueChange.bind(this, child.props.onChange)
        })
      } else {
        return React.cloneElement(child, { ...child.props }, this.findAndAttachCb(child.props.children))
      }
    })
  }

  render (): JSX.Element {
    const {
      children,
      style,
    } = this.props

    const mapChildren: React.ReactNode = this.findAndAttachCb(children)

    return (
      <View style={style}>
        {mapChildren}
      </View>
    )
  }
}

export default _RadioGroup

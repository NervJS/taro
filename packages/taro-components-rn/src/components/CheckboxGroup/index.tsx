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

import * as React from 'react'
import {
  View,
} from 'react-native'
import { noop } from '../../utils'
import { CheckboxGroupProps, EventOnChange, ValueProps } from './PropsType'

class _CheckboxGroup extends React.Component<CheckboxGroupProps> {
  static displayName = '_CheckboxGroup'

  values: ValueProps[] = []
  tmpIndex = 0

  getDataFromValues = (): ValueProps[] => {
    return this.values
      .filter((item) => item.checked)
      .map((item) => item.value)
  }

  toggleChange = (e: EventOnChange, index: number): void => {
    const { onChange = noop } = this.props
    this.values[index] = {
      value: e.value,
      checked: e.checked
    }
    onChange({
      detail: {
        value: this.getDataFromValues()
      }
    })
  }

  findAndAttachCb = (children: React.ReactNode): React.ReactNode => {
    return React.Children.toArray(children).map((child: any) => {
      if (!child.type) return child

      const childTypeName = child.type.displayName
      if (childTypeName === '_Checkbox') {
        const { value, disabled, checked, color } = child.props
        const index = this.tmpIndex++
        this.values[index] = { value, checked }
        return React.cloneElement(child, {
          onChange: (e: EventOnChange) => this.toggleChange(e, index),
          value,
          disabled,
          checked,
          color
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
      _onGroupDataInitial = noop
    } = this.props

    this.tmpIndex = 0
    const mapChildren = this.findAndAttachCb(children)
    _onGroupDataInitial(this.getDataFromValues())

    return (
      <View style={style}>
        {mapChildren}
      </View>
    )
  }
}

export default _CheckboxGroup

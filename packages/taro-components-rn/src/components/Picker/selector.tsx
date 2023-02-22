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
import AntPicker from '@ant-design/react-native/lib/picker'
import { noop } from '../../utils'
import { SelectorProps, SelectorState } from './PropsType'
import { TouchableWithoutFeedback } from 'react-native'

function convertToObj (item?: any, rangeKey = ''): any {
  if (typeof item === 'object') {
    return { value: item[rangeKey], label: item[rangeKey] }
  } else {
    return { value: item, label: item }
  }
}

export default class Selector extends React.Component<SelectorProps, SelectorState> {
  static defaultProps = {
    range: [],
    value: 0,
  }

  state: any = {
    pRange: [],
    range: [],
    value: 0,
    pValue: '',
  }

  dismissByOk = false

  static getDerivedStateFromProps (nextProps: SelectorProps, lastState: SelectorState): SelectorState | null {
    let ret: any = null
    if (nextProps.range !== lastState.pRange) {
      ret = {
        pRange: nextProps.range,
        range: (nextProps.range || []).map((item) => {
          return convertToObj(item, nextProps.rangeKey)
        })
      }
    }
    if (nextProps.value !== lastState.pValue) {
      ret = ret || {}
      ret.value = nextProps.value
      ret.pValue = nextProps.value
    }
    return ret
  }

  onChange = (): void => {
    const { onChange = noop } = this.props
    const { value } = this.state
    onChange({ detail: { value } })
  }

  onPickerChange = (value: any[]): void => {
    const { range } = this.state
    let selectedIndex = 0
    for (let i = 0; i < range.length; i++) {
      if (range[i].value === value[0]) {
        selectedIndex = i
        break
      }
    }
    this.setState({ value: selectedIndex })
  }

  onOk = (): void => {
    this.dismissByOk = true
  }

  onVisibleChange = (visible: boolean): void => {
    if (!visible && !this.dismissByOk) {
      const { onCancel = noop } = this.props
      onCancel()
    }
    this.dismissByOk = false
  }

  render (): JSX.Element {
    const {
      children,
      disabled,
      itemStyle,
      indicatorStyle,
    } = this.props
    const {
      range,
      value,
    } = this.state

    const selected: any = range[value]

    return (
      // @ts-ignore
      <AntPicker
        data={range}
        value={[selected && selected.value]}
        cols={1}
        itemStyle={itemStyle}
        indicatorStyle={indicatorStyle}
        onChange={this.onChange}
        onPickerChange={this.onPickerChange}
        onOk={this.onOk}
        onVisibleChange={this.onVisibleChange}
        disabled={disabled}
      >
        <TouchableWithoutFeedback>
          {children}
        </TouchableWithoutFeedback>
      </AntPicker>
    )
  }
}

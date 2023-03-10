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
import AntPicker from '@ant-design/react-native/lib/picker'
import { PickerData } from '@ant-design/react-native/lib/picker/PropsType'
import { regionData } from './regionData'
import { noop } from '../../utils'
import { RegionProps, RegionState, RegionObj } from './PropsType'
import { TouchableWithoutFeedback } from 'react-native'

function formateRegionData(clObj: RegionObj[] = [], customItem?: string, depth = 2): PickerData[] {
  const l = depth
  const obj: PickerData[] = []
  if (customItem) {
    const objClone: PickerData = {
      value: customItem,
      label: customItem
    }
    const panding = { ...objClone }
    let loop = panding
    while (depth-- > 0) {
      loop.children = [{ ...objClone }]
      loop = loop.children[0]
    }
    obj.push(panding)
  }
  for (let i = 0; i < clObj.length; i++) {
    const region: PickerData = {
      value: clObj[i].value,
      label: clObj[i].value,
    }
    if (clObj[i].children) {
      region.children = formateRegionData(clObj[i].children, customItem, l - 1)
    }
    obj.push(region)
  }
  return obj
}

export default class RegionSelector extends React.Component<RegionProps, RegionState> {
  constructor(props: RegionProps) {
    super(props)
    this.regionData = formateRegionData(props.regionData || regionData, props.customItem)
  }

  static defaultProps = {
    value: [],
  }

  static getDerivedStateFromProps(nextProps: Required<RegionProps>, lastState: RegionState): RegionState | null {
    if (nextProps.value !== lastState.pValue) {
      return {
        value: nextProps.value,
        pValue: nextProps.value
      }
    }
    return null
  }

  state = {
    value: [],
    pValue: []
  }

  dismissByOk = false

  regionData: PickerData[]

  onChange = (value: string[]): void => {
    const { onChange = noop } = this.props
    // 通过 value 查找 code
    let tmp: RegionObj[] = this.props.regionData || regionData
    const postcode: (string | undefined)[] = []
    const code = value.map((item) => {
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].value === item) {
          const code = tmp[i].code
          postcode.push(tmp[i].postcode)
          tmp = tmp[i].children || []
          return code
        }
      }
    }).filter(code => !!code)
    const detail: Record<string, any> = { value, code }
    if (postcode[2]) detail.postcode = postcode[2]
    onChange({ detail })
  }

  onPickerChange = (value: any[]): void => {
    this.setState({ value })
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

  render(): JSX.Element {
    const {
      children,
      disabled,
    } = this.props
    const {
      value,
    } = this.state

    return (
      // @ts-ignore
      <AntPicker
        data={this.regionData}
        value={value}
        onChange={this.onChange}
        onPickerChange={this.onPickerChange}
        onOk={this.onOk}
        onVisibleChange={this.onVisibleChange}
        disabled={disabled}
      >
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </AntPicker>
    )
  }
}

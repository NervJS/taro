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

import * as React from 'react'
import AntPicker from '@ant-design/react-native/lib/picker'
import { PickerData } from '@ant-design/react-native/lib/picker/PropsType'
import { regionData } from './regionData'
import { noop } from '../../utils'
import { RegionProps, RegionState, RegionObj } from './PropsType'
import { TouchableWithoutFeedback } from 'react-native'

function formateRegionData(clObj:RegionObj[] = [], customItem?:string, depth = 2):PickerData[] {
  const l = depth
  const obj:PickerData[] = []
  if (customItem) {
    const objClone:PickerData = {
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
    const region:PickerData = {
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
  constructor (props: RegionProps) {
    super(props)
    this.regionData = formateRegionData(props.regionData || regionData, props.customItem)
  }

  static defaultProps = {
    value: [],
  }

  static getDerivedStateFromProps (nextProps: RegionProps, lastState: RegionState): RegionState | null {
    if (nextProps.value !== lastState.pvalue) {
      return {
        value: nextProps.value,
        pvalue: nextProps.value
      }
    }
    return null
  }

  state = {
    value: [],
    pvalue: []
  }

  dismissByOk = false

  regionData: PickerData[]

  onChange = (value: string[]): void => {
    const { onChange = noop } = this.props
    // 通过 value 查找 code
    let tmp: RegionObj[] = this.props.regionData || regionData
    const postcode:(string|undefined)[] = []
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
    const detail:Record<string, any> = { value, code }
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

  render (): JSX.Element {
    const {
      children,
      disabled,
    } = this.props
    const {
      value,
    } = this.state

    return (
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

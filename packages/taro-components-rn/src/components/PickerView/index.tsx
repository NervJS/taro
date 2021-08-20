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
import AntPickerView from '@ant-design/react-native/lib/picker-view'
import { noop } from '../../utils'

export default class _Picker extends React.Component<any> {
  static defaultProps = {
    data: [],
    value: []
  }

  onChange = (val: Record<string, any>): void => {
    const { onChange = noop } = this.props
    onChange({ detail: { value: val } })
  }

  handleChildren = (children: React.ReactChild[]): any[] => {
    return children.map((child: any, index: number) => {
      return {
        label: this.getLabelFromChildren(child),
        value: index
      }
    })
  }

  joinString = (data: string | any[] | React.ReactElement): string => {
    return (Array.isArray(data) ? data : [data]).join('')
  }

  getLabelFromChildren = (child: React.ReactElement): string => {
    return child.props && child.props.children ? this.getLabelFromChildren(child.props.children) : this.joinString(child)
  }

  getDataFromChildren = (children: React.ReactNode): any[] => {
    return (Array.isArray(children) ? children : [children]).map((child: any) => {
      return this.handleChildren(child.props && child.props.children ? child.props.children : [child])
    })
  }

  render(): JSX.Element | null {
    const { data, value, children, ...restProps } = this.props
    if (!children) return null
    return (
      <AntPickerView
        {...restProps}
        cols={1}
        value={value}
        data={data.length > 0 ? data : this.getDataFromChildren(children)}
        onChange={this.onChange}
        cascade={false}
      />
    )
  }
}

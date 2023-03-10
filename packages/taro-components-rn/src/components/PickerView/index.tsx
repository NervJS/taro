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
import AntPickerView from '@ant-design/react-native/lib/picker-view'
import { noop } from '../../utils'
import { PickerViewProps } from './PropsType'

export default class _Picker extends React.Component<PickerViewProps> {
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

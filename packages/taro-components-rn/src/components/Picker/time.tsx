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
import AntDatePicker from '@ant-design/react-native/lib/date-picker'
import { noop } from '../../utils'
import { TimeProps } from './PropsType'
import { TouchableWithoutFeedback } from 'react-native'

function formatTimeStr(time = ''): Date {
  const now = new Date()
  let [hour, minute]: any = time.split(':')
  hour = ~~hour
  minute = ~~minute
  now.setHours(hour, minute)
  return now
}

export default class TimeSelector extends React.Component<TimeProps, any> {
  static defaultProps = {
    value: new Date(),
    start: '00:00',
    end: '23:59'
  }

  state: any = {
    pValue: null,
    value: 0
  }

  dismissByOk = false

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getDerivedStateFromProps(nextProps: TimeProps, lastState: any) {
    if (nextProps.value !== lastState.pValue) {
      const now = new Date()
      if (!nextProps.value || typeof nextProps.value !== 'string') {
        return {
          value: now,
          pValue: now
        }
      }
      return {
        value: formatTimeStr(nextProps.value),
        pValue: nextProps.value
      }
    }
    return null
  }

  onChange = (date: Date): void => {
    const { onChange = noop } = this.props
    const hh: string = ('0' + date.getHours()).slice(-2)
    const mm: string = ('0' + date.getMinutes()).slice(-2)
    onChange({ detail: { value: `${hh}:${mm}` } })
  }

  onValueChange = (vals: number[]): void => {
    const now = new Date()
    now.setHours(vals[0], vals[1])
    this.setState({ value: now })
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
    const { children, start, end, disabled } = this.props
    const { value } = this.state

    return (
      <AntDatePicker
        mode={'time'}
        value={value}
        minDate={formatTimeStr(start)}
        maxDate={formatTimeStr(end)}
        onChange={this.onChange}
        onValueChange={this.onValueChange}
        // @ts-ignore
        onOk={this.onOk}
        onVisibleChange={this.onVisibleChange}
        disabled={disabled}
      >
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </AntDatePicker>
    )
  }
}

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
import AntDatePicker from '@ant-design/react-native/lib/date-picker'
import { noop } from '../../utils'
import { TimeProps, TimeState } from './PropsType'
import { TouchableWithoutFeedback } from 'react-native'

function formatTimeStr(time = ''): Date {
  const now = new Date()
  let [hour, minute]: any = time.split(':')
  hour = ~~hour
  minute = ~~minute
  now.setHours(hour, minute)
  return now
}

export default class TimeSelector extends React.Component<TimeProps, TimeState> {
  static defaultProps = {
    value: new Date(),
    start: '00:00',
    end: '23:59'
  }

  state: any = {
    pValue: null,
    value: new Date()
  }

  static getDerivedStateFromProps(nextProps: TimeProps, lastState: any) {
    if (nextProps.value && nextProps.value !== lastState.pValue) {
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

  onValueChange = (vals: string[]): void => {
    const now = new Date()
    now.setHours(+vals[0], +vals[1])
    console.log('11', this.state)
    this.setState({ value: now })
  }

  onDismiss = (): void => {
    const { onCancel = noop } = this.props
    onCancel()
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
        onDismiss={this.onDismiss}
        disabled={disabled}
      >
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </AntDatePicker>
    )
  }
}

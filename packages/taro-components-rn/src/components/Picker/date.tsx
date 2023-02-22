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
import AntDatePicker from '@ant-design/react-native/lib/date-picker'
import { noop } from '../../utils'
import { DateProps, DateState } from './PropsType'
import { TouchableWithoutFeedback } from 'react-native'
import View from '../View'
function formatTimeStr(time = ''): Date {
  let [year, month, day]: any = time.split('-')
  year = ~~year || 2000
  month = ~~month || 1
  day = ~~day || 1
  return new Date(year, month - 1, day)
}

export default class DateSelector extends React.Component<DateProps, DateState> {
  static defaultProps = {
    value: new Date(),
    fields: 'day',
  }

  state: any = {
    pValue: null,
    value: new Date(),
  }

  dismissByOk = false

  static getDerivedStateFromProps(nextProps: DateProps, lastState: DateState): DateState | null {
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
    const { fields = 'day', onChange = noop } = this.props
    const yyyy: string = date.getFullYear() + ''
    const MM: string = ('0' + (date.getMonth() + 1)).slice(-2)
    const dd: string = ('0' + date.getDate()).slice(-2)
    let ret: string = yyyy
    if (fields === 'month' || fields === 'day') {
      ret += `-${MM}`
      if (fields === 'day') {
        ret += `-${dd}`
      }
    }
    onChange({
      detail: {
        value: ret
      }
    })
  }

  onValueChange = (vals: any[]): void => {
    this.setState({
      value: new Date(vals[0], ~~vals[1], vals[2] || 1)
    })
  }

  onDismiss = (): void => {
    const { onCancel = noop } = this.props
    onCancel()
  }

  render(): JSX.Element {
    const {
      children,
      start = '1970-01-01',
      end = '2999-01-01',
      fields,
      disabled,
    } = this.props
    const {
      value,
    } = this.state

    let mode: any = 'date'
    if (fields === 'year') {
      mode = 'year'
    } else if (fields === 'month') {
      mode = 'month'
    }
    return (
      <AntDatePicker
        mode={mode}
        value={value}
        minDate={formatTimeStr(start)}
        maxDate={formatTimeStr(end)}
        onChange={this.onChange}
        onValueChange={this.onValueChange}
        onDismiss={this.onDismiss}
        disabled={disabled}
      >
        <TouchableWithoutFeedback><View>{children}</View></TouchableWithoutFeedback>
      </AntDatePicker>
    )
  }
}

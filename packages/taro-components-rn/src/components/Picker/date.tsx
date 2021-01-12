import * as React from 'react'
import AntDatePicker from '@ant-design/react-native/lib/date-picker'
import { noop } from '../../utils'
import { DateProps, DateState } from './PropsType'
import { TouchableWithoutFeedback } from 'react-native'
import View from '../View'
function formatTimeStr (time = ''): Date {
  let [year, month, day]: any = time.split('-')
  year = ~~year || 2000
  month = ~~month || 1
  day = ~~day || 1
  return new Date(`${year}/${month}/${day}`)
}

export default class DateSelector extends React.Component<DateProps, DateState> {
  static defaultProps = {
    value: new Date(),
    fields: 'day',
  }

  state: any = {
    pValue: null,
    value: 0,
  }

  static getDerivedStateFromProps (nextProps: DateProps, lastState: DateState): DateState | null {
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
    this.setState({ value: new Date(`${vals[0]}/${~~vals[1] + 1}/${vals[2] || 1}`) })
  }

  onDismiss = (): void => {
    const { onCancel = noop } = this.props
    onCancel()
  }

  render (): JSX.Element {
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

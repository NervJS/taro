import * as React from 'react'
import AntDatePicker from '@ant-design/react-native/lib/date-picker'
import { noop } from '../../utils'
import { DateProps } from './PropsType'

function formatTimeStr (time: string = ''): Date {
  let [year, month, day]: any = time.split('-')
  year = ~~year || 2000
  month = ~~month || 1
  day = ~~day || 1
  return new Date(`${year}/${month}/${day}`)
}

export default class DateSelector extends React.Component<DateProps, any> {
  static defaultProps = {
    value: new Date(),
    fields: 'day',
  }

  state: any = {
    pValue: null,
    value: 0,
  }

  static getDerivedStateFromProps (nextProps: DateProps, lastState: any) {
    if (nextProps.value !== lastState.pValue) {
      const now = new Date()
      if (!nextProps.value || typeof nextProps.value !== 'string') {
        return { value: now }
      }
      return { value: formatTimeStr(nextProps.value) }
    }
    return null
  }

  onChange = (date: Date) => {
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

  onValueChange = (vals: any, index: number) => {
    this.setState({ value: new Date(`${vals[0]}/${~~vals[1] + 1}/${vals[2] || 1}`) })
  }

  onDismiss = () => {
    const { onCancel = noop } = this.props
    onCancel()
  }

  render () {
    const {
      children,
      start,
      end,
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
        {children}
      </AntDatePicker>
    )
  }
}

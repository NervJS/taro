import * as React from 'react'
import AntDatePicker from '@ant-design/react-native/lib/date-picker'
import { noop } from '../../utils'
import { TimeProps } from './PropsType'

function formatTimeStr (time: string = ''): Date {
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
  }

  state: any = {
    pValue: null,
    value: 0,
  }

  static getDerivedStateFromProps (nextProps: TimeProps, lastState: any) {
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
    const { onChange = noop } = this.props
    const hh: string = ('0' + date.getHours()).slice(-2)
    const mm: string = ('0' + date.getMinutes()).slice(-2)
    onChange({ detail: { value: `${hh}:${mm}` } })
  }

  onValueChange = (vals: any, index: number) => {
    const now = new Date()
    now.setHours(vals[0], vals[1])
    this.setState({ value: now })
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
      disabled,
    } = this.props
    const {
      value,
    } = this.state

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
        {children}
      </AntDatePicker>
    )
  }
}

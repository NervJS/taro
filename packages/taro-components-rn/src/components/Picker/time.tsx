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
    start: '00:00',
    end: '23:59'
  }

  state = {
    pValue: '',
    value: '',
    isInOnChangeUpdate: false,
  }

  static getDerivedStateFromProps(nextProps: TimeProps, lastState: TimeState): Partial<TimeState> | null {
    const nextIncomingValue = nextProps.value
    // eslint-disable-next-line eqeqeq
    const isControlled = nextIncomingValue != undefined
    if (isControlled) {
      if (nextIncomingValue !== lastState.pValue) {
        // 受控更新
        return {
          pValue: nextIncomingValue,
          value: nextIncomingValue,
        }
      } else if (lastState.isInOnChangeUpdate && nextIncomingValue !== lastState.value) {
        // 受控还原
        return {
          value: nextIncomingValue,
          isInOnChangeUpdate: false,
        }
      }
    } else if (nextIncomingValue !== lastState.pValue) {
      // 初次更新才设置 defaultValue
      return {
        pValue: nextIncomingValue,
        value: nextProps.defaultValue ?? '00:00'
      }
    }
    return null
  }

  onChange = (date: Date): void => {
    const { onChange = noop } = this.props
    const hh: string = ('0' + date.getHours()).slice(-2)
    const mm: string = ('0' + date.getMinutes()).slice(-2)
    const value = `${hh}:${mm}`
    this.setState({ value })
    onChange({ detail: { value } })
    this.setState({ isInOnChangeUpdate: true })
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
        value={formatTimeStr(value)}
        minDate={formatTimeStr(start)}
        maxDate={formatTimeStr(end)}
        onChange={this.onChange}
        onDismiss={this.onDismiss}
        disabled={disabled}
      >
        <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
      </AntDatePicker>
    )
  }
}

import AntPicker, { PickerColumnItem, PickerValue } from '@ant-design/react-native/lib/picker'
import * as React from 'react'

import { noop } from '../../utils'
import { TimeProps, TimeState } from './PropsType'

function getTimeData(start: string, end: string): PickerColumnItem[] {
  const [startHour, startMinute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)
  const hours: PickerColumnItem[] = []
  for (let hour = startHour; hour <= endHour; hour++) {
    const minutes: PickerColumnItem[] = []
    const minMinute = hour === startHour ? startMinute : 0
    const maxMinute = hour === endHour ? endMinute : 59
    for (let minute = minMinute; minute <= maxMinute; minute++) {
      minutes.push({ label: `${minute}分`, value: String(minute).padStart(2, '0') })
    }
    hours.push({ label: `${hour}时`, value: String(hour).padStart(2, '0'), children: minutes })
  }
  return hours
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

  onChange = (values: PickerValue[]): void => {
    const { onChange = noop } = this.props
    const value = values.join(':')
    this.setState({ value })
    onChange({ detail: { value } })
    this.setState({ isInOnChangeUpdate: true })
  }

  onDismiss = (): void => {
    const { onCancel = noop } = this.props
    onCancel()
  }

  render(): JSX.Element {
    const { children, start = '00:00', end = '23:59', disabled } = this.props
    const { value } = this.state

    return (
      <AntPicker
        cols={2}
        cascade
        data={getTimeData(start, end)}
        value={value.split(':')}
        onChange={this.onChange}
        onDismiss={this.onDismiss}
        disabled={disabled}
      >
        {children}
      </AntPicker>
    )
  }
}

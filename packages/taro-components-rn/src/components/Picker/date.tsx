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

function dateToString (date: Date, fields: 'day' | 'month' | 'year' = 'day'): string {
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
  return ret
}

export default class DateSelector extends React.Component<DateProps, DateState> {
  static defaultProps = {
    fields: 'day',
  }

  state: DateState = {
    pValue: '',
    value: '',
    isInOnChangeUpdate: false,
  }

  dismissByOk = false

  static getDerivedStateFromProps(nextProps: DateProps, lastState: DateState): Partial<DateState> | null {
    // eslint-disable-next-line eqeqeq
    const isControlled = nextProps.value != undefined
    if (isControlled) {
      if (nextProps.value !== lastState.pValue) {
        return {
          value: nextProps.value!,
          pValue: nextProps.value,
        }
      } else if (lastState.isInOnChangeUpdate && nextProps.value !== lastState.value) {
        return {
          value: nextProps.value!,
          isInOnChangeUpdate: false
        }
      }
    } else if (nextProps.value !== lastState.pValue) {
      return {
        value: nextProps.defaultValue ?? dateToString(new Date()),
        pValue: nextProps.value,
      }
    }
    return null
  }

  onChange = (date: Date): void => {
    const { fields = 'day', onChange = noop } = this.props
    const ret = dateToString(date, fields)
    this.setState({
      isInOnChangeUpdate: true,
      value: ret,
    })
    onChange({
      detail: {
        value: ret
      }
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
        value={formatTimeStr(value)}
        minDate={formatTimeStr(start)}
        maxDate={formatTimeStr(end)}
        onChange={this.onChange}
        onDismiss={this.onDismiss}
        disabled={disabled}
      >
        <TouchableWithoutFeedback><View>{children}</View></TouchableWithoutFeedback>
      </AntDatePicker>
    )
  }
}

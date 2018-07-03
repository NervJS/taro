/**
 * @todo reset date onCancel
 * @flow
 */

import * as React from 'react'
import {
  DatePickerIOS,
} from 'react-native'
import Dialog from './Dialog'

type Props = {
  mode: 'time' | 'date',
  value: string,
  start?: string,
  end?: string,
  disabled?: boolean,
  onChange?: Function,
  onCancel?: Function,
}
type State = {
  isShowDialog: boolean,
  date: ?Date,
}

class _PickerDateIOS extends React.Component<Props, State> {
  // eslint-disable-next-line no-useless-constructor
  constructor (props: Props) {
    super(props)
  }

  getDateValueFromProps = (mode: string, dateOrTime: ?string, isDefaultNow: ?boolean) => {
    if (!dateOrTime) return isDefaultNow ? new Date() : undefined
    if (mode === 'date') return new Date(dateOrTime)
    const now = new Date()
    return new Date(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${dateOrTime}`)
  }

  state: State = {
    isShowDialog: false,
    date: this.getDateValueFromProps(this.props.mode, this.props.value, true),
  }

  fillZero = (strOrNum: string | number) => {
    return `0${strOrNum}`.slice(-2)
  }

  toggleDialog = (isShow: boolean) => {
    this.setState({ isShowDialog: isShow })
  }

  onCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
    this.toggleDialog(false)
  }

  onConfirm = () => {
    const { mode, onChange } = this.props
    const { date } = this.state
    const value = mode === 'date'
      // $FlowFixMe date always be Date type
      ? `${date.getFullYear()}-${this.fillZero(date.getMonth() + 1)}-${this.fillZero(date.getDate())}`
      // $FlowFixMe date always be Date type
      : `${this.fillZero(date.getHours())}:${this.fillZero(date.getMinutes())}`
    onChange && onChange({ detail: { value } })
    this.toggleDialog(false)
  }

  onDateChange = (date: Date) => {
    this.setState({ date })
  }

  render () {
    const {
      mode,
      value,
      start,
      end,
      disabled,
      // onChange,
      // onCancel,
    } = this.props
    const {
      isShowDialog,
      date,
    } = this.state

    let minimumDate = this.getDateValueFromProps(mode, start)
    let maximumDate = this.getDateValueFromProps(mode, end)

    // Locked if disabled
    if (disabled) {
      minimumDate = maximumDate = this.getDateValueFromProps(mode, value)
    }

    return (
      <Dialog
        show={!!isShowDialog}
        onCancel={this.onCancel}
        onConfirm={this.onConfirm}
      >
        <DatePickerIOS
          mode={mode}
          date={date}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onDateChange={this.onDateChange}
          style={{ flex: 1 }}
        />
      </Dialog>
    )
  }
}

export default _PickerDateIOS

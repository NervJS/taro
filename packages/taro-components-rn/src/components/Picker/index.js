/**
 * All:
 *   ✔ value
 *   ✔ onChange(bindchange)
 *   ✔ onCancel(bindcancel)
 * Selector:
 *   ✔ range
 *   ✔ rangeKey(rangeKey)
 *   ✔ disabled
 * MultiSelector:
 *   ✔ range
 *   ✔ rangeKey(rangeKey)
 *   ✔ disabled
 *   ✔ onColumnChange(bindcolumnchange)
 * Time:
 *   ✔ start: IOS
 *   ✔ end: IOS
 *   ✔ disabled: IOS
 * Date:
 *   ✔ start
 *   ✔ end
 *   ✘ fields
 *   ✔ disabled
 * Region:
 *   ✔ customItem(custom-item)
 *   ✔ disabled
 *
 * @warn Unstable
 * @warn Without testing
 * @warn Do not use it until...
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  DatePickerAndroid,
  TimePickerAndroid,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import PickerSelector from './Selector'
import PickerMultiSelector from './MultiSelector'
import PickerDate from './DateIOS'
import PickerRegion from './Region'
// import { omit } from '../../utils'

type Props = {
  children?: React.Element<any>,
  mode: 'selector' | 'multiSelector' | 'time' | 'date' | 'region',
  disabled?: boolean,
  value?: any,
  start?: string,
  end?: string,
  onChange?: Function,
  onCancel?: Function,
}
type State = {
  shownValue: string,
}

class _Picker extends React.Component<Props, State> {
  props: Props
  state: State = {
    shownValue: ''
  }
  picker: any

  static defaultProps = {
    mode: 'selector',
  }

  onBarClick = () => {
    this.picker.toggleDialog(true)
  }

  openDatePickerAndroid = () => {
    const {
      mode,
      disabled,
      value,
      start,
      end,
      onChange,
      onCancel,
    } = this.props

    const DateOrTimeAndroid = mode === 'date' ? DatePickerAndroid : TimePickerAndroid
    const openParams: Object = { mode: 'spinner' }

    if (mode === 'date') {
      let minDate = start && new Date(start)
      let maxDate = end && new Date(end)
      if (disabled) {
        minDate = maxDate = value && new Date(value)
      }
      Object.assign(openParams, {
        date: value && new Date(value),
        minDate,
        maxDate,
      })
    } else {
      const tmp = value ? value.split(':') : []
      const valueHour = tmp[0]
      const valueMinute = tmp[1]
      Object.assign(openParams, {
        hour: valueHour,
        minute: valueMinute,
        is24Hour: false
      })
    }

    // const { action, year, month, day, hour, minute } = await DateOrTimeAndroid.open(openParams)

    DateOrTimeAndroid.open(openParams)
      .then(({ action, year, month, day, hour, minute }) => {
        if (action === DateOrTimeAndroid.dismissedAction) {
          onCancel && onCancel()
        } else {
          const confirmValue = mode === 'date'
            ? `${year}-${('0' + (month + 1)).slice(-2)}-${('0' + day).slice(-2)}`
            : `${hour}:${minute}`
          onChange && onChange({ detail: { value: confirmValue } })
        }
      })
  }

  getShowValueElement = (onPress: Function) => {
    const { children } = this.props
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View>{children}</View>
      </TouchableWithoutFeedback>
    )
  }

  render () {
    const {
      mode,
    } = this.props

    if ((mode === 'date' || mode === 'time') && Platform.OS === 'ios') {
      return (
        <View>
          {this.getShowValueElement(this.onBarClick)}
          {/* $FlowFixMe mode=selector|multiSelector|region would emit error */}
          <PickerDate
            {...this.props}
            ref={(picker) => { this.picker = picker }}
          />
        </View>
      )
    }

    if ((mode === 'date' || mode === 'time') && Platform.OS === 'android') {
      return (
        <View>
          {this.getShowValueElement(this.openDatePickerAndroid)}
        </View>
      )
    }

    const MySelector = mode === 'region'
      ? PickerRegion
      : (mode === 'multiSelector' ? PickerMultiSelector : PickerSelector)

    return (
      <View>
        {this.getShowValueElement(this.onBarClick)}
        <MySelector
          {...this.props}
          ref={(picker) => { this.picker = picker }}
        />
      </View>
    )
  }
}

export default _Picker

/**
 * All:
 *   ✔ value
 *   ✔ onChange(bindchange)
 *   ✔ onCancel(bindcancel)
 * Selector:
 *   ✔ range
 *   ✔ rangeKey(range-key)
 *   ✔ disabled
 * MultiSelector:
 *   ✔ range
 *   ✔ rangeKey(range-key)
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
  Text,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'
import PickerSelector from './Selector'
import PickerMultiSelector from './MultiSelector'
import PickerDate from './DateIOS'
import PickerRegion from './Region'

type Props = {
  children?: React.Element<any>,
  style?: StyleSheet.Styles,
  mode: 'selector' | 'multiSelector' | 'time' | 'date' | 'region'
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
    const openParams = { mode: 'spinner' }

    if (mode === 'date') {
      let minDate = new Date(start)
      let maxDate = new Date(end)
      if (disabled) {
        minDate = maxDate = new Date(value)
      }
      Object.assign(openParams, {
        date: new Date(value),
        minDate,
        maxDate,
      })
    } else {
      const tmp = value.split(':')
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
      style,
      mode,
    } = this.props

    if (mode === 'date' || mode === 'time' && Platform.OS === 'ios') {
      return (
        <View>
          {this.getShowValueElement(this.onBarClick)}
          <PickerDate
            {...this.props}
            ref={(picker) => { this.picker = picker }}
          />
        </View>
      )
    }

    if (mode === 'date' || mode === 'time' && Platform.OS === 'android') {
      return (
        <View>
          {this.getShowValueElement(this.openDatePickerAndroid)}
        </View>
      )
    }

    if (mode === 'region') {
      return (
        <View>
          {this.getShowValueElement(this.onBarClick)}
          <PickerRegion
            {...this.props}
            ref={(picker) => { this.picker = picker }}
          />
        </View>
      )
    }

    const MySelector = mode === 'multiSelector' ? PickerMultiSelector : PickerSelector

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

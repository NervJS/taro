import AntPickerView from '@ant-design/react-native/lib/picker-view'
import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import { View } from 'react-native'

import PickerView from '../components/PickerView'
import PickerViewColumn from '../components/PickerViewColumn'

describe('PickerView', () => {
  it('PickerView render', () => {
    const years: number[] = []
    const months: number[] = []
    const days: number[] = []
    for (let i = 2010; i <= 2020; i++) {
      years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }
    for (let i = 1; i <= 30; i++) {
      days.push(i)
    }
    const component = render(
      <PickerView indicatorStyle='height: 50px;' style='width: 100%; height: 300px;'>
        <PickerViewColumn>
          {years.map(item => {
            return (
              <View key={item}>{item}年</View>
            )
          })}
        </PickerViewColumn>
        <PickerViewColumn>
          {months.map(item => {
            return (
              <View key={item}>{item}月</View>
            )
          })}
        </PickerViewColumn>
        <PickerViewColumn>
          {days.map(item => {
            return (
              <View key={item}>{item}日</View>
            )
          })}
        </PickerViewColumn>
      </PickerView>
    )
    const picker = component.UNSAFE_getByType(AntPickerView)
    expect(picker.props.data.map(column => column.length)).toEqual([11, 12, 30])
    expect(picker.props.data[0][0]).toEqual({ label: '2010年', value: 0 })
    expect(picker.props.data[2][29]).toEqual({ label: '30日', value: 29 })
    expect(picker.props.cascade).toBe(false)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    // The new wheel waits for native item and container measurements before rendering its columns.
    const measure = height => fireEvent(
      component.UNSAFE_getAllByType(View).find(view => view.props.onLayout)!,
      'layout',
      { nativeEvent: { layout: { height, width: 300, x: 0, y: 0 } } }
    )
    measure(40)
    measure(280)
    expect(component.getByText('2010年')).toBeTruthy()
    expect(component.getByText('1月')).toBeTruthy()
    expect(component.getByText('1日')).toBeTruthy()
  })
})

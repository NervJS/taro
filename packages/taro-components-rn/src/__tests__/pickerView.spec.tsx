import * as React from 'react'
import { View } from 'react-native'
import { render } from '@testing-library/react-native'
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
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

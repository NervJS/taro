// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { View } from 'react-native'
import renderer from 'react-test-renderer'
import PickerView from '../src/components/PickerView'
import PickerViewColumn from '../src/components/PickerViewColumn'

describe('PickerView', () => {
  it('PickerView render', () => {
    const date = new Date()
    const years: number[] = []
    const months: number[] = []
    const days: number[] = []
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    const component = renderer.create(
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

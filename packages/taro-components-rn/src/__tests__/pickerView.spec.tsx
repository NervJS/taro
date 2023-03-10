/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

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

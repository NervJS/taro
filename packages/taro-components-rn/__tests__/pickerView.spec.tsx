/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { View } from 'react-native'
import renderer from 'react-test-renderer'
import PickerView from '../src/components/PickerView'
import PickerViewColumn from '../src/components/PickerViewColumn'

describe('PickerView', () => {
  it('PickerView render', () => {
    const years: number[] = []
    const months: number[] = []
    const days: number[] = []
    for (let i = 1990; i <= 2020; i++) {
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

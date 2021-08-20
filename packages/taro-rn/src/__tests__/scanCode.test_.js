/*
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

// eslint-disable-next-line
import React from 'react'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import { scanCode, scannerView as ScannerView } from '../lib/scanCode'

describe('scanCode', () => {
  it('should render scanCode success', async () => {
    await scanCode()
    const wrapper = mount(<ScannerView />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
  // it('should render scanCode emit event success', async() => {
  //   const success = jest.fn()
  //   const fail = jest.fn()
  //   const complete = jest.fn()
  //   const ScannerView = await scanCode()
  //   const wrapper = mount(<ScannerView
  //     style={{ color: 'red' }}
  //     onShow={onShow}
  //     onClose={onClose}
  //   ><Text>Test</Text></ScannerView>)
  // })
})

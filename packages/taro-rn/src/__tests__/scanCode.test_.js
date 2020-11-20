// eslint-disable-next-line
import React from 'react'
import { Text } from 'react-native'
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

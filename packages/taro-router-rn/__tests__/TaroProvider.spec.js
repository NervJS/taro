import React from 'react'
import { View } from 'react-native'
import TaroProvider from '../src/TaroProvider'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import RefreshProvider from '../src/RefreshProvider'

class HomeScreen extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <View>Test</View>
  }
}

describe('TaroProvider', function () {
  let Taro = {}
  it('should render success', function () {
    const wrapper = shallow(<TaroProvider Taro={Taro}><HomeScreen /></TaroProvider>)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  /**
   * Taro.navigateTo
   * Taro.redirectTo
   * Taro.navigateBack
   * Taro.switchTab
   * Taro.getCurrentPages
   * Taro.startPullDownRefresh
   * Taro.stopPullDownRefresh
   */
  describe('Taro API', function () {
    it('should Taro API mount success', function () {
      shallow(<TaroProvider Taro={Taro}><HomeScreen /></TaroProvider>)
      const expected = ['navigateTo', 'redirectTo', 'navigateBack', 'switchTab', 'getCurrentPages', 'startPullDownRefresh', 'stopPullDownRefresh']
      expect(Object.keys(Taro)).toEqual(expected)
    })

    it('should call navigateTo success', function () {
      const mockCallback = jest.fn()
      const wrapper = shallow(<TaroProvider Taro={Taro}><HomeScreen /></TaroProvider>)
      wrapper.setProps({navigation: {push: mockCallback}})
      Taro.navigateTo({url: '/pages/index'})
      expect(mockCallback.mock.calls.length).toBe(1)
    })

    it('should call redirectTo success', function () {
      const mockCallback = jest.fn()
      const wrapper = shallow(<TaroProvider Taro={Taro}><HomeScreen /></TaroProvider>)
      wrapper.setProps({navigation: {replace: mockCallback}})
      Taro.redirectTo({url: '/pages/index'})
      expect(mockCallback.mock.calls.length).toBe(1)
    })

    it('should call navigateBack success', function () {
      const mockCallback = jest.fn()
      const wrapper = shallow(<TaroProvider Taro={Taro}><HomeScreen /></TaroProvider>)
      wrapper.setProps({navigation: {goBack: mockCallback}})
      Taro.navigateBack({url: '/pages/index'})
      expect(mockCallback.mock.calls.length).toBe(1)
    })

    it('should call switchTab success', function () {
      const mockCallback = jest.fn()
      const wrapper = shallow(<TaroProvider Taro={Taro}><HomeScreen /></TaroProvider>)
      wrapper.setProps({navigation: {navigate: mockCallback}})
      Taro.switchTab({url: '/pages/index'})
      expect(mockCallback.mock.calls.length).toBe(1)
    })

    it('should call getCurrentPages success', function () {
      const mockCallback = jest.fn().mockReturnValue({state: {}})
      const wrapper = shallow(<TaroProvider Taro={Taro}><HomeScreen /></TaroProvider>)
      wrapper.setProps({navigation: {dangerouslyGetParent: mockCallback}})
      Taro.getCurrentPages({url: '/pages/index'})
      expect(mockCallback.mock.calls.length).toBe(1)
    })

    it('should has refreshProviderRef', function () {
      const wrapper = mount(<TaroProvider Taro={Taro}><HomeScreen /></TaroProvider>)
      expect(wrapper.instance().refreshProviderRef.current).toBeInstanceOf(RefreshProvider)
    })
  })
})

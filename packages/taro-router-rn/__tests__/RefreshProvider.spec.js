import { shallow } from 'enzyme/build/index'
import toJson from 'enzyme-to-json'
import React from 'react'
import RefreshProvider from '../src/RefreshProvider'

class HomeScreen extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <View>Test</View>
  }
}

describe('RefreshProvider', function () {
  let Taro = {}
  it('should render success', function () {
    const wrapper = shallow(<RefreshProvider Taro={Taro}><HomeScreen /></RefreshProvider>)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should call onScroll success', function () {
    const mockCallback = jest.fn()
    const wrapper = shallow(<RefreshProvider Taro={Taro}><HomeScreen /></RefreshProvider>)
    wrapper.setProps({onScroll: mockCallback})
    wrapper.instance().onScroll({nativeEvent: {contentOffset: {}}})
    expect(mockCallback.mock.calls.length).toBe(1)
  })

  it('should call handleReachBottom success', function () {
    const mockCallback = jest.fn()
    const wrapper = shallow(<RefreshProvider Taro={Taro}><HomeScreen /></RefreshProvider>)
    wrapper.setProps({onReachBottom: mockCallback})
    wrapper.instance().handleReachBottom()
    expect(mockCallback.mock.calls.length).toBe(1)
  })

  it('should call handlePullDownRefresh success', function (done) {
    const mockCallback = jest.fn()
    const wrapper = shallow(<RefreshProvider Taro={Taro}><HomeScreen /></RefreshProvider>)
    wrapper.setProps({onPullDownRefresh: mockCallback})

    function callback (data) {
      expect(wrapper.state().refreshing).toBe(true)
      done()
    }

    wrapper.instance().handlePullDownRefresh(callback)
    expect(mockCallback.mock.calls.length).toBe(1)
  })

  it('should call stopPullDownRefresh success', function (done) {
    const wrapper = shallow(<RefreshProvider Taro={Taro}><HomeScreen /></RefreshProvider>)

    function callback (data) {
      expect(wrapper.state().refreshing).toBe(false)
      done()
    }

    wrapper.setState({refreshing: true})
    wrapper.instance().stopPullDownRefresh(callback)
  })
})

import React from 'react'
import { connect } from '../src/index'
import { createStore } from 'redux'
import { shallow, mount } from 'enzyme'

class App1 extends React.Component {
  static config = {
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  render () {
    return (
      <div>Test</div>
    )
  }
}

class App2 extends React.Component {
  render () {
    return (
      <div>Test</div>
    )
  }
}

describe('connect Testing', () => {
  it('getWrappedInstance App1', () => {
    const WrappedConnect = connect()(App1)
    const wrapper = mount(<WrappedConnect store={createStore(() => ({hi: 'there'}))}/>)
    expect(wrapper.instance().getWrappedInstance()).toBeInstanceOf(App1)
  })

  it('with config', () => {
    const WrappedConnect = connect()(App1)
    const wrapper = shallow(<WrappedConnect/>)
    expect(WrappedConnect.config).toEqual(App1.config)
    expect(wrapper.text()).toEqual('<Connect(App1) />')
  })

  it('without config', () => {
    const WrappedConnect = connect()(App2)
    expect(WrappedConnect.config).toEqual({})
  })
})

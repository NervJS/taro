import * as React from 'react'
import { View, Text, Animated, Image, TouchableOpacity } from 'react-native'
import { shallow } from 'enzyme'
import * as sinon from 'sinon'
import { Button } from '../src'

describe('<Button />', () => {
  it('render default', () => {
    const wrapper = shallow(<Button>BUTTON</Button>)
    expect(wrapper.find(Text)).toHaveProperty('length', 1)
  })

  it('loading view', () => {
    const wrapper = shallow(<Button loading />)
    expect(wrapper.find(Animated.View)).toHaveProperty('length', 1)
  })

  it('simulates trigger loading', () => {
    const wrapper = shallow(<Button />)
    // @ts-ignore
    const spy = sinon.spy(wrapper.instance(), 'animate')
    expect(spy.calledOnce).toBe(false)
    wrapper.setProps({ loading: true })
    expect(spy.calledOnce).toBe(true)
    wrapper.setProps({ loading: false })
    expect(spy.calledOnce).toBe(true)
  })

  // it('type warn of loading', () => {
  //   const wrapper = shallow(<Button type="warn" loading />)
  //   const opaqueTypeRes = wrapper.find(Image).at(0).prop('source')
  //   expect(opaqueTypeRes).toBe(1)
  //   expect(Image.resolveAssetSource(opaqueTypeRes).uri).toMatch(/file:\/\//)
  // })

  it('disabled button', () => {
    const wrapper = shallow(<Button disabled />)
    expect(wrapper.find(TouchableOpacity).at(0).props()).toHaveProperty('activeOpacity', 1)
  })

  it('mini size', () => {
    const wrapper = shallow(<Button size="mini" />)
    expect(wrapper.find(View).get(0).props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          height: 30
        })
      ])
    )
  })

  it('plain button', () => {
    const wrapper = shallow(<Button plain />)
    expect(wrapper.find(View).get(0).props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: 'transparent'
        })
      ])
    )
  })

  it('plain and disabled button', () => {
    const wrapper = shallow(<Button disabled plain>BUTTON</Button>)
    expect(wrapper.find(Text).get(0).props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: 'rgba(53,53,53,0.6)'
        })
      ])
    )
  })

  it('type primary and disabled', () => {
    const wrapper = shallow(<Button type="primary" disabled>BUTTON</Button>)
    expect(wrapper.find(Text).get(0).props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: 'rgba(255,255,255,0.6)'
        })
      ])
    )
  })

  it('onClick', () => {
    const spy = sinon.spy()
    const wrapper = shallow(<Button onClick={spy} />)
    // @ts-ignore
    wrapper.find(TouchableOpacity).at(0).props().onPress()
    expect(spy.calledOnce).toBe(true)
  })
})

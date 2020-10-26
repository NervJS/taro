import * as React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { shallow } from 'enzyme'
import * as sinon from 'sinon'
import { Label, Checkbox, CheckboxGroup } from '../src'
import * as renderer from 'react-test-renderer'

describe('<Checkbox />', () => {
  describe('<Checkbox />', () => {
    it('default', () => {
      const tree = renderer.create(<Checkbox />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    describe('prop checked changed', () => {
      it('should be checked', () => {
        const wrapper = shallow(
          <Checkbox checked={false} />
        )
        expect(wrapper.state('checked')).toBe(false)
        wrapper.setProps({ checked: true })
        expect(wrapper.state('checked')).toBe(true)
      })
    })

    describe('onPress', () => {
      it('normal', () => {
        const onChange = sinon.spy()
        const wrapper = shallow(
          <Checkbox onChange={onChange} />
        )
        // @ts-ignore
        wrapper.find(TouchableWithoutFeedback).at(0).props().onPress()
        expect(onChange.calledOnce).toBe(true)
        expect(wrapper.state('checked')).toBe(true)
      })

      it('disabled', () => {
        const onChange = sinon.spy()
        const wrapper = shallow(
          <Checkbox onChange={onChange} disabled={true} />
        )
        // @ts-ignore
        wrapper.find(TouchableWithoutFeedback).at(0).props().onPress()
        expect(onChange.calledOnce).toBe(false)
        expect(wrapper.state('checked')).toBe(false)
      })
    })
  })

  describe('<CheckboxGroup />', () => {
    it('should render well', () => {
      const spy = sinon.spy()
      const wrapper = shallow(
        <CheckboxGroup onChange={spy} style={{ flexDirection: 'row' }}>
          <View><View /></View>
          <Label><Checkbox value={0} /></Label>
          <Label><Checkbox value={1} /></Label>
          <Label><Checkbox value={2} /></Label>
        </CheckboxGroup>
      )
      wrapper.find(Checkbox).at(0).props().onChange!({ checked: true, value: 0 })
      expect(spy.calledOnce).toBe(true)
      wrapper.find(Checkbox).at(0).props().onChange!({ checked: false, value: 0 })
      expect(spy.calledTwice).toBe(true)
      wrapper.find(Checkbox).at(1).props().onChange!({ checked: true, value: 1 })
      wrapper.find(Checkbox).at(2).props().onChange!({ checked: true, value: 2 })
      expect(spy.callCount).toBe(4)
    })
  })
})

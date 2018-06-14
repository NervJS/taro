import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { Checkbox, CheckboxGroup } from '../src'
import renderer from 'react-test-renderer'

describe('<Checkbox />', () => {
  describe('<Checkbox />', () => {
    it('default', () => {
      const tree = renderer.create(<Checkbox />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    describe('onPress', () => {
      it('normal', () => {
        const onChange = sinon.spy()
        const wrapper = shallow(
          <Checkbox onChange={onChange} />
        )
        wrapper.find(TouchableWithoutFeedback).at(0).props().onPress()
        expect(onChange.calledOnce).toBe(true)
        expect(wrapper.state('checked')).toBe(true)
      })

      it('disabled', () => {
        const onChange = sinon.spy()
        const wrapper = shallow(
          <Checkbox onChange={onChange} disabled={true} />
        )
        wrapper.find(TouchableWithoutFeedback).at(0).props().onPress()
        expect(onChange.calledOnce).toBe(false)
        expect(wrapper.state('checked')).toBe(false)
      })
    })
  })

  describe('<CheckboxGroup />', () => {

  })
})

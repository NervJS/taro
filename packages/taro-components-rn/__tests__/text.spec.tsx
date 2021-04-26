// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { Text as ReactNativeText } from 'react-native'
import { shallow } from 'enzyme'
import * as sinon from 'sinon'
import Text from '../src/components/Text'

describe('<Text />', () => {
  it('simple structure check', () => {
    const wrapper = shallow(<Text>Miao miao miao~</Text>)
    expect(wrapper.childAt(0).text()).toContain('Miao miao miao~')
  })

  it('onClick', () => {
    const spy = sinon.spy()
    const wrapper = shallow(<Text onClick={spy}>Test Text</Text>)
    // eslint-disable-next-line
    // @ts-ignore
    wrapper.find(ReactNativeText).props().onPress()
    expect(spy.calledOnce).toBe(true)
  })
})

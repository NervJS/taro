import * as React from 'react'
import { Text as ReactNativeText } from 'react-native'
import { shallow } from 'enzyme'
import * as sinon from 'sinon'
import Text from '../src/components/text'
// import * as renderer from 'react-test-renderer'

describe('<Text />', () => {
  // it('renders correctly', () => {
  //   const tree = renderer
  //     .create(
  //       <Text>Alo, alo, holy high!</Text>
  //     )
  //     .toJSON()
  //   expect(tree).toMatchSnapshot()
  // })

  it('simple structure check', () => {
    const wrapper = shallow(<Text>Miao miao miao~</Text>)
    expect(wrapper.childAt(0).text()).toContain('Miao miao miao~')
  })

  it('onClick', () => {
    const spy = sinon.spy()
    const wrapper = shallow(<Text onClick={spy}>Test Text</Text>)
    // @ts-ignore
    wrapper.find(ReactNativeText).props().onPress()
    expect(spy.calledOnce).toBe(true)
  })
})

import React from 'react'
import { View } from 'react-native'
import { shallow } from 'enzyme'
import { Icon } from '../src'
import renderer from 'react-test-renderer'

describe('<Icon />', () => {
  const TestedIcon = (
    <Icon
      type='success'
      size={50}
      color='green'
    />
  )

  // it('renders correctly', () => {
  //   const tree = renderer.create(TestedIcon).toJSON()
  //   expect(tree).toMatchSnapshot()
  // })

  it('simple structure check', () => {
    const wrapper = shallow(TestedIcon)
    const foundView = wrapper.find(View)
    const firstViewNode = foundView.get(0)
    expect(foundView).toHaveProperty('length', 2)
    expect(firstViewNode).toHaveProperty(['props', 'style', 1, 'width'], 50)
    expect(firstViewNode).toHaveProperty(['props', 'style', 1, 'height'], 50)
  })

  it('invalid prop value check', () => {
    const wrapperOfType = shallow(<Icon type='miao' />)
    expect(wrapperOfType.find(View)).toHaveProperty('length', 1)
    // expect(() => shallow(<Icon type='success' size={'miao'} />)).toThrow()
  })
})

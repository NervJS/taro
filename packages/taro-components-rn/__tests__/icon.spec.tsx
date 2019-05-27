import * as React from 'react'
import { ART, View, Image, Platform } from 'react-native'
import { shallow } from 'enzyme'
// import { Icon } from '../src'
// import renderer from 'react-test-renderer'

// it('renders correctly', () => {
//   const tree = renderer.create(TestedIcon).toJSON()
//   expect(tree).toMatchSnapshot()
// })

describe('<Icon />', () => {
  describe('ios & android', () => {
    // jest.resetModules().doMock('../src/components/Icon', () => {
    //   return require.requireActual(`../src/components/Icon.${Platform.OS}.js`)
    // })
    // Platform.OS = 'ios'
    const { Icon } = require('../src')

    const TestedIcon = (<Icon type='success' size={50} />)

    it('simple structure check', () => {
      const wrapper = shallow(TestedIcon)
      const foundView = wrapper.find(View)
      const firstViewNode = foundView.get(0)
      expect(foundView).toHaveProperty('length', 1)
      expect(firstViewNode).toHaveProperty(['props', 'style', 1, 'width'], 50)
      expect(firstViewNode).toHaveProperty(['props', 'style', 1, 'height'], 50)
    })

    it('specific color', () => {
      const wrapper = shallow(<Icon type="success" color="red" />)
      expect(wrapper.find(Image).get(0)).toHaveProperty(['props', 'style', 'tintColor'], 'red')
    })

    it('invalid prop value check', () => {
      const wrapperOfType = shallow(<Icon type='miao' />)
      expect(wrapperOfType.find(View)).toHaveProperty('length', 1)
      // expect(() => shallow(<Icon type='success' size={'miao'} />)).toThrow()
    })
  })
})

import React from 'react'
import { ART, View, Image, Platform } from 'react-native'
import { shallow } from 'enzyme'
// import { Icon } from '../src'
// import renderer from 'react-test-renderer'

// it('renders correctly', () => {
//   const tree = renderer.create(TestedIcon).toJSON()
//   expect(tree).toMatchSnapshot()
// })

describe('<Icon />', () => {
  describe('ios', () => {
    jest.resetModules().doMock('../src/components/Icon/icon', () => {
      return require.requireActual(`../src/components/Icon/icon.${Platform.OS}.js`)
    })
    // const mockfn = function () {
    //   const original = require.requireActual('react-native')
    //   return {
    //      // Pass down all the exported objects
    //     ...original,
    //     ART: undefined
    //   }
    // }
    // jest.doMock('react-native', () => mockfn())

    Platform.OS = 'ios'
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

  describe('android', () => {
    jest.resetModules().doMock('../src/components/Icon/icon', () => {
      return require.requireActual(`../src/components/Icon/icon.${Platform.OS}.js`)
    })
    Platform.OS = 'android'
    const { Icon } = require('../src')

    const TestedIcon = (<Icon type='success' size={50} />)

    it('simple structure check', () => {
      const wrapper = shallow(TestedIcon)
      const foundView = wrapper.find(View)
      const firstViewNode = foundView.get(0)
      expect(foundView).toHaveProperty('length', 2)
      expect(firstViewNode).toHaveProperty(['props', 'style', 1, 'width'], 50)
      expect(firstViewNode).toHaveProperty(['props', 'style', 1, 'height'], 50)
    })

    it('specific color', () => {
      const wrapper = shallow(<Icon type="success" color="red" />)
      // @tip: Must be ART.Shape rather than Shape
      expect(wrapper.find(ART.Shape).at(0).props().fill).toEqual('red')
    })

    it('invalid prop value check', () => {
      const wrapperOfType = shallow(<Icon type='miao' />)
      expect(wrapperOfType.find(View)).toHaveProperty('length', 1)
      // expect(() => shallow(<Icon type='success' size={'miao'} />)).toThrow()
    })
  })
})

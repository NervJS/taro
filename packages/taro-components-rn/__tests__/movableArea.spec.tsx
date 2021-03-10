// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { shallow } from 'enzyme'
import MovableArea from '../src/components/MovableArea'

describe('MovableArea', () => {
  it('MovableArea default props', () => {
    const wrapper = shallow(<MovableArea
      animation
      direction='all'
      onDragStart={jest.fn}
      onDragEnd={jest.fn}
      onMove={jest.fn}
    >content</MovableArea>)
    const view = wrapper.at(0)
    expect(view.props().style).toEqual([{ height: 100, overflow: 'hidden', width: 100 }, undefined])
  })

  it('MovableArea emit layout', () => {
    const wrapper = shallow(<MovableArea
      animation
      direction='all'
      onDragStart={jest.fn}
      onDragEnd={jest.fn}
      onMove={jest.fn}
    >content</MovableArea>)
    const view = wrapper.at(0)
    const event = {
      nativeEvent: {
        layout: {
          width: 200,
          height: 200,
        }
      }
    }
    view.simulate('layout', event)
    expect(wrapper.childAt(0).props().layout).toEqual({ width: 200, height: 200 })
    // expect(wrapper.childAt(0).text()).toContain('move me')
  })
})

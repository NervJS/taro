import Nerv from 'nervjs'
import { renderIntoDocument, Simulate } from 'nerv-test-utils'
import View from '../index'

describe('View', () => {
  it('render View', () => {
    const view = <View>hello taro</View>
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('hello taro')
  })

  it('touchStart View', () => {
    const onTouchStart = jest.fn()
    const view = <View hoverClass='test' onTouchStart={onTouchStart}> hover View</View>
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    Simulate.touchStart(dom)

    expect(onTouchStart).toHaveBeenCalled()
  })

  it('touchEnd View', () => {
    const onTouchEnd = jest.fn()
    const view = <View hoverClass='test' onTouchEnd={onTouchEnd}> hover View</View>
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    Simulate.touchEnd(dom)

    expect(onTouchEnd).toHaveBeenCalled()
  })
})

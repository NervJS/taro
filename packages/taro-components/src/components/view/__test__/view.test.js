import Nerv from 'nervjs'
import { renderIntoDocument, Simulate } from 'nerv-test-utils'
import View from '../index'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const hoverStartTime = 50
const hoverStayTime = 400
describe('View', () => {
  it('render View', () => {
    const view = <View>hello taro</View>
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('hello taro')
  })

  it('should set hoverClass after touchStart and remove it after touchEnd', async () => {
    const hoverClass = 'hoverclass'
    const onTouchStart = jest.fn()
    const onTouchEnd = jest.fn()
    let viewIns
    const view = <View className='class' ref={c => (viewIns = c)} hoverClass={hoverClass} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}> hover View</View>
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    Simulate.touchStart(dom)
    expect(onTouchStart).toHaveBeenCalled()

    Simulate.touchEnd(dom)
    await delay(hoverStartTime)
    expect(dom.getAttribute('class')).not.toContain(hoverClass)

    Simulate.touchStart(dom)
    await delay(hoverStartTime)
    expect(viewIns.state.touch).toBeTruthy()
    expect(dom.getAttribute('class')).toContain(hoverClass)

    Simulate.touchEnd(dom)
    expect(onTouchEnd).toHaveBeenCalled()

    Simulate.touchStart(dom)
    await delay(hoverStayTime)
    expect(dom.getAttribute('class')).toContain(hoverClass)

    Simulate.touchEnd(dom)
    await delay(hoverStayTime)
    expect(dom.getAttribute('class')).not.toContain(hoverClass)
  })

  it('should not execute set hoverClass when hoverClass is undefined', async () => {
    let viewIns
    const view = <View className='class' ref={c => (viewIns = c)}> hover View</View>
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    Simulate.touchStart(dom)
    expect(viewIns.state.touch).toBeFalsy()
    await delay(hoverStartTime)
    expect(viewIns.state.hover).toBeFalsy()

    Simulate.touchEnd(dom)
    await delay(hoverStayTime)
    expect(viewIns.state.hover).toBeFalsy()
  })
})

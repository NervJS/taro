import Nerv from 'nervjs'
import { renderIntoDocument, Simulate } from 'nerv-test-utils'
import Button from '../index'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const hoverStartTime = 20
const hoverStayTime = 70

describe('Button', () => {
  it('render Button', () => {
    const component = renderIntoDocument(<Button>Button</Button>)
    expect(component.props.disabled).toBeFalsy()
  })

  it('render Button disabled', () => {
    const component = renderIntoDocument(<Button disabled>Button</Button>)
    expect(component.props.disabled).toBeTruthy()
  })

  it('show loading Botton', () => {
    const component = renderIntoDocument(<Button loading>Button</Button>)
    expect(component.props.loading).toBeTruthy()
  })

  it('should trigger touchStart and  touchEnd', async () => {
    const hoverClass = 'hoverclass'
    const onTouchStart = jest.fn()
    const onTouchEnd = jest.fn()
    let btnIns
    const view = <Button ref={c => (btnIns = c)} hoverClass={hoverClass} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}> Button</Button>
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)

    Simulate.touchStart(dom)
    expect(onTouchStart).toHaveBeenCalled()

    Simulate.touchEnd(dom)
    await delay(hoverStartTime)
    expect(dom.getAttribute('class')).not.toContain(hoverClass)

    Simulate.touchStart(dom)
    await delay(hoverStartTime)
    expect(btnIns.state.touch).toBeTruthy()
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
    let btnIns
    const view = <Button className='class' ref={c => (btnIns = c)}>Button</Button>
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    Simulate.touchStart(dom)
    expect(btnIns.state.touch).toBeFalsy()
    await delay(hoverStartTime)
    expect(btnIns.state.hover).toBeTruthy()

    Simulate.touchEnd(dom)
    await delay(hoverStayTime)
    expect(btnIns.state.hover).toBeFalsy()
  })
})

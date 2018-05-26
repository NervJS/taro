import Nerv from 'nervjs'
import { renderIntoDocument, scryRenderedDOMComponentsWithClass } from 'nerv-test-utils'
import Button from '../index'

describe('Button', () => {
  it('render Button', () => {
    const component = renderIntoDocument(<Button>Button</Button>)
    const scryResults = scryRenderedDOMComponentsWithClass(component, 'weui-btn weui-btn_default')
    console.log(scryResults)
    expect(scryResults.length).toBe(1)
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('Button')
  })
})

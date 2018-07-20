import Nerv from 'nervjs'
import { renderIntoDocument, scryRenderedDOMComponentsWithClass } from 'nerv-test-utils'
import Icon from '../index'

describe('Icon', () => {
  it('render Icon', () => {
    const component = renderIntoDocument(<Icon type='success'>Icon</Icon>)
    const scryResults = scryRenderedDOMComponentsWithClass(component, 'weui-icon-success')
    expect(scryResults.length).toBe(1)
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('Icon')
  })
  it('not type', () => {
    const component = renderIntoDocument(<Icon>Icon</Icon>)
    const scryResults = scryRenderedDOMComponentsWithClass(component, 'weui-icon-success')
    expect(scryResults.length).toBe(0)
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('Icon')
  })
})

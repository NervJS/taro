import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import ScrollView from '../index'

describe('Scroll-view', () => {
  it('render Scroll-view', () => {
    const view = <ScrollView>ScrollView</ScrollView>
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('ScrollView')
  })

  it('render Scroll-view props correct', () => {
    const view = <ScrollView scrollX>ScrollView</ScrollView>
    const component = renderIntoDocument(view)
    expect(component.props['scrollX']).toBeTruthy()
  })
})

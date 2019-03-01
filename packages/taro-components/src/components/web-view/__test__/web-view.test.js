import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import WebView from '../index'

describe('WebView', () => {
  it('render WebView', () => {
    const onLoadSpy = jest.fn()
    const view = <WebView src='https://www.baidu.com' />
    const component = renderIntoDocument(view)

    const loadEvent = document.createEvent('Event')
    loadEvent.initEvent('load', false, false)
    // const dom = Nerv.findDOMNode(component)
    // expect(dom.textContent).toEqual('hello taro')
    component.getDOMNode().dispatchEvent(loadEvent)
    expect(onLoadSpy).toHaveBeenCalled()
  })
})

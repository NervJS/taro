import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import View from '../index'

describe('View', () => {
  it('render View', () => {
    const view = <View>hello taro</View>
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('hello taro')
  })
})

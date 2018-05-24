import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Label from '../index'

describe('Label', () => {
  it('render Label', () => {
    const label = <Label>hello taro</Label>
    const component = renderIntoDocument(label)
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('hello taro')
  })
})

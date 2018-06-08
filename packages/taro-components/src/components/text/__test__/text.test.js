import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Text from '../index'

describe('Text', () => {
  it('render Text', () => {
    const component = renderIntoDocument(<Text>this is Text</Text>)
    const dom = Nerv.findDOMNode(component)
    expect(dom.textContent).toEqual('this is Text')

    const c = renderIntoDocument(<Text>0</Text>)
    const d = Nerv.findDOMNode(c)
    expect(d.textContent).toEqual('0')
  })
})

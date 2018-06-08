import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Input from '../index'

describe('Input', () => {
  it('render Input', () => {
    const component = renderIntoDocument(<Input />)
    expect(component.props.disabled).toBeFalsy()
  })

  it('render Input disabled', () => {
    const component = renderIntoDocument(<Input disabled />)
    expect(component.props.disabled).toBeTruthy()
  })

  it('render Input className correct', () => {
    const component = renderIntoDocument(<Input type='text' name='input' />)
    const dom = Nerv.findDOMNode(component)
    expect(dom.className).toEqual('weui-input')

    const password = renderIntoDocument(<Input password type='text' name='input' />)
    const passwordDom = Nerv.findDOMNode(password)
    expect(passwordDom.className).toEqual('weui-input')

    const confirmType = renderIntoDocument(<Input confirmType='search' type='text' name='input' />)
    const confirmTypeDom = Nerv.findDOMNode(confirmType)
    expect(confirmTypeDom.className).toEqual('weui-input')
  })
})

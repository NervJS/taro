import Nerv from 'nervjs'
import { renderIntoDocument, scryRenderedDOMComponentsWithClass } from 'nerv-test-utils'
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
    const scryResults = scryRenderedDOMComponentsWithClass(component, 'weui-input')
    expect(scryResults.length).toBe(1)
  })
})

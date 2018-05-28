import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Button from '../index'

describe('Button', () => {
  it('render Button', () => {
    const component = renderIntoDocument(<Button>Button</Button>)
    expect(component.props.disabled).toBeFalsy()
  })

  it('render Button disabled', () => {
    const component = renderIntoDocument(<Button disabled>Button</Button>)
    expect(component.props.disabled).toBeTruthy()
  })
})

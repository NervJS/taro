import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Switch from '../index'

describe('Switch', () => {
  it('works', () => {
    const container = renderIntoDocument(<Switch />)
    expect(container.props.checked).toBeFalsy()
  })
  it('should checked', () => {
    const container = renderIntoDocument(<Switch checked />)
    expect(container.props.checked).toBeTruthy()
  })
})

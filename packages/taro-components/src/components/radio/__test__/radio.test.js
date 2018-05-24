import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Radio from '../index'

describe('Radio', () => {
  it('works', () => {
    const container = renderIntoDocument(<Radio />)
    expect(container.props.checked).toBeFalsy()
  })
  it('should checked', () => {
    const container = renderIntoDocument(<Radio checked />)
    expect(container.props.checked).toBeTruthy()
  })
})

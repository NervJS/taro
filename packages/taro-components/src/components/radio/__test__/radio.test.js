import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Radio from '../index'

describe('Radio', () => {
  it('works', () => {
    const container = renderIntoDocument(<Radio />)
    expect(container.props.checked).toBeFalsy()
  })
  it('should checked', () => {
    const container = renderIntoDocument(<Radio checked className='test' />)
    expect(container.props.checked).toBeTruthy()
  })
})

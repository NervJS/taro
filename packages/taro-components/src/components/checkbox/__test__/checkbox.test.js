import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Checkbox from '../index'

describe('Checkbox', () => {
  it('works', () => {
    const container = renderIntoDocument(<Checkbox />)
    expect(container.props.checked).toBeFalsy()
  })
  it('should checked', () => {
    const container = renderIntoDocument(<Checkbox checked />)
    expect(container.props.checked).toBeTruthy()
  })
})

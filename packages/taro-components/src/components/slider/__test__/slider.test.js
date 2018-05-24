import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Slider from '../index'

describe('Slider', () => {
  it('should render Slider with value correctly', () => {
    const container = renderIntoDocument(<Slider value={50} />)
    expect(container.props.value).toBe(50)
  })
})

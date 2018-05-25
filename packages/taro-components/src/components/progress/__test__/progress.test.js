import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Progress from '../index'

describe('Progress', () => {
  it('render Progress', () => {
    const component = renderIntoDocument(<Progress percent={20} showInfo strokeWidth={4} active />)
    expect(component.props.percent).toBe(20)
    expect(component.props.strokeWidth).toBe(4)
    expect(component.props.showInfo).toBeTruthy()
    expect(component.props.active).toBeTruthy()
  })
})

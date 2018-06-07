import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Progress from '../index'

describe('Progress', () => {
  it('render Progress', () => {
    const component = renderIntoDocument(
      <Progress percent={20} showInfo strokeWidth={4} active />
    )
    expect(component.props.percent).toBe(20)
    expect(component.props.strokeWidth).toBe(4)
    expect(component.props.showInfo).toBeTruthy()
    expect(component.props.active).toBeTruthy()
  })

  it('should render Progress when props', () => {
    const defaultProgress = renderIntoDocument(<Progress />)
    expect(defaultProgress.props.percent).toBe(0)
    expect(defaultProgress.props.showInfo).toBeFalsy()

    const activeProgress = renderIntoDocument(<Progress active />)
    expect(activeProgress.props.active).toBeTruthy()

    const strokeWidthProgress = renderIntoDocument(<Progress strokeWidth={2} />)
    expect(strokeWidthProgress.props.strokeWidth).toBe(2)

    const activeColorProgress = renderIntoDocument(<Progress activeColor='#333' />)
    expect(activeColorProgress.props.activeColor).toBe('#333')

    const backgroundColorProgress = renderIntoDocument(<Progress backgroundColor='#fff' />)
    expect(backgroundColorProgress.props.backgroundColor).toBe('#fff')
  })
})

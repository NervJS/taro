import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Slider from '../index'

describe('Slider', () => {
  it('should render Slider with value correctly', () => {
    const container = renderIntoDocument(<Slider value={50} blockSize={30} />)
    expect(container.props.value).toBe(50)
    expect(container.props.blockSize).toBe(30)

    const d = renderIntoDocument(<Slider min={2} />)
    expect(d.props.min).toBe(2)

    const block = renderIntoDocument(
      <Slider
        showValue
        disabled
        blockSize={10}
        backgroundColor='#fff'
        activeColor='green'
        blockColor='red'
      />
    )
    expect(block.props.blockSize).toBe(10)
    expect(block.props.disabled).toBeTruthy()
    expect(block.props.showValue).toBeTruthy()
    expect(block.props.backgroundColor).toBe('#fff')
    expect(block.props.activeColor).toBe('green')
    expect(block.props.blockColor).toBe('red')
  })

  // it('should mocking touch', () => {
  // const _onChange = jest.fn()
  // const wrapper = renderIntoDocument(<Slider value={20} onChang={_onChange} />)
  // const dom = Nerv.findDOMNode(wrapper)
  // mocking touch
  // const simulateTouch = (wrapper, distance, ogX = 500) => {
  //   const $handler = wrapper.querySelector('.weui-slider__handler')
  //   Simulate.touchStart($handler, {
  //     targetTouches: [
  //       {
  //         identifier: 'test',
  //         pageX: ogX
  //       }
  //     ]
  //   })

  //   Simulate.touchMove($handler, {
  //     targetTouches: [
  //       {
  //         identifier: 'test',
  //         pageX: ogX + distance
  //       }
  //     ]
  //   })

  //   Simulate.touchEnd($handler)
  // }
  // let $renderedBar = dom.querySelector('.weui-slider__inner')
  // $renderedBar.clientWidth = 500
  // simulateTouch(dom, 40)
  // expect(_onChange).toHaveBeenCalled()

  // const $handler = dom.querySelector('.weui-slider__handler')
  // Simulate.touchStart($handler)
  // })
})

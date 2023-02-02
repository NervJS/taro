import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { ScrollView } from '../src/components/scroll-view/scroll-view'

describe('ScrollView', () => {
  let page: SpecPage
  // beforeAll(() => {
  //   // eslint-disable-next-line no-undef
  //   originTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
  //   // eslint-disable-next-line no-undef
  //   jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000
  // })

  // afterAll(() => {
  //   // eslint-disable-next-line no-undef
  //   jasmine.DEFAULT_TIMEOUT_INTERVAL = originTimeout
  // })

  const divStyleH = {
    display: 'inline-block',
    width: '100%',
    height: '300px'
  }

  const divStyleV = {
    height: '300px'
  }

  it('scroll-x', async () => {
    // TODO
    const onScroll = jest.fn()
    const onScrollToUpper = jest.fn()
    const onScrollToLower = jest.fn()
    page = await newSpecPage({
      components: [ScrollView],
      template: () => (<taro-scroll-view-core
        scrollX
        style={{
          'white-space': 'nowrap'
        }}
        onScroll={onScroll}
        onScrollToUpper={onScrollToUpper}
        onScrollToLower={onScrollToLower}
      >
        <div style={Object.assign({}, divStyleH, { backgroundColor: 'blue' })}></div>
        <div style={Object.assign({}, divStyleH, { backgroundColor: 'yellow' })}></div>
        <div style={Object.assign({}, divStyleH, { backgroundColor: 'blue' })}></div>
      </taro-scroll-view-core>),
    })
    // const { scrollHeight, scrollWidth } = node
    // const { width } = node.getBoundingClientRect()
    // const upper = 50
    // const lower = 50

    // expect(node.classList.contains('taro-scroll-view__scroll-x') === true)
    // expect(node.upperThreshold === upper)
    // expect(node.lowerThreshold === lower)
    // expect(node.scrollWithAnimation !== true)

    // await wrapper.setProps({
    //   scrollLeft: upper + 1,
    //   scrollWithAnimation: true
    // })

    // expect(onScroll.calledOnceWith({
    //   scrollLeft: upper + 1,
    //   scrollTop: 0,
    //   scrollHeight,
    //   scrollWidth
    // }))
    // expect(onScrollToUpper.callCount === 0)
    // expect(node.scrollWithAnimation === true)

    // await wrapper.setProps({
    //   scrollLeft: upper
    // })

    // expect(onScrollToUpper.calledOnceWith({ direction: 'left' }))

    // await wrapper.setProps({
    //   scrollLeft: scrollWidth - width - lower - 1
    // })

    // expect(onScrollToLower.callCount === 0)

    // await wrapper.setProps({
    //   scrollLeft: scrollWidth - width - lower
    // })

    // expect(onScrollToLower.calledOnceWith({ direction: 'right' }))

    expect(page.root).toMatchSnapshot()
  })

  it('scroll-y', async () => {
    // TODO
    const upper = 100
    const lower = 150
    const onScroll = jest.fn()
    const onScrollToUpper = jest.fn()
    const onScrollToLower = jest.fn()
    page = await newSpecPage({
      components: [ScrollView],
      template: () => (<taro-scroll-view-core
        scrollY
        style={{
          height: '300px'
        }}
        upperThreshold={upper}
        lowerThreshold={lower}
        onScroll={onScroll}
        onScrollToUpper={onScrollToUpper}
        onScrollToLower={onScrollToLower}
      >
        <div style={Object.assign({}, divStyleV, { backgroundColor: 'blue' })}></div>
        <div style={Object.assign({}, divStyleV, { backgroundColor: 'yellow' })}></div>
        <div style={Object.assign({}, divStyleV, { backgroundColor: 'blue' })}></div>
      </taro-scroll-view-core>),
    })
    // const { scrollHeight, scrollWidth } = node
    // const { height } = node.getBoundingClientRect()

    // expect(node.classList.contains('taro-scroll-view__scroll-y') === true)
    // expect(node.upperThreshold === upper)
    // expect(node.lowerThreshold === lower)

    // await wrapper.setProps({
    //   scrollTop: upper + 1
    // })

    // expect(onScroll.calledOnceWith({
    //   scrollLeft: 0,
    //   scrollTop: upper + 1,
    //   scrollHeight,
    //   scrollWidth
    // }))
    // expect(onScrollToUpper.callCount === 0)

    // await wrapper.setProps({
    //   scrollTop: upper
    // })

    // expect(onScrollToUpper.calledOnceWith({ direction: 'top' }))

    // await wrapper.setProps({
    //   scrollTop: scrollHeight - height - lower - 1
    // })

    // expect(onScrollToLower.callCount === 0)

    // await wrapper.setProps({
    //   scrollTop: scrollHeight - height - lower
    // })

    // expect(onScrollToLower.calledOnceWith({ direction: 'bottom' }))

    expect(page.root).toMatchSnapshot()
  })
})

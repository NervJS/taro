import { h } from '@stencil/core'

describe('ScrollView', () => {
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

  // const divStyleH = {
  //   display: 'inline-block',
  //   width: '100%',
  //   height: '300px'
  // }

  // const divStyleV = {
  //   height: '300px'
  // }

  it('scroll-x', async () => {
    // TODO
    // const onScroll = sinon.spy()
    // const onScrollToUpper = sinon.spy()
    // const onScrollToLower = sinon.spy()
    // const app = (
    //   <ScrollView
    //     scrollX
    //     style={{
    //       'white-space': 'nowrap'
    //     }}
    //     onScroll={e => onScroll(e.detail)}
    //     onScrollToUpper={e => onScrollToUpper(e.detail)}
    //     onScrollToLower={e => onScrollToLower(e.detail)}
    //   >
    //     <div style={Object.assign({}, divStyleH, { backgroundColor: 'blue' })}></div>
    //     <div style={Object.assign({}, divStyleH, { backgroundColor: 'yellow' })}></div>
    //     <div style={Object.assign({}, divStyleH, { backgroundColor: 'blue' })}></div>
    //   </ScrollView>
    // )
    // const wrapper = await mount(app, scratch)
    // const { node } = wrapper
    // const { scrollHeight, scrollWidth } = node
    // const { width } = node.getBoundingClientRect()
    // const upper = 50
    // const lower = 50

    // assert(node.classList.contains('taro-scroll-view__scroll-x') === true)
    // assert(node.upperThreshold === upper)
    // assert(node.lowerThreshold === lower)
    // assert(node.scrollWithAnimation !== true)

    // await wrapper.setProps({
    //   scrollLeft: upper + 1,
    //   scrollWithAnimation: true
    // })

    // assert(onScroll.calledOnceWith({
    //   scrollLeft: upper + 1,
    //   scrollTop: 0,
    //   scrollHeight,
    //   scrollWidth
    // }))
    // assert(onScrollToUpper.callCount === 0)
    // assert(node.scrollWithAnimation === true)

    // await wrapper.setProps({
    //   scrollLeft: upper
    // })

    // assert(onScrollToUpper.calledOnceWith({ direction: 'left' }))

    // await wrapper.setProps({
    //   scrollLeft: scrollWidth - width - lower - 1
    // })

    // assert(onScrollToLower.callCount === 0)

    // await wrapper.setProps({
    //   scrollLeft: scrollWidth - width - lower
    // })

    // assert(onScrollToLower.calledOnceWith({ direction: 'right' }))
  })

  it('scroll-y', async () => {
    // TODO
    // const onScroll = sinon.spy()
    // const onScrollToUpper = sinon.spy()
    // const onScrollToLower = sinon.spy()
    // const upper = 100
    // const lower = 150
    // const app = (
    //   <ScrollView
    //     scrollY
    //     style={{
    //       height: '300px'
    //     }}
    //     upperThreshold={upper}
    //     lowerThreshold={lower}
    //     onScroll={e => onScroll(e.detail)}
    //     onScrollToUpper={e => onScrollToUpper(e.detail)}
    //     onScrollToLower={e => onScrollToLower(e.detail)}
    //   >
    //     <div style={Object.assign({}, divStyleV, { backgroundColor: 'blue' })}></div>
    //     <div style={Object.assign({}, divStyleV, { backgroundColor: 'yellow' })}></div>
    //     <div style={Object.assign({}, divStyleV, { backgroundColor: 'blue' })}></div>
    //   </ScrollView>
    // )
    // const wrapper = await mount(app, scratch)
    // const { node } = wrapper
    // const { scrollHeight, scrollWidth } = node
    // const { height } = node.getBoundingClientRect()

    // assert(node.classList.contains('taro-scroll-view__scroll-y') === true)
    // assert(node.upperThreshold === upper)
    // assert(node.lowerThreshold === lower)

    // await wrapper.setProps({
    //   scrollTop: upper + 1
    // })

    // assert(onScroll.calledOnceWith({
    //   scrollLeft: 0,
    //   scrollTop: upper + 1,
    //   scrollHeight,
    //   scrollWidth
    // }))
    // assert(onScrollToUpper.callCount === 0)

    // await wrapper.setProps({
    //   scrollTop: upper
    // })

    // assert(onScrollToUpper.calledOnceWith({ direction: 'top' }))

    // await wrapper.setProps({
    //   scrollTop: scrollHeight - height - lower - 1
    // })

    // assert(onScrollToLower.callCount === 0)

    // await wrapper.setProps({
    //   scrollTop: scrollHeight - height - lower
    // })

    // assert(onScrollToLower.calledOnceWith({ direction: 'bottom' }))
  })
})

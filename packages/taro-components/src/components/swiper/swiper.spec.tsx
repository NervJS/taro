import { h } from '@stencil/core'

describe('Swiper', () => {
  const itemStyle = {
    height: '100%'
  }

  it('props', async () => {
    // TODO
    // test props: current, indicator, duration
    // const duration = 100
    // const app = (
    //   <Swiper duration={duration}>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //   </Swiper>
    // )

    // const wrapper = await mount(app, scratch)
    // const { node } = wrapper
    // const swiper = wrapper.find('.swiper-wrapper')
    // const swiperStyles = window.getComputedStyle(swiper)
    // const { width } = swiper.getBoundingClientRect()
    // const indicator = wrapper.find('.swiper-pagination')
    // const bullets = wrapper.findAll('.swiper-pagination-bullet')
    // const bulletAStyle = window.getComputedStyle(bullets[0])
    // const bulletBStyle = window.getComputedStyle(bullets[1])

    // assert(node.duration === duration)
    // assert(swiperStyles.transform === 'matrix(1, 0, 0, 1, 0, 0)')
    // assert(indicator.classList.contains('swiper-pagination-hidden') === true)
    // assert(bulletBStyle.backgroundColor === 'rgba(0, 0, 0, 0.3)')
    // assert(bulletAStyle.backgroundColor === 'rgb(0, 0, 0)')

    // const indicatorColor = 'rgb(153, 153, 153)'
    // const indicatorActiveColor = 'rgb(51, 51, 51)'
    // await wrapper.setProps({
    //   current: 1,
    //   indicatorDots: true,
    //   indicatorColor,
    //   indicatorActiveColor
    // })

    // await delay(duration)

    // assert(swiperStyles.transform === `matrix(1, 0, 0, 1, -${width}, 0)`)
    // assert(indicator.classList.contains('swiper-pagination-hidden') === false)
    // assert(bulletAStyle.backgroundColor === indicatorColor)
    // assert(bulletBStyle.backgroundColor === indicatorActiveColor)
  })

  it('should autoplay', async () => {
    // TODO
    // const interval = 1500
    // const app = (
    //   <Swiper autoplay interval={interval}>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //   </Swiper>
    // )

    // const wrapper = await mount(app, scratch)
    // const swiper = wrapper.find('.swiper-wrapper')
    // const swiperStyles = window.getComputedStyle(swiper)
    // const { width } = swiper.getBoundingClientRect()

    // assert(swiperStyles.transform === 'matrix(1, 0, 0, 1, 0, 0)')

    // await delay(interval + wrapper.node.duration)

    // assert(swiperStyles.transform === `matrix(1, 0, 0, 1, -${width}, 0)`)
  })

  it('should be circular', async () => {
    // TODO
    // const app = (
    //   <Swiper circular>
    //     <SwiperItem>
    //       <div></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div></div>
    //     </SwiperItem>
    //   </Swiper>
    // )

    // const wrapper = await mount(app, scratch)
    // const swiper = wrapper.find('.swiper-wrapper')
    // assert(swiper.children.length === 5)
  })

  it('should be vertical', async () => {
    // TODO
    // const interval = 1500
    // const app = (
    //   <Swiper
    //     current={1}
    //     vertical
    //     autoplay
    //     interval={interval}
    //   >
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //   </Swiper>
    // )

    // const wrapper = await mount(app, scratch)
    // const container = wrapper.find('.swiper-container')
    // const swiper = wrapper.find('.swiper-wrapper')
    // const swiperStyles = window.getComputedStyle(swiper)
    // const { height } = swiper.getBoundingClientRect()

    // assert(container.classList.contains('swiper-container-vertical') === true)
    // assert(swiperStyles.transform === `matrix(1, 0, 0, 1, 0, -${height})`)

    // await delay(interval + wrapper.node.duration)

    // assert(swiperStyles.transform === `matrix(1, 0, 0, 1, 0, -${height * 2})`)
  })

  it('should has previous margin', async () => {
    // TODO
    // const previousMargin = 10
    // const app = (
    //   <Swiper previousMargin={`${previousMargin}px`}>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //   </Swiper>
    // )

    // const wrapper = await mount(app, scratch)
    // const swiper = wrapper.find('.swiper-container')
    // const swiperStyles = window.getComputedStyle(swiper)

    // assert(swiperStyles.marginLeft === `${previousMargin}px`)
  })

  it('should display multi items within screen width', async () => {
    // TODO
    // const app = (
    //   <Swiper displayMultipleItems={2}>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={itemStyle}></div>
    //     </SwiperItem>
    //   </Swiper>
    // )

    // const wrapper = await mount(app, scratch)
    // const swiper = wrapper.find('.swiper-wrapper')
    // const { width } = swiper.getBoundingClientRect()
    // const item = wrapper.find('taro-swiper-item-core')

    // assert(item.style.width === `${width / 2}px`)
  })

  it('events', async () => {
    // TODO
    // const onChange = sinon.spy()
    // const onAnimationFinish = sinon.spy()
    // const app = (
    //   <Swiper
    //     onChange={e => onChange(e.detail)}
    //     onAnimationFinish={e => onAnimationFinish(e.detail)}
    //   >
    //     <SwiperItem>
    //       <div style={Object.assign({}, itemStyle, { background: 'green' })}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={Object.assign({}, itemStyle, { background: 'yellow' })}></div>
    //     </SwiperItem>
    //     <SwiperItem>
    //       <div style={Object.assign({}, itemStyle, { background: 'green' })}></div>
    //     </SwiperItem>
    //   </Swiper>
    // )

    // const wrapper = await mount(app, scratch)

    // await wrapper.setProps({
    //   current: 1
    // })

    // await delay(wrapper.node.duration)

    // assert(onChange.calledOnceWith({
    //   current: 1,
    //   source: ''
    // }))

    // assert(onAnimationFinish.calledOnceWith({
    //   current: 1,
    //   source: ''
    // }))
  })
})

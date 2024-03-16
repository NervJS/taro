import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Swiper } from '../src/components/swiper/swiper'
import { SwiperItem } from '../src/components/swiper/swiper-item'

describe('Swiper', () => {
  beforeAll(() => {
    // https://github.com/ionic-team/stencil/issues/2056#issuecomment-598086745
    jest.useFakeTimers()
  })

  let page: SpecPage
  const itemStyle = {
    height: '100%'
  }

  it('props', async () => {
    // test props: current, indicator, duration
    // TODO
    const duration = 100
    page = await newSpecPage({
      components: [Swiper, SwiperItem],
      template: () => (<taro-swiper-core duration={duration}>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
      </taro-swiper-core>),
    })

    // const swiper = wrapper.find('.swiper-wrapper')
    // const swiperStyles = window.getComputedStyle(swiper)
    // const { width } = swiper.getBoundingClientRect()
    // const indicator = wrapper.find('.swiper-pagination')
    // const bullets = wrapper.findAll('.swiper-pagination-bullet')
    // const bulletAStyle = window.getComputedStyle(bullets[0])
    // const bulletBStyle = window.getComputedStyle(bullets[1])

    // expect(node.duration === duration)
    // expect(swiperStyles.transform === 'matrix(1, 0, 0, 1, 0, 0)')
    // expect(indicator.classList.contains('swiper-pagination-hidden') === true)
    // expect(bulletBStyle.backgroundColor === 'rgba(0, 0, 0, 0.3)')
    // expect(bulletAStyle.backgroundColor === 'rgb(0, 0, 0)')

    // const indicatorColor = 'rgb(153, 153, 153)'
    // const indicatorActiveColor = 'rgb(51, 51, 51)'
    // await wrapper.setProps({
    //   current: 1,
    //   indicatorDots: true,
    //   indicatorColor,
    //   indicatorActiveColor
    // })

    // await delay(duration)

    // expect(swiperStyles.transform === `matrix(1, 0, 0, 1, -${width}, 0)`)
    // expect(indicator.classList.contains('swiper-pagination-hidden') === false)
    // expect(bulletAStyle.backgroundColor === indicatorColor)
    // expect(bulletBStyle.backgroundColor === indicatorActiveColor)

    expect(page.root).toMatchSnapshot()
  })

  it('should autoplay', async () => {
    // TODO
    const interval = 1500
    page = await newSpecPage({
      components: [Swiper, SwiperItem],
      template: () => (<taro-swiper-core autoplay interval={interval}>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
      </taro-swiper-core>),
    })

    // const wrapper = await mount(app, scratch)
    // const swiper = wrapper.find('.swiper-wrapper')
    // const swiperStyles = window.getComputedStyle(swiper)
    // const { width } = swiper.getBoundingClientRect()

    // expect(swiperStyles.transform === 'matrix(1, 0, 0, 1, 0, 0)')

    // await delay(interval + wrapper.node.duration)

    // expect(swiperStyles.transform === `matrix(1, 0, 0, 1, -${width}, 0)`)

    expect(page.root).toMatchSnapshot()
  })

  it('should be circular', async () => {
    page = await newSpecPage({
      components: [Swiper, SwiperItem],
      template: () => (<taro-swiper-core circular>
        <taro-swiper-item-core><div /></taro-swiper-item-core>
        <taro-swiper-item-core><div /></taro-swiper-item-core>
        <taro-swiper-item-core><div /></taro-swiper-item-core>
      </taro-swiper-core>),
    })

    // const wrapper = await mount(app, scratch)
    // const swiper = wrapper.find('.swiper-wrapper')
    // expect(swiper.children.length === 5)

    expect(page.root).toMatchSnapshot()
  })

  it('should be vertical', async () => {
    // TODO
    const interval = 1500
    page = await newSpecPage({
      components: [Swiper, SwiperItem],
      template: () => (<taro-swiper-core current={1} vertical autoplay interval={interval}>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
      </taro-swiper-core>),
    })

    // const container = wrapper.find('.swiper-container')
    // const swiper = wrapper.find('.swiper-wrapper')
    // const swiperStyles = window.getComputedStyle(swiper)
    // const { height } = swiper.getBoundingClientRect()

    // expect(container.classList.contains('swiper-container-vertical') === true)
    // expect(swiperStyles.transform === `matrix(1, 0, 0, 1, 0, -${height})`)

    // await delay(interval + wrapper.node.duration)

    // expect(swiperStyles.transform === `matrix(1, 0, 0, 1, 0, -${height * 2})`)

    expect(page.root).toMatchSnapshot()
  })

  it('should has previous margin', async () => {
    // TODO
    const previousMargin = 10
    page = await newSpecPage({
      components: [Swiper, SwiperItem],
      template: () => (<taro-swiper-core previousMargin={`${previousMargin}px`}>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
      </taro-swiper-core>),
    })

    // const wrapper = await mount(app, scratch)
    // const swiper = wrapper.find('.swiper-container')
    // const swiperStyles = window.getComputedStyle(swiper)

    // expect(swiperStyles.marginLeft === `${previousMargin}px`)

    expect(page.root).toMatchSnapshot()
  })

  it('should display multi items within screen width', async () => {
    // TODO
    page = await newSpecPage({
      components: [Swiper, SwiperItem],
      template: () => (<taro-swiper-core displayMultipleItems={2}>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={itemStyle} /></taro-swiper-item-core>
      </taro-swiper-core>),
    })

    // const swiper = wrapper.find('.swiper-wrapper')
    // const { width } = swiper.getBoundingClientRect()
    // const item = wrapper.find('taro-swiper-item-core')

    // expect(item.style.width === `${width / 2}px`)

    expect(page.root).toMatchSnapshot()
  })

  it('events', async () => {
    // TODO
    const onChange = jest.fn()
    const onAnimationFinish = jest.fn()
    page = await newSpecPage({
      components: [Swiper, SwiperItem],
      template: () => (<taro-swiper-core onChange={onChange} onAnimationFinish={onAnimationFinish}>
        <taro-swiper-item-core><div style={Object.assign({}, itemStyle, { background: 'green' })} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={Object.assign({}, itemStyle, { background: 'yellow' })} /></taro-swiper-item-core>
        <taro-swiper-item-core><div style={Object.assign({}, itemStyle, { background: 'green' })} /></taro-swiper-item-core>
      </taro-swiper-core>),
    })

    // await wrapper.setProps({
    //   current: 1
    // })

    // await delay(wrapper.node.duration)

    // expect(onChange.calledOnceWith({
    //   current: 1,
    //   source: ''
    // }))

    // expect(onAnimationFinish.calledOnceWith({
    //   current: 1,
    //   source: ''
    // }))

    expect(page.root).toMatchSnapshot()
  })
})

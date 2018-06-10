import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import { Swiper, SwiperItem } from '../index'

describe('Swiper', () => {
  const swiperOpts = {
    autoplay: false,
    indicatorDots: true,
    slideMult: 10,
    duration: 300,
    interval: 3000,
    indicatorColor: 'blue',
    indicatorActiveColor: 'red',
    current: 0,
    circular: true,
    preMargin: 20
  }
  const goodsData = [
    {
      image: '//jdc.jd.com/img/360x100?color=333'
    },
    {
      image: '//jdc.jd.com/img/360x100?color=d56d66'
    },
    {
      image: '//jdc.jd.com/img/360x100?color=dde4a1'
    },
    {
      image: '//jdc.jd.com/img/360x100?color=b2994c'
    },
    {
      image: '//jdc.jd.com/img/360x100?color=eeeeee'
    },
    {
      image: '//jdc.jd.com/img/360x100?color=999'
    },
    {
      image: '//jdc.jd.com/img/360x100?color=70b4ae'
    }
  ]

  it('render Swiper childrenNums correct', () => {
    const view = (
      <Swiper {...swiperOpts}>
        {goodsData.map(item => {
          return (
            <SwiperItem>
              <img src={item.image} />
            </SwiperItem>
          )
        })}
      </Swiper>
    )
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    const children = dom.querySelectorAll('.swiper_item')
    const indicators = dom.querySelectorAll('.swiper_indicators_item')
    expect(children.length).toBe(9)
    expect(indicators.length).toBe(7)
  })

  it('should error Swiper', () => {
    let swIns
    const view = <Swiper autoplay ref={c => (swIns = c)} />
    const component = renderIntoDocument(view)
    const dom = Nerv.findDOMNode(component)
    const children = dom.querySelectorAll('.swiper_item')

    // todo 研究下相关库
    const targetTouches = [
      {
        identifier: 'test',
        pageX: 20,
        pageY: 30
      }
    ]
    swIns.componentDidMount()
    swIns.slideNext()
    swIns.slidePre()
    swIns.getSwiperDirection(targetTouches)
    swIns.componentWillUnmount()
    expect(children.length).toBe(0)
  })
})

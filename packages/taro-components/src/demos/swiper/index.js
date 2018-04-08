import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/swiper/index.md'

export default class Swiper extends Nerv.Component {
  constructor () {
    super(...arguments)

    this.onChange = this.onChange.bind(this)
  }

  onChange (e) {
    console.log(e)
  }

  render () {
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
        image:
          '//jdc.jd.com/img/360x100?color=333'
      },
      {
        image:
          '//jdc.jd.com/img/360x100?color=d56d66'
      },
      {
        image:
          '//jdc.jd.com/img/360x100?color=dde4a1'
      },
      {
        image:
          '//jdc.jd.com/img/360x100?color=b2994c'
      },
      {
        image:
          '//jdc.jd.com/img/360x100?color=eeeeee'
      },
      {
        image:
          '//jdc.jd.com/img/360x100?color=999'
      },
      {
        image:
          '//jdc.jd.com/img/360x100?color=70b4ae'
      }
    ]

    return (
      <Taro.View>
        <Taro.View className='page'>
          <Taro.View className='page__header'>
            <Taro.View className='page__title'>
              <Taro.Text>swiper</Taro.Text>
            </Taro.View>
            <Taro.View className='page__desc'>
              <Taro.Text>滑块视图容器</Taro.Text>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con'>
            <Taro.Swiper {...swiperOpts} bindchange={this.onChange}>
              {goodsData.map(item => {
                return (
                  <div className='swiper_item'>
                    <img src={item.image} />
                  </div>
                )
              })}
            </Taro.Swiper>
          </Taro.View>
        </Taro.View>
        <Taro.View className='markdown'>
          <Doc />
        </Taro.View>
      </Taro.View>
    )
  }
}

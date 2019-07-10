import React, { Component } from 'react'
import { View, Swiper, SwiperItem, Image } from '../../dist'

export default class EXSwiper extends Component {
  state = {
    data: []
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        data: [
          {
            image: 'https://imgcps.jd.com/ling4/4635736/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5c17126882acdd181dd53ce0/95c21515/cr_1125x549_0_72/s1125x690/q70.jpg',
            clickUrl: 'https://m.jd.com/'
          },
          {
            image: 'https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/54392/1/2538/95587/5d064ea3E74ca0763/dc1d10fbd105d8a0.jpg!cr_1125x549_0_72!q70.jpg.dpg',
            clickUrl: 'https://m.jd.com/'
          }
        ]
      })
    }, 300)
    setTimeout(() => {
      this.setState({
        data: [
          {
            image: 'https://imgcps.jd.com/ling4/4635736/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5c17126882acdd181dd53ce0/95c21515/cr_1125x549_0_72/s1125x690/q70.jpg',
            clickUrl: 'https://m.jd.com/'
          },
          {
            image: 'https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/30451/34/12138/108202/5cb7720aE6ebf11ec/9945f5b3b9f9547f.jpg!cr_1125x549_0_72!q70.jpg.dpg',
            clickUrl: 'https://m.jd.com/'
          },
          {
            image: 'https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/54392/1/2538/95587/5d064ea3E74ca0763/dc1d10fbd105d8a0.jpg!cr_1125x549_0_72!q70.jpg.dpg',
            clickUrl: 'https://m.jd.com/'
          },
          {
            image: 'https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/81508/17/1849/124012/5d01f580E0fee0c3f/1839eac6ba834f3e.jpg!cr_1125x549_0_72!q70.jpg.dpg',
            clickUrl: 'https://m.jd.com/'
          }
        ]
      })
    }, 600)
  }

  render () {
    return (
      <View style={{ width: 300, height: 250, backgroundColor: 'pink' }}>
        <Swiper
          indicatorDots={true}
          indicatorColor="white"
          indicatorActiveColor="purple"
          autoplay={true}
          // current={1}
          interval={3000}
          circular={true}
          vertical={false}
          onChange={(event) => { console.log('Swiper: onChange', event.detail.current) }}
          onAnimationFinish={() => null}
          style={{
            marginTop: 30,
            width: 280.5,
            height: 200,
            backgroundColor: 'black'
          }}
        >
          {this.state.data.map((item, index) => {
            return (
              <SwiperItem
                key={`swiper${index}`}
                onClick={() => { console.log('click item') }}
              >
                <Image src={item.image} />
              </SwiperItem>
            )
          })}
        </Swiper>
      </View>
    )
  }
}

import React, { Component } from 'react'
import { View, Text, Swiper, SwiperItem, Image } from '../../dist'

export default class EXSwiper extends Component {
  render () {
    return (
      <View style={{ width: 300, height: 100 }}>
        <Swiper
          showsPagination={true}
          indicatorColor="white"
          indicatorActiveColor="purple"
          autoplay={false}
          current={1}
          interval={6000}
          circular={false}
          vertical={false}
          onChange={() => null}
          onAnimationFinish={() => null}
          style={{
            backgroundColor: 'black'
          }}
        >
          <SwiperItem onClick={() => { alert('click item') }} style={{ backgroundColor: 'red' }}>
            <Text>Hello Swiper</Text>
          </SwiperItem>
          <SwiperItem style={{ backgroundColor: 'green' }}>
            <Text>Beautiful</Text>
          </SwiperItem>
          <SwiperItem style={{ backgroundColor: 'blue' }}>
            <Text>And simple</Text>
          </SwiperItem>
        </Swiper>
        {/* <Swiper autoplay interval={2000} circular>
          <SwiperItem>
            <Image src='http://img.3dmgame.com/uploads/images/news/20181124/1543042277_150670.jpg'></Image>
          </SwiperItem>
          <SwiperItem>
            <Image src='http://b.zol-img.com.cn/soft/5/847/ce8wO9xMfFGr2.jpg'></Image>
          </SwiperItem>
          <SwiperItem>
            <Image src='http://img8.zol.com.cn/bbs/upload/13484/13483443.jpg'></Image>
          </SwiperItem>
        </Swiper> */}
      </View>
    )
  }
}

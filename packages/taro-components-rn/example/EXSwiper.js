import React, { Component } from 'react'
import { View, Text, Swiper, SwiperItem } from '../src'

export default class EXSwiper extends Component {
  render () {
    return (
      <View style={{ width: 300, height: 250 }}>
        <Swiper
          showsPagination={true}
          indicatorColor="white"
          indicatorActiveColor="purple"
          autoplay={true}
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
          <SwiperItem style={{ backgroundColor: 'red' }}>
            <Text>Hello Swiper</Text>
          </SwiperItem>
          <SwiperItem style={{ backgroundColor: 'green' }}>
            <Text>Beautiful</Text>
          </SwiperItem>
          <SwiperItem style={{ backgroundColor: 'blue' }}>
            <Text>And simple</Text>
          </SwiperItem>
        </Swiper>
      </View>
    )
  }
}

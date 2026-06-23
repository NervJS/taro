import React, { Component } from 'react'
import { View, Text, Input, Textarea, Swiper, SwiperItem, Canvas, Video, CoverImage, CoverView } from '@tarojs/components'
import './index.css'

export default class Index extends Component {

  async componentWillMount () {
    await Promise.resolve(1)
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <Input placeholder='input' value='' />
        <Textarea value='' />

        <Swiper>
          <SwiperItem>
            <Text>Swiper item</Text>
          </SwiperItem>
        </Swiper>

        <Video />

        <Canvas>
          <CoverView>
            <CoverImage />
          </CoverView>
        </Canvas>
      </View>
    )
  }
}

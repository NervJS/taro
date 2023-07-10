import './video.scss'
import React from 'react'
import { View, Video } from '@tarojs/components'

import Header from '../../../../components/head/head'

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Video'></Header>
        </View>
        <View className='components-page__body'>
          <View className='components-page__body-example example'>
            <View className='example-body'>
              <Video
                src='http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
                controls
                autoplay={false}
                poster='http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
                initialTime='0'
                id='video'
                loop={false}
                muted={false} />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

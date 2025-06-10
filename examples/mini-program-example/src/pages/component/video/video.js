import './video.scss'
import React from 'react'
import { View, Video } from '@tarojs/components'

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Video'></Header>
          <ComponentState platform='H5' rate='100'>
            {' '}
          </ComponentState>
        </View>
        <View className='components-page__body' style={{ marginTop: '100px' }}>
          <View className='components-page__body-example example'>
            <View className='example-body'>
              <Video
                style={{ height: '300px', marginTop: '100px' }}
                src='https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
                controls
                autoplay={false}
                initialTime='0'
                id='video'
                loop={false}
                muted={false}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

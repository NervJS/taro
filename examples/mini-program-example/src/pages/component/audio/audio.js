import './audio.scss'
import React from 'react'
import { View, Audio } from '@tarojs/components'

import Header from '../../../components/head/head'

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Audio'></Header>
        </View>
        <View className='components-page__body'>
          <View className='components-page__body-example example'>
            <View className='example-body'>
              <Audio
                src='http://storage.jd.com/cjj-pub-images/horse.ogv'
                controls
                autoplay={false}
                loop={false}
                muted
                initialTime='30'
                className='example-body__audio'
                id='audio' ></Audio>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

import './live-player.scss'
import React from 'react'
import { View, LivePlayer, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='lvie-player'></Header>
          <ComponentState platform='H5' rate='10'>
            {' '}
          </ComponentState>
        </View>
        <View className='components-page__body' style={{ marginTop: '100px' }}>
          <View className='components-page__body-example example'>
            <View className='example-body'>
              <LivePlayer
                style={{ height: '300px', marginTop: '100px' }}
                src='https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-480p.flv'
                isLive
                cors
                autoplay
                muted={false}
                orientation='horizontal'
                type='flv'
                id='LivePlayer'
                soundMode='speaker'
                autoPauseIfNavigate={false}
                pictureInPictureMode={['pop', 'push']}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

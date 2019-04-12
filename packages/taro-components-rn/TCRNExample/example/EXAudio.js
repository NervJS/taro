import React, { Component } from 'react'
import { View } from '../../dist'
import Audio from '../dist/components/Audio'

export default class EXAudio extends Component {
  state = {
    isCheckboxChecked: false
  }

  render () {
    return (
      <View style={{ marginVertical: 10, width: '80%' }}>
        <Audio
          src="http://ra01.sycdn.kuwo.cn/resource/n3/32/56/3260586875.mp3"
          poster="http://p2.music.126.net/uy2Q6Qxt8rlYtgRHIIXr_A==/7706476999166587.jpg?param=130y130"
          name="此时此刻"
          author="许巍"
          loop={true}
          onPlay={() => { console.log('onPlay') }}
          onPause={() => { console.log('onPause') }}
          onTimeUpdate={(detail) => { console.log('onTimeUpdate', detail) }}
          onEnded={() => { console.log('onEnded') }}
        />
      </View>
    )
  }
}

import React from 'react'
import { View, Text, Button } from 'react-native'
import { styles } from '../styles'
import { chooseImage, chooseVideo, getImageInfo, saveImageToPhotosAlbum } from '../../../dist/api/media'
import { getRecorderManager } from '../../../dist/api/media/record'
import { createInnerAudioContext } from '../../../dist/api/media/audio'
import { Video } from 'expo-av'
import Map from './Map'

const recordInstance = getRecorderManager()

const innerAudioContext = createInnerAudioContext()
innerAudioContext.onPlay(() => {
  console.log('开始播放')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})

function handleChooseImage (type) {
  console.log('chooseImage')
  chooseImage({
    count: 2,
    sourceType: [type],
    success () {
      console.log('success')
    },
    fail () {
      console.log('fail')
    }
  }).then(res => console.log(res)).catch(e => console.log(e))
}

function handleChooseVideo (type) {
  console.log('chooseVideo')
  chooseVideo({
    sourceType: [type],
    success () {
      console.log('success')
    },
    fail () {
      console.log('fail')
    }
  }).then(res => console.log(res)).catch(e => console.log(e))
}

function handleGetImageInfo () {
  console.log('getImageInfo')
  getImageInfo({ src: 'https://nervjs.github.io/taro/img/logo-taro.png' }).then(res => console.log(res))
}

function handleSaveImageToPhotosAlbum () {
  console.log('saveImageToPhotosAlbum')
  saveImageToPhotosAlbum({ filePath: 'https://nervjs.github.io/taro/img/logo-taro.png' }).then(res => console.log(res))
}

function handleRecordStart () {
  console.log('handleRecordStart')
  recordInstance.onError((res) => console.log(res))
  recordInstance.onStart((res) => console.log(res))
  recordInstance.onStop((res) => console.log(res))
  recordInstance.onPause((res) => console.log(res))
  recordInstance.onResume((res) => console.log(res))
  recordInstance.start()
}

function handleRecordPause () {
  recordInstance.pause()
}

function handleRecordResume () {
  recordInstance.resume()
}

function handleRecordStop () {
  recordInstance.stop()
}

function handleAudioPause () {
  console.log('handleAudioPause')
  innerAudioContext.pause()
}

function handleAudioStop () {
  console.log('handleAudioStop')
  innerAudioContext.stop()
}

function handleAudioSeek () {
  console.log('handleAudioSeek')
  innerAudioContext.seek(100)
}

function handleAudioDestory () {
  console.log('handleAudioDestory')
  innerAudioContext.destroy()
}

export class Media extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 'map'
    }
    this.videoRef = React.createRef()
  }

  componentDidMount () {
    console.log(this.videoRef)
    global._taroVideoMap.demo = this.videoRef.current
  }

  handleAudioStart1 () {
    console.log('handleAudioStart1')
    innerAudioContext.autoplay = true
    innerAudioContext.startTime = 100
    innerAudioContext.obeyMuteSwitch = false
    innerAudioContext.loop = true
    innerAudioContext.volume = 0.9
    innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    innerAudioContext.onTimeUpdate((res) => {
      console.log(res)
      this.setState({
        duration: innerAudioContext.duration,
        currentTime: innerAudioContext.currentTime,
        paused: innerAudioContext.paused,
        buffered: innerAudioContext.buffered
      })
    })
  }

  handleAudioStart () {
    console.log('handleAudioStart')
    innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    innerAudioContext.onTimeUpdate((res) => {
      console.log(res)
      this.setState({
        duration: innerAudioContext.duration,
        currentTime: innerAudioContext.currentTime,
        paused: innerAudioContext.paused,
        buffered: innerAudioContext.buffered
      })
    })
    innerAudioContext.play()
  }

  render () {
    return (
      <View>
        <View style={{ flexDirection: 'row', backgroundColor: '#F7F7F7', justifyContent: 'space-between' }}>
          <Button onPress={() => this.setState({ tab: 'default' })} title='default' color='#19AD1A' />
          <Button onPress={() => this.setState({ tab: 'video' })} title='video' color='#19AD1A' />
          <Button onPress={() => this.setState({ tab: 'map' })} title='map' color='#19AD1A' />
        </View>
        {this.state.tab === 'default' &&
        <View>
          <Text style={styles.index}>图片</Text>
          <View>
            <View style={{ alignItems: 'flex-start' }}>
              <Button onPress={handleChooseImage.bind(null, 'album')} title='chooseImage 相册' color='#19AD1A' />
              <Button onPress={chooseImage.bind(null, 'camera')} title='chooseImage 相机' color='#19AD1A' />x
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button onPress={handleGetImageInfo} title='getImageInfo' color='#19AD1A' />x
              <Button onPress={handleSaveImageToPhotosAlbum} title='saveImage' color='#19AD1A' />x
            </View>
          </View>
          <Text style={styles.index}>视频</Text>
          <View style={{ alignItems: 'flex-start' }}>
            <Button onPress={handleChooseVideo.bind(null, 'album')} title='chooseVideo 相册' color='#19AD1A' />
            <Button onPress={handleChooseVideo.bind(null, 'camera')} title='chooseVideo 相机' color='#19AD1A' />
          </View>
          <Text style={styles.index}>录音</Text>
          <View style={{ flexDirection: 'row' }}>
            <Button onPress={handleRecordStart} title='开始' color='#19AD1A' />
            <Button onPress={handleRecordPause} title='暂停' color='#19AD1A' />
            <Button onPress={handleRecordResume} title='继续' color='#19AD1A' />
            <Button onPress={handleRecordStop} title='停止' color='#19AD1A' />
          </View>
          <Text style={styles.index}>音频</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text> 长度：{this.state.duration || ''}</Text>
            <Text> 当前：{this.state.currentTime || ''}</Text>
            <Text> 暂停：{this.state.paused + ''} </Text>
            <Text> 缓存：{this.state.buffered || ''}</Text>
          </View>
          <Button onPress={this.handleAudioStart1.bind(this)} title='自动从100播放' color='#19AD1A' />
          <View style={{ flexDirection: 'row' }}>
            <Button onPress={this.handleAudioStart.bind(this)} title='播放' color='#19AD1A' />
            <Button onPress={handleAudioPause} title='暂停' color='#19AD1A' />
            <Button onPress={handleAudioStop} title='停止' color='#19AD1A' />
            <Button onPress={handleAudioSeek} title='跳转' color='#19AD1A' />
            <Button onPress={handleAudioDestory} title='销毁' color='#19AD1A' />
          </View>
        </View>
        }
        {this.state.tab === 'video' &&
        <View>
          <Text style={styles.index}>视频</Text>
          <Video
            ref={this.videoRef}
            source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
            rate={1}
            volume={1.0}
            isMuted={false}
            resizeMode='cover'
            useNativeControls
            shouldPlay
            isLooping
            style={{ width: 300, height: 300 }}
          />
        </View>
        }
        {this.state.tab === 'map' &&
        <Map />
        }
      </View>
    )
  }
}

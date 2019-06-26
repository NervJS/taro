import React from 'react'
import { View, Text, Button } from 'react-native'
import { styles } from '../styles'
import { chooseImage, chooseVideo, getImageInfo, saveImageToPhotosAlbum } from '../../../dist/api/media'
// import { getRecorderManager } from '../../../dist/api/media/record'

// const recordInstance = getRecorderManager()

function handleChooseImage (type) {
  console.log('chooseImage')
  chooseImage({
    count: 2,
    sourceType: [type],
    success (res) {
      console.log('success')
    },
    fail (res) {
      console.log('fail')
    }
  }).then(res => console.log(res)).catch(e => console.log(e))
}

function handleChooseVideo (type) {
  console.log('chooseVideo')
  chooseVideo({
    sourceType: [type],
    success (res) {
      console.log('success')
    },
    fail (res) {
      console.log('fail')
    }
  }).then(res => console.log(res)).catch(e => console.log(e))
}

function handleGetImageInfo () {
  console.log('getImageInfo')
  getImageInfo({src: 'https://nervjs.github.io/taro/img/logo-taro.png'}).then(res => console.log(res))
}

function handleSaveImageToPhotosAlbum () {
  console.log('saveImageToPhotosAlbum')
  saveImageToPhotosAlbum({filePath: 'https://nervjs.github.io/taro/img/logo-taro.png'}).then(res => console.log(res))
}

function handleRecordStart () {
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

export function Media () {
  return (
    <View>
      <Text style={styles.index}>图片</Text>
      <View>
        <View style={{alignItems: 'flex-start'}}>
          <Button onPress={handleChooseImage.bind(null, 'album')} title='chooseImage 相册' color='#19AD1A' />
          <Button onPress={chooseImage.bind(null, 'camera')} title='chooseImage 相机' color='#19AD1A' />x
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button onPress={handleGetImageInfo} title='getImageInfo' color='#19AD1A' />x
          <Button onPress={handleSaveImageToPhotosAlbum} title='saveImage' color='#19AD1A' />x
        </View>
      </View>
      <Text style={styles.index}>视频</Text>
      <View style={{alignItems: 'flex-start'}}>
        <Button onPress={handleChooseVideo.bind(null, 'album')} title='chooseVideo 相册' color='#19AD1A' />
        <Button onPress={handleChooseVideo.bind(null, 'camera')} title='chooseVideo 相机' color='#19AD1A' />
      </View>
      <Text style={styles.index}>录音</Text>
      <View style={{flexDirection: 'row'}}>
        <Button onPress={handleRecordStart} title='开始' color='#19AD1A' />
        <Button onPress={handleRecordPause} title='暂停' color='#19AD1A' />
        <Button onPress={handleRecordResume} title='继续' color='#19AD1A' />
        <Button onPress={handleRecordStop} title='停止' color='#19AD1A' />
      </View>
    </View>
  )
}

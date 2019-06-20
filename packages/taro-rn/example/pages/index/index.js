import React from 'react'
import Taro, { Component } from '@tarojs/taro-rn'
import { View, Text, StyleSheet, Button } from 'react-native'
import { chooseImage, chooseVideo, getImageInfo, saveImageToPhotosAlbum } from '../../../dist/api/media'
import * as toast from '../../../dist/api/interface'
import { getLocation } from '../../../dist/api/location'
import { startAccelerometer, stopAccelerometer, onAccelerometerChange } from '../../../dist/api/accelerometer'
import { downloadFile } from '../../../dist/api/file'
import { onDeviceMotionChange, startDeviceMotionListening, stopDeviceMotionListening } from '../../../dist/api/device/deviceMotion'

console.log('toast', toast)

const styles = StyleSheet.create({
  index: {
    fontSize: 18
    // textAlign: 'center'
  }
})

export default class Index extends Component {
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  chooseImage (type) {
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

  chooseVideo (type) {
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

  getImageInfo () {
    console.log('getImageInfo')
    getImageInfo({src: 'https://nervjs.github.io/taro/img/logo-taro.png'}).then(res => console.log(res))
  }

  saveImageToPhotosAlbum () {
    console.log('saveImageToPhotosAlbum')
    saveImageToPhotosAlbum({filePath: 'https://nervjs.github.io/taro/img/logo-taro.png'}).then(res => console.log(res))
  }

  handleGetLocation () {
    console.log('getLocation')
    getLocation().then(res => console.log(res))
  }

  startAccelerometer () {
    console.log('startAccelerometer')
    startAccelerometer().then(res => console.log(res))
  }

  stopAccelerometer () {
    console.log('stopAccelerometer')
    stopAccelerometer().then(res => console.log(res))
  }

  onAccelerometerChange () {
    console.log('onAccelerometerChange')
    onAccelerometerChange((res) => {
      console.log(res.x)
      console.log(res.y)
      console.log(res.z)
    })
  }

  startDeviceMotionListening () {
    console.log('startDeviceMotionListening')
    startDeviceMotionListening().then(res => console.log(res))
  }

  stopDeviceMotionListening () {
    console.log('startDeviceMotionListening')
    stopDeviceMotionListening().then(res => console.log(res))
  }

  onDeviceMotionChange () {
    console.log('startDeviceMotionListening')
    onDeviceMotionChange((res) => {
      console.log(res.x)
      console.log(res.y)
      console.log(res.z)
    })
  }

  downloadFile () {
    console.log('downloadFile')
    downloadFile({
      url: 'https://nervjs.github.io/taro/img/logo-taro.png',
      success (res) {
        console.log('success')
      },
      fail (res) {
        console.log('fail')
      }
    }).then(res => console.log(res)).catch(e => console.log(e))
  }

  render () {
    return (
      <View style={{paddingTop: 20}}>
        <Text style={styles.index}>图片</Text>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={this.chooseImage.bind(this, 'album')} title='chooseImage 相册' color='#19AD1A' />
            <Button onPress={this.chooseImage.bind(this, 'camera')} title='chooseImage 相机' color='#19AD1A' />x
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={this.getImageInfo.bind(this)} title='getImageInfo' color='#19AD1A' />x
            <Button onPress={this.saveImageToPhotosAlbum.bind(this)} title='saveImage' color='#19AD1A' />x
          </View>
        </View>
        <Text style={styles.index}>视频</Text>
        <View style={{flexDirection: 'row'}}>
          <Button onPress={this.chooseVideo.bind(this, 'album')} title='chooseVideo 相册' color='#19AD1A' />
          <Button onPress={this.chooseVideo.bind(this, 'camera')} title='chooseVideo 相机' color='#19AD1A' />
        </View>
        <Text style={styles.index}>位置</Text>
        <View style={{flexDirection: 'row'}}>
          <Button onPress={this.handleGetLocation.bind(this)} title='getLocation' color='#19AD1A' />
        </View>
        <Text style={styles.index}>文件</Text>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={this.downloadFile.bind(this)} title='downloadFile' color='#19AD1A' />
          </View>
        </View>
        <Text style={styles.index}>加速度计</Text>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={this.startAccelerometer.bind(this)} title='startAccelerometer' color='#19AD1A' />
            <Button onPress={this.stopAccelerometer.bind(this)} title='stopAccelerometer' color='#19AD1A' />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={this.onAccelerometerChange.bind(this)} title='onAccelerometerChange' color='#19AD1A' />
          </View>
        </View>
        <Text style={styles.index}>设备方向</Text>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={this.startDeviceMotionListening.bind(this)} title='startDeviceMotionListening' color='#19AD1A' />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={this.stopDeviceMotionListening.bind(this)} title='stopDeviceMotionListening' color='#19AD1A' />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={this.onDeviceMotionChange.bind(this)} title='onDeviceMotionChange' color='#19AD1A' />
          </View>
        </View>
      </View>
    )
  }
}

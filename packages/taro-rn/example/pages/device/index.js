import React from 'react'
import { View, Text, Button } from 'react-native'
import { styles } from '../styles'
import { onAccelerometerChange, startAccelerometer, stopAccelerometer } from '../../../dist/api/accelerometer'
import { onDeviceMotionChange, startDeviceMotionListening, stopDeviceMotionListening } from '../../../dist/api/device/deviceMotion'
import { setScreenBrightness, getScreenBrightness, setKeepScreenOn } from '../../../dist/api/device/screen'

function handleStartAccelerometer () {
  console.log('startAccelerometer')
  startAccelerometer().then(res => console.log(res))
}

function handleStopAccelerometer () {
  console.log('stopAccelerometer')
  stopAccelerometer().then(res => console.log(res))
}

function handleOnAccelerometerChange () {
  console.log('onAccelerometerChange')
  onAccelerometerChange((res) => {
    console.log(res.x)
    console.log(res.y)
    console.log(res.z)
  })
}

function handleStartDeviceMotionListening () {
  console.log('startDeviceMotionListening')
  startDeviceMotionListening().then(res => console.log(res))
}

function handleStopDeviceMotionListening () {
  console.log('startDeviceMotionListening')
  stopDeviceMotionListening().then(res => console.log(res))
}

function handleOnDeviceMotionChange () {
  console.log('startDeviceMotionListening')
  onDeviceMotionChange((res) => {
    console.log(res.x)
    console.log(res.y)
    console.log(res.z)
  })
}

function handleSetScreenBrightness () {
  console.log('setScreenBrightness')
  setScreenBrightness({ value: 1 }).then(res => console.log(res)).catch(res => console.log(res))
}

function handleGetScreenBrightness () {
  console.log('getScreenBrightness')
  getScreenBrightness().then(res => console.log(res)).catch(res => console.log(res))
}

function handleSetKeepScreenOn () {
  console.log('setKeepScreenOn')
  setKeepScreenOn({ keepScreenOn: true }).then(res => console.log(res)).catch(res => console.log(res))
}

export function Device () {
  return (
    <View>
      <Text style={styles.index}>加速度计</Text>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={handleStartAccelerometer} title='startAccelerometer' color='#19AD1A' />
          <Button onPress={handleStopAccelerometer} title='stopAccelerometer' color='#19AD1A' />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={handleOnAccelerometerChange} title='onAccelerometerChange' color='#19AD1A' />
        </View>
      </View>
      <Text style={styles.index}>设备方向</Text>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={handleStartDeviceMotionListening} title='startDeviceMotionListening' color='#19AD1A' />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={handleStopDeviceMotionListening} title='stopDeviceMotionListening' color='#19AD1A' />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={handleOnDeviceMotionChange} title='onDeviceMotionChange' color='#19AD1A' />
        </View>
      </View>
      <Text style={styles.index}>屏幕</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={handleSetScreenBrightness} title='setScreenBrightness' color='#19AD1A' />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={handleGetScreenBrightness} title='getScreenBrightness' color='#19AD1A' />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={handleSetKeepScreenOn} title='setKeepScreenOn' color='#19AD1A' />
      </View>
    </View>
  )
}

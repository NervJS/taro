import { Dimensions } from 'react-native'
import { onAndSyncApis, noPromiseApis, otherApis, initPxTransform } from '@tarojs/taro'
import request from './api/request'
import storage from './api/storage'
import system from './api/system'
import network from './api/device/network'
import clipboard from './api/device/clipboard'
import phone from './api/device/phone'
import screen from './api/device/screen'
import vibrate from './api/device/vibrate'
import * as accelerometer from './api/accelerometer'
import deviceMotion from './api/device/deviceMotion'
import others from './api/others'
import * as media from './api/media'
import * as file from './api/file'
import webSocket from './api/webSocket'
import location from './api/location'
import * as toast from './api/interface'
import * as image from './api/image'
import web from './api/web'

function processApis (taro) {
  const weApis = Object.assign({}, onAndSyncApis, noPromiseApis, otherApis)
  Object.keys(weApis).forEach(key => {
    taro[key] = () => {
      console.log(`暂时不支持 ${key}`)
    }
  })
}

function pxTransform (size) {
  const deviceWidthDp = Dimensions.get('window').width
  const uiWidthPx = 375
  const {designWidth, deviceRatio} = this.config
  if (!(designWidth in deviceRatio)) {
    throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
  }
  const rateSize = parseInt(size, 10) / (deviceRatio[designWidth] * 2)
  return rateSize * deviceWidthDp / uiWidthPx
}

function getApp (taro) {
  return this._$app
}

export default function initNativeApi (taro) {
  processApis(taro)
  taro.initPxTransform = initPxTransform.bind(taro)
  taro.pxTransform = pxTransform.bind(taro)
  taro.getApp = getApp.bind(taro)
  Object.assign(
    taro,
    request,
    storage,
    system,
    network,
    clipboard,
    phone,
    screen,
    web,
    vibrate,
    accelerometer,
    deviceMotion,
    media,
    file,
    webSocket,
    location,
    toast,
    image,
    others
  )
}

import { onAndSyncApis, noPromiseApis, otherApis, initPxTransform } from '@tarojs/taro'
import request from './api/request'
import storage from './api/storage'
import system from './api/system'
import network from './api/device/network'
import clipboard from './api/device/clipboard'
import phone from './api/device/phone'
import vibrate from './api/device/vibrate'
// import accelerometer from './api/device/accelerometer'
// import deviceMotion from './api/device/deviceMotion'
import others from './api/others'
// import media from './api/media'
// import file from './api/file'
import webSocket from './api/webSocket'
// import geolocation from './api/geolocation'
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
  const {designWidth, deviceRatio} = this.config
  if (!(designWidth in deviceRatio)) {
    throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
  }
  return parseInt(size, 10) / (deviceRatio[designWidth] * 2)
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
    web,
    vibrate,
    // accelerometer,
    // deviceMotion,
    // media,
    // file,
    webSocket,
    // geolocation,
    toast,
    image,
    others
  )
}

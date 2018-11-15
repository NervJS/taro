import { onAndSyncApis, noPromiseApis, otherApis, initPxTransform } from '@tarojs/taro'
import request from './api/request'
import storage from './api/storage'
import system from './api/system'
import network from './api/network'
import clipboard from './api/clipboard'
import phone from './api/phone'
import vibrate from './api/vibrate'
import others from './api/others'
import media from './api/media'
import webSocket from './api/webSocket'
import geolocation from './api/geolocation'
import toast from './api/WxToast'
import showModal from './api/WxModal'
import showActionSheet from './api/WxActionSheet'
import previewImage from './api/WxPreviewImage'

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
  return parseInt(size, 10) / deviceRatio[designWidth] * 2
}

export default function initNativeApi (taro) {
  processApis(taro)
  taro.initPxTransform = initPxTransform.bind(taro)
  taro.pxTransform = pxTransform.bind(taro)
  Object.assign(
    taro,
    request,
    storage,
    system,
    network,
    clipboard,
    phone,
    vibrate,
    media,
    webSocket,
    geolocation,
    toast,
    showModal,
    showActionSheet,
    previewImage,
    others
  )
}

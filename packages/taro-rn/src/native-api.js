import { onAndSyncApis, noPromiseApis, otherApis } from '@tarojs/taro'
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
import { showToast, showLoading, hideToast, hideLoading } from './api/WxToast'
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

export default function initNativeApi (taro) {
  processApis(taro)
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
    showToast,
    showLoading,
    hideToast,
    hideLoading,
    showModal,
    showActionSheet,
    previewImage,
    others
  )
}

import { onAndSyncApis, noPromiseApis, otherApis, initPxTransform } from '@tarojs/taro'
import { createSelectorQuery } from './api/createSelectorQuery'
import request from './api/request'
import * as storage from './api/storage'
import * as interactive from './api/interactive'
import webSocket from './api/webSocket'
import * as system from './api/system'

function processApis (taro) {
  const weApis = Object.assign({ }, onAndSyncApis, noPromiseApis, otherApis)
  Object.keys(weApis).forEach(key => {
    taro[key] = () => {
      console.log(`暂时不支持 ${key}`)
    }
  })
}

function pxTransform (size) {
  const { designWidth } = this.config
  return Math.ceil((parseInt(size, 10) / 40 * 640 / designWidth) * 10000) / 10000 + 'rem'
}

function canIUseWebp () {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

export default function initNativeApi (taro) {
  processApis(taro)
  taro.request = request
  taro.createSelectorQuery = createSelectorQuery
  taro.initPxTransform = initPxTransform.bind(taro)
  taro.pxTransform = pxTransform.bind(taro)
  taro.requirePlugin = function () {
    console.error('不支持 API requirePlugin')
  }
  taro.canIUseWebp = canIUseWebp
  Object.assign(taro, storage, interactive, webSocket, system)
}

import { onAndSyncApis, noPromiseApis, otherApis } from '@tarojs/taro'
import request from './api/request'

function processApis (taro) {
  const weApis = Object.assign({ }, onAndSyncApis, noPromiseApis, otherApis)
  Object.keys(weApis).forEach(key => {
    taro[key] = () => {
      console.log(`暂时不支持 ${key}`)
    }
  })
}

function canIUseWebp () {
  return true
}

export default function initNativeApi (taro) {
  processApis(taro)
  taro.request = request
  taro.canIUseWebp = canIUseWebp
}

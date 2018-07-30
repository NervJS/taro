import 'whatwg-fetch'

import { onAndSyncApis, noPromiseApis, otherApis } from '@tarojs/taro'
import { createSelectorQuery } from './api/createSelectorQuery'
import request from './api/request'
import * as storage from './api/storage'
import * as interactive from './api/interactive'
import webSocket from './api/webSocket'

function processApis (taro) {
  const weApis = Object.assign({ }, onAndSyncApis, noPromiseApis, otherApis)
  Object.keys(weApis).forEach(key => {
    taro[key] = () => {
      console.log(`暂时不支持 ${key}`)
    }
  })
}

export default function initNativeApi (taro) {
  processApis(taro)
  taro.request = request
  taro.createSelectorQuery = createSelectorQuery
  Object.assign(taro, storage, interactive, webSocket)
}

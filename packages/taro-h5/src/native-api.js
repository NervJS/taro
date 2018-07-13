import 'whatwg-fetch'
import jsonpRetry from 'jsonp-retry'

import { onAndSyncApis, noPromiseApis, otherApis } from '@tarojs/taro'
import { serializeParams } from './util'
import { createSelectorQuery } from './api/createSelectorQuery'
import * as storage from './api/storage'
import * as interactive from './api/interactive'
import webSocket from './api/webSocket'

function generateRequestUrlWithParams (url, params) {
  params = typeof params === 'string' ? params : serializeParams(params)
  url += (~url.indexOf('?') ? '&' : '?') + `${params}`
  url = url.replace('?&', '?')
  return url
}

function request (options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  let url = options.url
  const params = {}
  const res = {}
  if (options.jsonp) {
    params.params = options.data
    params.cache = options.jsonpCache
    if (typeof options.jsonp === 'string') {
      params.name = options.jsonp
    }
    return jsonpRetry(url, params)
      .then(data => {
        res.statusCode = 200
        res.data = data
        return res
      })
  }
  params.method = options.method || 'GET'
  const methodUpper = params.method.toUpperCase()
  params.cache = options.cache || 'default'
  if (methodUpper === 'GET' || methodUpper === 'HEAD') {
    url = generateRequestUrlWithParams(url, options.data)
  } else {
    params.body = options.data
  }
  if (options.header) {
    params.headers = options.header
  }
  if (options.mode) {
    params.mode = options.mode
  }
  params.credentials = options.credentials
  return fetch(url, params)
    .then(response => {
      res.statusCode = response.status
      res.header = {}
      response.headers.forEach((val, key) => {
        res.header[key] = val
      })
      if (options.responseType === 'arraybuffer') {
        return response.arrayBuffer()
      }
      if (options.dataType === 'json' || typeof options.dataType === 'undefined') {
        return response.json()
      }
      if (options.responseType === 'text') {
        return response.text()
      }
      return Promise.resolve(null)
    }).then(data => {
      res.data = data
      return res
    })
}

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

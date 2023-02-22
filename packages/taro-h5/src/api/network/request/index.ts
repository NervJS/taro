/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import 'whatwg-fetch'

import Taro from '@tarojs/api'
import { isFunction } from '@tarojs/shared'
import jsonpRetry from 'jsonp-retry'

import { serializeParams } from '../../../utils'

// @ts-ignore
const { Link } = Taro

function generateRequestUrlWithParams (url: string, params?: unknown) {
  params = typeof params === 'string' ? params : serializeParams(params)
  if (params) {
    url += (~url.indexOf('?') ? '&' : '?') + params
  }
  url = url.replace('?&', '?')
  return url
}

// FIXME 移除 any 标注
function _request (options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  const { success, complete, fail } = options
  let url = options.url
  const params: any = {}
  const res: any = {}
  if (options.jsonp) {
    Object.assign(params, options)
    params.params = options.data
    params.cache = options.jsonpCache
    if (typeof options.jsonp === 'string') {
      params.name = options.jsonp
    }
    delete params.jsonp
    return jsonpRetry(url, params)
      .then(data => {
        res.statusCode = 200
        res.data = data
        isFunction(success) && success(res)
        isFunction(complete) && complete(res)
        return res
      })
      .catch(err => {
        isFunction(fail) && fail(err)
        isFunction(complete) && complete(res)
        return Promise.reject(err)
      })
  }
  params.method = options.method || 'GET'
  const methodUpper = params.method.toUpperCase()
  params.cache = options.cache || 'default'
  if (methodUpper === 'GET' || methodUpper === 'HEAD') {
    url = generateRequestUrlWithParams(url, options.data)
  } else if (Object.prototype.toString.call(options.data) === '[object Object]') {
    options.header = options.header || {}

    const keyOfContentType = Object.keys(options.header).find(item => item.toLowerCase() === 'content-type')
    if (!keyOfContentType) {
      options.header['Content-Type'] = 'application/json'
    }
    const contentType = options.header[keyOfContentType || 'Content-Type']

    if (contentType.indexOf('application/json') >= 0) {
      params.body = JSON.stringify(options.data)
    } else if (contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
      params.body = serializeParams(options.data)
    } else {
      params.body = options.data
    }
  } else {
    params.body = options.data
  }
  if (options.header) {
    params.headers = options.header
  }
  if (options.mode) {
    params.mode = options.mode
  }
  if (options.signal) {
    params.signal = options.signal
  }
  params.credentials = options.credentials
  return fetch(url, params)
    .then(response => {
      if (!response) {
        const errorResponse = { ok: false }
        throw errorResponse
      }
      res.statusCode = response.status
      res.header = {}
      for (const key of response.headers.keys()) {
        res.header[key] = response.headers.get(key)
      }
      if (options.responseType === 'arraybuffer') {
        return response.arrayBuffer()
      }
      if (res.statusCode !== 204) {
        if (options.dataType === 'json' || typeof options.dataType === 'undefined') {
          return response.json().catch(() => {
            return null
          })
        }
      }
      if (options.responseType === 'text' || options.dataType === 'text') {
        return response.text()
      }
      return Promise.resolve(null)
    })
    .then(data => {
      res.data = data
      isFunction(success) && success(res)
      isFunction(complete) && complete(res)
      return res
    })
    .catch(err => {
      isFunction(fail) && fail(err)
      isFunction(complete) && complete(res)
      err.statusCode = res.statusCode
      err.errMsg = err.message
      return Promise.reject(err)
    })
}

function taroInterceptor (chain) {
  return _request(chain.requestParams)
}

const link = new Link(taroInterceptor)

export const request: typeof Taro.request = link.request.bind(link)
export const addInterceptor = link.addInterceptor.bind(link)

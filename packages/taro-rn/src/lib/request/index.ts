/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { errorHandler, successHandler } from "../../utils"

function serializeParams(params) {
  if (!params) {
    return ''
  }
  return Object.keys(params)
    .map(key => (`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)).join('&')
}

function generateRequestUrlWithParams(url, params) {
  params = typeof params === 'string' ? params : serializeParams(params)
  url += (~url.indexOf('?') ? '&' : '?') + params
  url = url.replace('?&', '?')
  return url
}

function _request<T = any>(options: Taro.request.Option): Taro.RequestTask<T> {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  let url = options.url
  let data = options.data || {}
  const params: any = {}
  const res: any = {}
  let method: any = options.method || 'GET'
  method = method.toUpperCase()

  if (method === 'GET') {
    url = generateRequestUrlWithParams(url, data)
  } else {
    if (typeof data === 'object') {
      const contentType = options.header && (options.header['content-type'] || options.header['Content-Type']) || 'application/json'
      if (contentType.startsWith('application/json')) {
        data = JSON.stringify(data)
      } else if (contentType.startsWith('application/x-www-form-urlencoded')) {
        data = serializeParams(data)
      }
    }
  }

  if (method !== 'GET' && method !== 'HEAD') {
    params.body = data
  }

  params.headers = options.header
  params.mode = options.mode
  params.credentials = options.credentials
  params.cache = options.cache
  params.method = method
  let controller
  // eslint-disable-next-line no-undef
  if (typeof(AbortController) !== 'undefined' ) {
    // eslint-disable-next-line no-undef
    controller = new AbortController()
    const signal = controller.signal
    params.signal = signal
  }

  const { success, fail, complete } = options

  const fetchPromise = fetch(url, params)
    .then(response => {
      res.statusCode = response.status
      res.header = response.headers
      if (options.dataType === 'json' || typeof options.dataType === 'undefined') {
        return response.json()
      }
      if (options.responseType === 'arraybuffer') {
        return response.arrayBuffer()
      }
      if (options.responseType === 'text') {
        return response.text()
      }
      return response
    })

  const timeoutPromise = new Promise((_resolve, reject) => {
    const timer = setTimeout(() => {
      controller?.abort()
      reject(Error('request:fail timeout'))
      clearTimeout?.(timer)
    }, options.timeout ?? 2000)
  })

  const p: any = Promise.race([fetchPromise, timeoutPromise]).then(resData => {
    res.data = resData
    return successHandler(success, complete)(res)
  }).catch(err => {
    res.errMsg = err.message
    return errorHandler(fail, complete)(res)
  })

  p.abort = function () {
    if (controller) {
      controller.abort()
    } else {
      console.warn('暂不支持 abort 方法')
    }
  }
  return p
}

export const request = _request

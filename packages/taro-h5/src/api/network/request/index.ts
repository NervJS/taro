import 'whatwg-fetch'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

import Taro from '@tarojs/api'
import { isFunction } from '@tarojs/shared'
import jsonpRetry from 'jsonp-retry'

import { serializeParams } from '../../../utils'
import { NETWORK_TIMEOUT } from '../utils'

interface RequestTask<T> extends Promise<T> {
  abort?: (cb?: any) => void
}

interface RequestSuccessCallbackResult {
  statusCode: number
  header: Record<string, string | null>
  data: any
  cookies?: string[]
}

interface JsonpOptions {
  params?: any
  cache?: string
  timeout?: number
  name?: string
  retry?: number
  jsonpCache?: boolean
}

// @ts-ignore
const { Link } = Taro

function generateRequestUrlWithParams (url = '', params?: unknown) {
  params = typeof params === 'string' ? params : serializeParams(params)
  if (params) {
    url += (~url.indexOf('?') ? '&' : '?') + params
  }
  url = url.replace('?&', '?')
  return url
}

function _request (options: Partial<Taro.request.Option> = {}) {
  const { success, complete, fail } = options
  const params: RequestInit = {}
  const res: Partial<RequestSuccessCallbackResult> = {}
  let {
    cache = 'default',
    credentials,
    data,
    dataType,
    header = {},
    jsonp,
    method = 'GET',
    mode,
    responseType,
    signal,
    timeout,
    url = '',
    ...opts
  } = options
  if (typeof timeout !== 'number') {
    timeout = NETWORK_TIMEOUT
  }
  Object.assign(params, opts)
  if (jsonp) {
    const jsonpParams: JsonpOptions = {
      ...params,
      params: data,
      cache: opts.jsonpCache,
      timeout: timeout,
    }
    if (typeof jsonp === 'string') {
      jsonpParams.name = jsonp
    }
    // Note: https://github.com/luckyadam/jsonp-retry
    return jsonpRetry(url, jsonpParams)
      .then(data => {
        res.statusCode = 200
        res.data = data
        isFunction(success) && success!(res as Taro.request.SuccessCallbackResult)
        isFunction(complete) && complete!(res as Partial<Taro.request.SuccessCallbackResult> & TaroGeneral.CallbackResult)
        return res as Taro.request.SuccessCallbackResult
      })
      .catch(err => {
        isFunction(fail) && fail!(err)
        isFunction(complete) && complete!(res as Partial<Taro.request.SuccessCallbackResult> & TaroGeneral.CallbackResult)
        return Promise.reject(err)
      })
  }
  params.method = method
  const methodUpper = params.method.toUpperCase()
  params.cache = cache
  if (methodUpper === 'GET' || methodUpper === 'HEAD') {
    url = generateRequestUrlWithParams(url, data)
  } else if (['[object Array]', '[object Object]'].indexOf(Object.prototype.toString.call(data)) >= 0) {
    const keyOfContentType = Object.keys(header).find(item => item.toLowerCase() === 'content-type')
    if (!keyOfContentType) {
      header['Content-Type'] = 'application/json'
    }
    const contentType = header[keyOfContentType || 'Content-Type']

    if (contentType.indexOf('application/json') >= 0) {
      params.body = JSON.stringify(data)
    } else if (contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
      params.body = serializeParams(data)
    } else {
      params.body = data
    }
  } else {
    params.body = data
  }
  if (header) {
    params.headers = header
  }
  if (mode) {
    params.mode = mode
  }
  let timeoutTimer: ReturnType<typeof setTimeout> | null = null
  let controller: AbortController | null = null
  if (signal) {
    params.signal = signal
  } else {
    controller = new window.AbortController()
    params.signal = controller.signal
    timeoutTimer = setTimeout(function () {
      if (controller) controller.abort()
    }, timeout)
  }
  params.credentials = credentials
  const p: RequestTask<Taro.request.SuccessCallbackResult> = fetch(url, params)
    .then(response => {
      if (timeoutTimer) {
        clearTimeout(timeoutTimer)
        timeoutTimer = null
      }
      if (controller) {
        controller = null
      }
      if (!response) {
        const errorResponse = { ok: false }
        throw errorResponse
      }
      res.statusCode = response.status
      res.header = {}
      for (const key of response.headers.keys()) {
        res.header[key] = response.headers.get(key)
      }
      if (responseType === 'arraybuffer') {
        return response.arrayBuffer()
      }
      if (res.statusCode !== 204) {
        if (dataType === 'json' || typeof dataType === 'undefined') {
          return response.json().catch(() => {
            return null
          })
        }
      }
      if (responseType === 'text' || dataType === 'text') {
        return response.text()
      }
      return Promise.resolve(null)
    })
    .then(data => {
      res.data = data
      isFunction(success) && success!(res as Taro.request.SuccessCallbackResult)
      isFunction(complete) && complete!(res as Partial<Taro.request.SuccessCallbackResult> & TaroGeneral.CallbackResult)
      return res as Taro.request.SuccessCallbackResult
    })
    .catch(err => {
      if (timeoutTimer) {
        clearTimeout(timeoutTimer)
        timeoutTimer = null
      }
      if (controller) {
        controller = null
      }
      isFunction(fail) && fail!(err)
      isFunction(complete) && complete!(res as Partial<Taro.request.SuccessCallbackResult> & TaroGeneral.CallbackResult)
      err.statusCode = res.statusCode
      err.errMsg = err.message
      return Promise.reject(err)
    })
  if (!p.abort && controller) {
    p.abort = cb => {
      if (controller) {
        cb && cb()
        controller.abort()
        if (timeoutTimer) {
          clearTimeout(timeoutTimer)
          timeoutTimer = null
        }
      }
    }
  }
  return p
}

function taroInterceptor (chain) {
  return _request(chain.requestParams)
}

const link = new Link(taroInterceptor)

export const request = (<T extends Partial<Taro.request.Option> = TaroGeneral.IAnyObject>(...args: [string | T, T]) => {
  const [url = '', options = {} as T] = args
  if (typeof url === 'string') {
    options.url = url
  } else {
    Object.assign(options, url)
  }
  return link.request(options)
}) as typeof Taro.request
export const addInterceptor = link.addInterceptor.bind(link)
export const cleanInterceptors = link.cleanInterceptors.bind(link)

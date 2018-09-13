import jsonpRetry from 'jsonp-retry'
import 'whatwg-fetch'
import { serializeParams } from '../utils'

function generateRequestUrlWithParams (url, params) {
  params = typeof params === 'string' ? params : serializeParams(params)
  url += (~url.indexOf('?') ? '&' : '?') + params
  url = url.replace('?&', '?')
  return url
}

export default function request (options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  const { success, complete, fail } = options
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
        typeof success === 'function' && success(res)
        typeof complete === 'function' && complete(res)
        return res
      })
      .catch(err => {
        typeof fail === 'function' && fail(err)
        typeof complete === 'function' && complete(res)
        return Promise.reject(err)
      })
  }
  params.method = options.method || 'GET'
  const methodUpper = params.method.toUpperCase()
  params.cache = options.cache || 'default'
  if (methodUpper === 'GET' || methodUpper === 'HEAD') {
    url = generateRequestUrlWithParams(url, options.data)
  } else if (methodUpper === 'POST' && typeof options.data === 'object') {
    let contentType = options.header && (options.header['Content-Type'] || options.header['content-type'])
    if (contentType === 'application/json') {
      params.body = JSON.stringify(options.data)
    } else if (contentType === 'application/x-www-form-urlencoded') {
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
    })
    .then(data => {
      res.data = data
      typeof success === 'function' && success(res)
      typeof complete === 'function' && complete(res)
      return res
    })
    .catch(err => {
      typeof fail === 'function' && fail(err)
      typeof complete === 'function' && complete(res)
      return Promise.reject(err)
    })
}

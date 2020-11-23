// import { Link } from '@tarojs/taro'

function serializeParams (params) {
  if (!params) {
    return ''
  }
  return Object.keys(params)
    .map(key => (`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)).join('&')
}

function generateRequestUrlWithParams (url, params) {
  params = typeof params === 'string' ? params : serializeParams(params)
  url += (~url.indexOf('?') ? '&' : '?') + params
  url = url.replace('?&', '?')
  return url
}

function _request <T = any>(options: Taro.request.Option): Taro.RequestTask<T> {
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
      const contentType = options.header && (options.header['content-type'] || options.header['Content-Type'])
      if (contentType === 'application/json') {
        data = JSON.stringify(data)
      } else if (contentType === 'application/x-www-form-urlencoded') {
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
  if (AbortController) {
    // eslint-disable-next-line no-undef
    controller = new AbortController()
    const signal = controller.signal
    params.signal = signal
  }

  const originSuccess = options.success
  const originFail = options.fail
  const originComplete = options.complete
  let completeRes
  const p: any = new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    fetch(url, params)
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
      .then(resData => {
        res.data = resData
        completeRes = Object.assign({}, res)
        originSuccess && originSuccess(res)
        resolve(res)
      })
      .catch(error => {
        completeRes = error.message === 'Aborted' ? { code: 20, message: 'Aborted', name: 'AbortError' } : Object.assign({}, error)
        originFail && originFail(error)
        reject(error)
      })
      .finally(() => {
        originComplete && originComplete(completeRes)
      })
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

// function taroInterceptor (chain) {
//   return _request(chain.requestParams)
// }

// const link = new Link(taroInterceptor)

// export const request = link.request.bind(link)
// export const addInterceptor = link.addInterceptor.bind(link)

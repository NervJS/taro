import {
  queryToJson,
  getUniqueKey,
  cacheDataSet
} from '@tarojs/shared'

declare const jd: any
declare const getCurrentPages: () => any
declare const getApp: () => any

const RequestQueue = {
  MAX_REQUEST: 5,
  queue: [],
  request (options) {
    this.push(options)
    // 返回request task
    return this.run()
  },

  push (options) {
    this.queue.push(options)
  },

  run () {
    if (!this.queue.length) {
      return
    }
    if (this.queue.length <= this.MAX_REQUEST) {
      const options = this.queue.shift()
      const completeFn = options.complete
      options.complete = (...args) => {
        completeFn && completeFn.apply(options, args)
        this.run()
      }
      return jd.request(options)
    }
  }
}

function taroInterceptor (chain) {
  return request(chain.requestParams)
}

function request (options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  const originSuccess = options.success
  const originFail = options.fail
  const originComplete = options.complete
  let requestTask
  const p: any = new Promise((resolve, reject) => {
    options.success = res => {
      originSuccess && originSuccess(res)
      resolve(res)
    }
    options.fail = res => {
      originFail && originFail(res)
      reject(res)
    }

    options.complete = res => {
      originComplete && originComplete(res)
    }

    requestTask = RequestQueue.request(options)
  })
  p.abort = (cb) => {
    cb && cb()
    if (requestTask) {
      requestTask.abort()
    }
    return p
  }
  return p
}

function processApis (taro) {
  const { onAndSyncApis, noPromiseApis, otherApis } = taro
  const apis = [...onAndSyncApis, ...noPromiseApis, ...otherApis]
  const useDataCacheApis = {
    navigateTo: true,
    redirectTo: true,
    reLaunch: true
  }
  const routerParamsPrivateKey = '__key_'
  apis.forEach(key => {
    if (!(key in jd)) {
      taro[key] = () => {
        console.warn(`京东小程序暂不支持 ${key}`)
      }
      return
    }

    if (otherApis.has(key)) {
      taro[key] = (options, ...args) => {
        options = options || {}
        let task: any = null
        const obj = Object.assign({}, options)
        if (typeof options === 'string') {
          if (args.length) {
            return jd[key](options, ...args)
          }
          return jd[key](options)
        }

        if (key === 'navigateTo' || key === 'redirectTo' || key === 'switchTab') {
          let url = obj.url ? obj.url.replace(/^\//, '') : ''
          if (url.indexOf('?') > -1) url = url.split('?')[0]
        }

        if (useDataCacheApis[key]) {
          const url = obj.url = obj.url || ''
          const MarkIndex = url.indexOf('?')
          const hasMark = MarkIndex > -1
          const urlQueryStr = hasMark ? url.substring(MarkIndex + 1, url.length) : ''
          const params = queryToJson(urlQueryStr)
          const cacheKey = getUniqueKey()
          obj.url += (hasMark ? '&' : '?') + `${routerParamsPrivateKey}=${cacheKey}`
          cacheDataSet(cacheKey, params)
        }

        const p: any = new Promise((resolve, reject) => {
          ['fail', 'success', 'complete'].forEach((k) => {
            obj[k] = (res) => {
              options[k] && options[k](res)
              if (k === 'success') {
                if (key === 'connectSocket') {
                  resolve(
                    Promise.resolve().then(() => Object.assign(task, res))
                  )
                } else {
                  resolve(res)
                }
              } else if (k === 'fail') {
                reject(res)
              }
            }
          })
          if (args.length) {
            task = jd[key](obj, ...args)
          } else {
            task = jd[key](obj)
          }
        })
        if (key === 'uploadFile' || key === 'downloadFile') {
          p.progress = cb => {
            if (task) {
              task.onProgressUpdate(cb)
            }
            return p
          }
          p.abort = cb => {
            cb && cb()
            if (task) {
              task.abort()
            }
            return p
          }
        }
        return p
      }
    } else {
      taro[key] = (...args) => {
        const argsLen = args.length
        const newArgs = args.concat()
        const lastArg = newArgs[argsLen - 1]
        if (lastArg && lastArg.isTaroComponent && lastArg.$scope) {
          newArgs.splice(argsLen - 1, 1, lastArg.$scope)
        }
        return jd[key].apply(jd, newArgs)
      }
    }
  })
}

function pxTransform (size) {
  const {
    designWidth = 750,
    deviceRatio = {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2
    }
  } = this.config || {}
  if (!(designWidth in deviceRatio)) {
    throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
  }
  return (parseInt(size, 10) * deviceRatio[designWidth]) + 'rpx'
}

function canIUseWebp () {
  const { platform = '' } = jd.getSystemInfoSync()
  const platformLower = platform.toLowerCase()
  if (platformLower === 'android' || platformLower === 'devtools') {
    return true
  }
  return false
}

function jdCloud (taro) {
  const jdC = jd.cloud || {}
  const jdcloud = {}
  const apiList = [
    'init',
    'database',
    'uploadFile',
    'downloadFile',
    'getTempFileURL',
    'deleteFile',
    'callFunction',
    'CloudID'
  ]
  apiList.forEach(v => {
    jdcloud[v] = jdC[v]
  })
  taro.cloud = jdcloud
}

function getPreload (taro) {
  return function (key, val) {
    if (typeof key === 'object') {
      taro.preloadData = key
    } else if (key !== undefined && val !== undefined) {
      taro.preloadData = {
        [key]: val
      }
    }
  }
}

export function initNativeApi (taro) {
  processApis(taro)
  const link = new taro.Link(taroInterceptor)
  taro.request = link.request.bind(link)
  taro.addInterceptor = link.addInterceptor.bind(link)
  taro.cleanInterceptors = link.cleanInterceptors.bind(link)
  taro.getCurrentPages = getCurrentPages
  taro.getApp = getApp
  taro.initPxTransform = taro.initPxTransform.bind(taro)
  taro.pxTransform = pxTransform.bind(taro)
  taro.canIUseWebp = canIUseWebp
  taro.preload = getPreload(taro)
  taro.env = jd.env
  jdCloud(taro)
}

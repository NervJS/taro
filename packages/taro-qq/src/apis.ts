import {
  queryToJson,
  getUniqueKey,
  cacheDataSet,
  cacheDataGet
} from '@tarojs/shared'
import {
  _onAndSyncApis as wxOnAndSyncApis,
  _noPromiseApis as wxNoPromiseApis,
  _otherApis as wxOtherApis
} from '@tarojs/plugin-platform-weapp/dist/runtime-utils'

declare const qq: any
declare const getCurrentPages: () => any
declare const getApp: () => any
declare const requirePlugin: () => void

const _noPromiseApis = new Set([
  'createAppBox'
])

const _otherApis = new Set([
  'getQQRunData',
  'requestWxPayment',
  'setAvatar',
  'shareInvite',
  'updateBookshelfReadTime'
])

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
      return qq.request(options)
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
  const onAndSyncApis = new Set([...taro.onAndSyncApis, ...wxOnAndSyncApis])
  const noPromiseApis = new Set([...taro.noPromiseApis, ...wxNoPromiseApis, ..._noPromiseApis])
  const otherApis = new Set([...taro.otherApis, ...wxOtherApis, ..._otherApis])
  const apis = [...onAndSyncApis, ...noPromiseApis, ...otherApis]
  const useDataCacheApis = {
    navigateTo: true,
    redirectTo: true,
    reLaunch: true
  }
  const routerParamsPrivateKey = '__key_'
  const preloadPrivateKey = '__preload_'
  const preloadInitedComponent = '$preloadComponent'
  apis.forEach(key => {
    if (!(key in qq)) {
      taro[key] = () => {
        console.warn(`QQ 小程序暂不支持 ${key}`)
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
            return qq[key](options, ...args)
          }
          return qq[key](options)
        }

        if (key === 'navigateTo' || key === 'redirectTo' || key === 'switchTab') {
          let url = obj.url ? obj.url.replace(/^\//, '') : ''
          if (url.indexOf('?') > -1) url = url.split('?')[0]

          const Component = cacheDataGet(url)
          if (Component) {
            const component = new Component()
            if (component.componentWillPreload) {
              const cacheKey = getUniqueKey()
              const MarkIndex = obj.url.indexOf('?')
              const hasMark = MarkIndex > -1
              const urlQueryStr = hasMark ? obj.url.substring(MarkIndex + 1, obj.url.length) : ''
              const params = queryToJson(urlQueryStr)
              obj.url += (hasMark ? '&' : '?') + `${preloadPrivateKey}=${cacheKey}`
              cacheDataSet(cacheKey, component.componentWillPreload(params))
              cacheDataSet(preloadInitedComponent, component)
            }
          }
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
            task = qq[key](obj, ...args)
          } else {
            task = qq[key](obj)
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
        return qq[key].apply(qq, newArgs)
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
  const { platform } = qq.getSystemInfoSync()
  const platformLower = platform.toLowerCase()
  if (platformLower === 'android' || platformLower === 'devtools') {
    return true
  }
  return false
}

function qqCloud (taro) {
  const qqC = qq.cloud || {}
  const qqcloud = {}
  const apiList = [
    'init',
    'database',
    'uploadFile',
    'downloadFile',
    'getTempFileURL',
    'deleteFile',
    'callFunction'
  ]
  apiList.forEach(v => {
    qqcloud[v] = qqC[v]
  })
  taro.cloud = qqcloud
}

export function initNativeApi (taro) {
  processApis(taro)
  const link = new taro.Link(taroInterceptor)
  taro.request = link.request.bind(link)
  taro.addInterceptor = link.addInterceptor.bind(link)
  taro.cleanInterceptors = link.cleanInterceptors.bind(link)
  taro.getCurrentPages = getCurrentPages
  taro.getApp = getApp
  taro.requirePlugin = requirePlugin
  taro.initPxTransform = taro.initPxTransform.bind(taro)
  taro.pxTransform = pxTransform.bind(taro)
  taro.canIUseWebp = canIUseWebp
  qqCloud(taro)
}

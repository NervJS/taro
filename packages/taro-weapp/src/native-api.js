import {
  onAndSyncApis,
  noPromiseApis,
  otherApis,
  initPxTransform,
  Link
} from '@tarojs/taro'
import { cacheDataSet, cacheDataGet } from './data-cache'
import { queryToJson, getUniqueKey } from './util'
const RequestQueue = {
  MAX_REQUEST: 10,
  queue: [],
  pendingQueue: [],

  request (options) {
    this.queue.push(options)
    return this.run()
  },

  run () {
    if (!this.queue.length) return

    while (this.pendingQueue.length < this.MAX_REQUEST) {
      const options = this.queue.shift()
      let successFn = options.success
      let failFn = options.fail
      options.success = (...args) => {
        this.pendingQueue = this.pendingQueue.filter(item => item !== options)
        this.run()
        successFn && successFn.apply(options, args)
      }
      options.fail = (...args) => {
        this.pendingQueue = this.pendingQueue.filter(item => item !== options)
        this.run()
        failFn && failFn.apply(options, args)
      }
      this.pendingQueue.push(options)
      return wx.request(options)
    }
  }
}

function taroInterceptor (chain) {
  return request(chain.requestParams)
}

const link = new Link(taroInterceptor)

function request (options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  const originSuccess = options['success']
  const originFail = options['fail']
  const originComplete = options['complete']
  let requestTask
  const p = new Promise((resolve, reject) => {
    options['success'] = res => {
      originSuccess && originSuccess(res)
      resolve(res)
    }
    options['fail'] = res => {
      originFail && originFail(res)
      reject(res)
    }

    options['complete'] = res => {
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
  const weApis = Object.assign({ }, onAndSyncApis, noPromiseApis, otherApis)
  const useDataCacheApis = {
    'navigateTo': true,
    'redirectTo': true,
    'reLaunch': true
  }
  const routerParamsPrivateKey = '__key_'
  const preloadPrivateKey = '__preload_'
  const preloadInitedComponent = '$preloadComponent'
  Object.keys(weApis).forEach(key => {
    if (!(key in wx)) {
      taro[key] = () => {
        console.warn(`微信小程序暂不支持 ${key}`)
      }
      return
    }

    if (!onAndSyncApis[key] && !noPromiseApis[key]) {
      taro[key] = (options, ...args) => {
        options = options || {}
        let task = null
        let obj = Object.assign({}, options)
        if (typeof options === 'string') {
          if (args.length) {
            return wx[key](options, ...args)
          }
          return wx[key](options)
        }

        if (key === 'navigateTo' || key === 'redirectTo') {
          let url = obj['url'] ? obj['url'].replace(/^\//, '') : ''
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
          const url = obj['url'] = obj['url'] || ''
          const MarkIndex = url.indexOf('?')
          const hasMark = MarkIndex > -1
          const urlQueryStr = hasMark ? url.substring(MarkIndex + 1, url.length) : ''
          const params = queryToJson(urlQueryStr)
          const cacheKey = getUniqueKey()
          obj.url += (hasMark ? '&' : '?') + `${routerParamsPrivateKey}=${cacheKey}`
          cacheDataSet(cacheKey, params)
        }

        const p = new Promise((resolve, reject) => {
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
            task = wx[key](obj, ...args)
          } else {
            task = wx[key](obj)
          }
        })
        if (key === 'uploadFile' || key === 'downloadFile') {
          p.progress = cb => {
            if (task) {
              task.onProgressUpdate(cb)
            }
            return p
          }
          p.headersReceived = cb => {
            if (task) {
              task.onHeadersReceived(cb)
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
        return wx[key].apply(wx, newArgs)
      }
    }
  })
}

function pxTransform (size) {
  const {
    designWidth = 750,
    deviceRatio = {
      '640': 2.34 / 2,
      '750': 1,
      '828': 1.81 / 2
    }
  } = this.config || {}
  if (!(designWidth in deviceRatio)) {
    throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
  }
  return parseInt(size, 10) / deviceRatio[designWidth] + 'rpx'
}

function canIUseWebp () {
  const { platform } = wx.getSystemInfoSync()
  const platformLower = platform.toLowerCase()
  if (platformLower === 'android' || platformLower === 'devtools') {
    return true
  }
  return false
}

function wxCloud (taro) {
  const wxC = wx.cloud || {}
  const wxcloud = {}
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
    wxcloud[v] = wxC[v]
  })
  taro.cloud = wxcloud
}

function wxEnvObj (taro) {
  const wxEnv = wx.env || {}
  const taroEnv = {}
  const envList = ['USER_DATA_PATH']
  envList.forEach(key => taroEnv[key] = wxEnv[key])
  taro.env = taroEnv
}

export default function initNativeApi (taro) {
  processApis(taro)
  taro.request = link.request.bind(link)
  taro.addInterceptor = link.addInterceptor.bind(link)
  taro.cleanInterceptors = link.cleanInterceptors.bind(link)
  taro.getCurrentPages = getCurrentPages
  taro.getApp = getApp
  taro.requirePlugin = requirePlugin
  taro.initPxTransform = initPxTransform.bind(taro)
  taro.pxTransform = pxTransform.bind(taro)
  taro.canIUseWebp = canIUseWebp
  wxCloud(taro)
  wxEnvObj(taro)
}

import {
  onAndSyncApis,
  noPromiseApis,
  otherApis,
  initPxTransform,
  Link
} from '@tarojs/taro'
import { cacheDataSet, cacheDataGet } from './data-cache'
import { queryToJson, getUniqueKey } from './util'

const apiDiff = {
  showActionSheet: {
    options: {
      change: [{
        old: 'itemList',
        new: 'items'
      }]
    }
  },
  showToast: {
    options: {
      change: [{
        old: 'title',
        new: 'content'
      }, {
        old: 'icon',
        new: 'type'
      }]
    }
  },
  showLoading: {
    options: {
      change: [{
        old: 'title',
        new: 'content'
      }]
    }
  },
  setNavigationBarTitle: {
    alias: 'setNavigationBar'
  },
  setNavigationBarColor: {
    alias: 'setNavigationBar'
  },
  saveImageToPhotosAlbum: {
    alias: 'saveImage',
    options: {
      change: [{
        old: 'filePath',
        new: 'url'
      }]
    }
  },
  previewImage: {
    options: {
      set: [{
        key: 'current',
        value (options) {
          return options.urls.indexOf(options.current || options.urls[0])
        }
      }]
    }
  },
  getFileInfo: {
    options: {
      change: [{
        old: 'filePath',
        new: 'apFilePath'
      }]
    }
  },
  getSavedFileInfo: {
    options: {
      change: [{
        old: 'filePath',
        new: 'apFilePath'
      }]
    }
  },
  removeSavedFile: {
    options: {
      change: [{
        old: 'filePath',
        new: 'apFilePath'
      }]
    }
  },
  saveFile: {
    options: {
      change: [{
        old: 'tempFilePath',
        new: 'apFilePath'
      }]
    }
  },
  openLocation: {
    options: {
      set: [{
        key: 'latitude',
        value (options) {
          return String(options.latitude)
        }
      }, {
        key: 'longitude',
        value (options) {
          return String(options.longitude)
        }
      }]
    }
  },
  uploadFile: {
    options: {
      change: [{
        old: 'name',
        new: 'fileName'
      }]
    }
  },
  getClipboardData: {
    alias: 'getClipboard'
  },
  setClipboardData: {
    alias: 'setClipboard',
    options: {
      change: [{
        old: 'data',
        new: 'text'
      }]
    }
  },
  makePhoneCall: {
    options: {
      change: [{
        old: 'phoneNumber',
        new: 'number'
      }]
    }
  },
  scanCode: {
    alias: 'scan',
    options: {
      change: [{
        old: 'onlyFromCamera',
        new: 'hideAlbum'
      }],
      set: [{
        key: 'type',
        value (options) {
          return (options.scanType && options.scanType[0].slice(0, -4)) || 'qr'
        }
      }]
    }
  },
  setScreenBrightness: {
    options: {
      change: [{
        old: 'value',
        new: 'brightness'
      }]
    }
  }
}

const nativeRequest = my.canIUse('request') ? my.request : my.httpRequest

const RequestQueue = {
  MAX_REQUEST: 5,
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
      return nativeRequest(options)
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
  const defaultHeaders = {
    'content-type': 'application/json'
  }
  options['headers'] = defaultHeaders
  if (options['header']) {
    for (const k in options['header']) {
      const lowerK = k.toLocaleLowerCase()
      options['headers'][lowerK] = options['header'][k]
    }
    delete options['header']
  }
  const originSuccess = options['success']
  const originFail = options['fail']
  const originComplete = options['complete']
  let requestTask, completeRes
  const p = new Promise((resolve, reject) => {
    options['success'] = res => {
      res.statusCode = res.status
      delete res.status
      res.header = res.headers
      delete res.headers
      res.errMsg = 'request:ok'
      // 避免支付宝complete回调参数为undefined
      completeRes = res
      originSuccess && originSuccess(res)
      resolve(res)
    }
    options['fail'] = res => {
      // 将支付宝fail code(11: 无权跨域, 19: HTTP错误) 转为success回调 和微信保持一致
      if (res.error && [11, 19].indexOf(res.error) !== -1) {
        res.statusCode = res.status
        delete res.status
        res.header = res.headers
        delete res.headers
        res.errMsg = 'request:ok'
        delete res.error
        delete res.errorMessage
        // 避免支付宝complete回调参数为undefined
        completeRes = res
        originSuccess && originSuccess(res)
        resolve(res)
      } else {
        originFail && originFail(res)
        reject(res)
      }
    }

    options['complete'] = res => {
      // 避免res为undefined
      res = res || completeRes
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
  const preloadPrivateKey = '__preload_'
  const preloadInitedComponent = '$preloadComponent'
  Object.keys(weApis).forEach(key => {
    if (!onAndSyncApis[key] && !noPromiseApis[key]) {
      taro[key] = (options, ...args) => {
        const result = generateSpecialApis(key, options || {})
        const newKey = result.api
        options = result.options
        let task = null
        let obj = Object.assign({}, options)
        if (!(newKey in my)) {
          console.warn(`支付宝小程序暂不支持 ${newKey}`)
          return
        }
        if (typeof options === 'string') {
          if (args.length) {
            return my[newKey](options, ...args)
          }
          return my[newKey](options)
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

        const p = new Promise((resolve, reject) => {
          ['fail', 'success', 'complete'].forEach((k) => {
            obj[k] = (res) => {
              if (k === 'success') {
                if (newKey === 'saveFile') {
                  res.savedFilePath = res.apFilePath
                } else if (newKey === 'downloadFile') {
                  res.tempFilePath = res.apFilePath
                } else if (newKey === 'chooseImage') {
                  res.tempFilePaths = res.apFilePaths
                } else if (newKey === 'getClipboard') {
                  res.data = res.text
                } else if (newKey === 'scan') {
                  res.result = res.code
                } else if (newKey === 'getScreenBrightness') {
                  res.value = res.brightness
                  delete res.brightness
                }
              }
              options[k] && options[k](res)
              if (k === 'success') {
                resolve(res)
              } else if (k === 'fail') {
                reject(res)
              }
            }
          })
          if (args.length) {
            task = my[newKey](obj, ...args)
          } else {
            task = my[newKey](obj)
          }
        })
        if (newKey === 'uploadFile' || newKey === 'downloadFile') {
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
        if (!(key in my)) {
          console.warn(`支付宝小程序暂不支持 ${key}`)
          return
        }
        if (key === 'getStorageSync') {
          const arg1 = args[0]
          if (arg1 != null) {
            return my[key]({ key: arg1 }).data || my[key]({ key: arg1 }).APDataStorage || ''
          }
          return console.log('getStorageSync 传入参数错误')
        }
        if (key === 'setStorageSync') {
          const arg1 = args[0]
          const arg2 = args[1]
          if (arg1 != null) {
            return my[key]({
              key: arg1,
              data: arg2
            })
          }
          return console.log('setStorageSync 传入参数错误')
        }
        if (key === 'removeStorageSync') {
          const arg1 = args[0]
          if (arg1 != null) {
            return my[key]({ key: arg1 })
          }
          return console.log('removeStorageSync 传入参数错误')
        }
        if (key === 'createSelectorQuery') {
          const query = my[key]()
          query.in = function () { return query }
          return query
        }
        const argsLen = args.length
        const newArgs = args.concat()
        const lastArg = newArgs[argsLen - 1]
        if (lastArg && lastArg.isTaroComponent && lastArg.$scope) {
          newArgs.splice(argsLen - 1, 1, lastArg.$scope)
        }
        return my[key].apply(my, newArgs)
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

function generateSpecialApis (api, options) {
  let apiAlias = api
  if (api === 'showModal') {
    options.cancelButtonText = options.cancelText
    options.confirmButtonText = options.confirmText || '确定'
    apiAlias = 'confirm'
    if (options.showCancel === false) {
      options.buttonText = options.confirmText || '确定'
      apiAlias = 'alert'
    }
  } else {
    Object.keys(apiDiff).forEach(item => {
      const apiItem = apiDiff[item]
      if (api === item) {
        if (apiItem.alias) {
          apiAlias = apiItem.alias
        }
        if (apiItem.options) {
          const change = apiItem.options.change
          const set = apiItem.options.set
          if (change) {
            change.forEach(changeItem => {
              options[changeItem.new] = options[changeItem.old]
            })
          }
          if (set) {
            set.forEach(setItem => {
              options[setItem.key] = typeof setItem.value === 'function' ? setItem.value(options) : setItem.value
            })
          }
        }
      }
    })
  }

  return {
    api: apiAlias,
    options
  }
}

export default function initNativeApi (taro) {
  processApis(taro)
  taro.request = link.request.bind(link)
  taro.addInterceptor = link.addInterceptor.bind(link)
  taro.cleanInterceptors = link.cleanInterceptors.bind(link)
  taro.getCurrentPages = getCurrentPages
  taro.getApp = getApp
  taro.initPxTransform = initPxTransform.bind(taro)
  taro.pxTransform = pxTransform.bind(taro)
}

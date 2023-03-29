import { processApis } from '@tarojs/shared'

import { needPromiseApis } from './apis-list'

import type { IApiDiff } from '@tarojs/shared'

declare const my: any

const apiDiff: IApiDiff = {
  login: {
    alias: 'getAuthCode',
    options: {
      set: [
        {
          key: 'scopes',
          value: 'auth_base'
        }
      ]
    }
  },

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
      }],
      set: [{
        key: 'type',
        value (options) {
          if (options.type === 'error') {
            return 'fail'
          }
          return options.type
        }
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
  },
  onBLEConnectionStateChange: {
    alias: 'onBLEConnectionStateChanged'
  },
  offBLEConnectionStateChange: {
    alias: 'offBLEConnectionStateChanged'
  },
  createBLEConnection: {
    alias: 'connectBLEDevice'
  },
  closeBLEConnection: {
    alias: 'disconnectBLEDevice'
  }
}
/**
 * 抹平API返回值的差异
 * key 为 alipay小程序中的api名称
 */
const asyncResultApiDiff = {
  getScreenBrightness: {
    res: {
      set: [
        {
          key: 'value',
          value (res) {
            return res.brightness
          }
        }
      ],
      remove: ['brightness']
    }
  },
  scan: {
    res: {
      set: [
        {
          key: 'result',
          value (res) {
            return res.code
          }
        }
      ]
    }
  },
  getClipboard: {
    res: {
      set: [
        {
          key: 'data',
          value (res) {
            return res.text
          }
        }
      ]
    }
  },
  chooseImage: {
    res: {
      set: [
        {
          key: 'tempFilePaths',
          value (res) {
            return res.apFilePaths
          }
        }
      ]
    }
  },
  downloadFile: {
    res: {
      set: [
        {
          key: 'tempFilePath',
          value (res) {
            return res.apFilePath
          }
        }
      ]
    }
  },
  getAuthCode: {
    res: {
      set: [{
        key: 'code',
        value (res) {
          return res.authCode
        }
      }]
    }
  },
  getExtConfig: {
    res: {
      set: [{
        key: 'extConfig',
        value (res) {
          return res.data
        }
      }]
    }
  },
  saveFile: {
    res: {
      set: [
        {
          key: 'savedFilePath',
          value (res) {
            return res.apFilePath
          }
        }
      ]
    }
  },
  getBLEDeviceServices: {
    res: {
      set: [
        {
          key: 'services',
          value (res) {
            return res.services.map(item => {
              return { uuid: item.serviceId, isPrimary: item.isPrimary }
            })
          }
        }
      ]
    }
  }
}

export function request (options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  const defaultHeaders = {
    'content-type': 'application/json'
  }
  options.headers = defaultHeaders
  if (options.header) {
    for (const k in options.header) {
      const lowerK = k.toLocaleLowerCase()
      options.headers[lowerK] = options.header[k]
    }
    delete options.header
  }
  const originSuccess = options.success
  const originFail = options.fail
  const originComplete = options.complete
  let requestTask
  const p: any = new Promise((resolve, reject) => {
    options.success = res => {
      res.statusCode = res.status
      delete res.status
      res.header = res.headers
      delete res.headers
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
    // 改为实时获取原生API，防止用户修改原生API后无法同步
    const nativeRequest = my.canIUse('request') ? my.request : my.httpRequest
    requestTask = nativeRequest(options)
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

export function handleSyncApis (key: string, global: Record<string, any>, args: any[]) {
  if (key === 'getStorageSync') {
    const arg1 = args[0]
    if (arg1 != null) {
      const res = global[key]({ key: arg1 })

      // 支付宝小程序遗留bug：值可能在data或APDataStorage字段下
      let data = null
      if (res.hasOwnProperty('data')) {
        data = res.data
      } else if (res.hasOwnProperty('APDataStorage')) {
        data = res.APDataStorage
      }

      return data === null ? '' : data
    }
    return console.error('getStorageSync 传入参数错误')
  }
  if (key === 'setStorageSync') {
    const arg1 = args[0]
    const arg2 = args[1]
    if (arg1 != null) {
      return global[key]({
        key: arg1,
        data: arg2
      })
    }
    return console.error('setStorageSync 传入参数错误')
  }
  if (key === 'removeStorageSync') {
    const arg1 = args[0]
    if (arg1 != null) {
      return global[key]({ key: arg1 })
    }
    return console.error('removeStorageSync 传入参数错误')
  }
  if (key === 'createSelectorQuery') {
    const query = global[key]()
    query.in = function () { return query }
    return query
  }
  return global[key].apply(global, args)
}

export function transformMeta (api: string, options: Record<string, any>) {
  let apiAlias = api
  if (api === 'showModal') {
    options.cancelButtonText = options.cancelText || '取消'
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
    key: apiAlias,
    options
  }
}

export function modifyApis (apis: Set<string>) {
  Object.keys(apiDiff).map(key => {
    apis.add(key)
    const platformKey = apiDiff[key].alias
    platformKey && apis.delete(platformKey)
  })
  apis.add('showModal')
  apis.delete('confirm')
  apis.delete('alert')
}

export function modifyAsyncResult (key: string, res) {
  if (key === 'connectSocket') {
    res.onClose = function (cb) {
      my.onSocketClose(cb)
    }

    res.onError = function (cb) {
      my.onSocketError(cb)
    }

    res.onMessage = function (cb) {
      my.onSocketMessage(cb)
    }

    res.onOpen = function (cb) {
      my.onSocketOpen(cb)
    }

    res.send = function (opt) {
      my.sendSocketMessage(opt)
    }

    res.close = function () {
      my.closeSocket()
    }
  }

  Object.keys(asyncResultApiDiff).forEach(apiKey => {
    const apiItem = asyncResultApiDiff[apiKey]
    if (key !== apiKey) {
      return
    }
    if (!apiItem.res) {
      return
    }

    const set = apiItem.res.set
    const remove = apiItem.res.remove

    if (set) {
      set.forEach(setItem => {
        res[setItem.key] = typeof setItem.value === 'function' ? setItem.value(res) : setItem.value
      })
    }

    if (remove) {
      remove.forEach(removeItem => {
        delete res[removeItem]
      })
    }
  })
}

export function initNativeApi (taro) {
  processApis(taro, my, {
    needPromiseApis,
    handleSyncApis,
    transformMeta,
    modifyApis,
    modifyAsyncResult,
    request
  })
}

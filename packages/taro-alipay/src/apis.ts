import { processApis } from '@tarojs/shared'
import { noPromiseApis, needPromiseApis } from './apis-list'

declare const my: any

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

const nativeRequest = my.canIUse('request') ? my.request : my.httpRequest

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

function handleSyncApis (key: string, global: Record<string, any>, args: any[]) {
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

function transformMeta (api: string, options: Record<string, any>) {
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

function modifyAsyncResult (key, res) {
  if (key === 'saveFile') {
    res.savedFilePath = res.apFilePath
  } else if (key === 'downloadFile') {
    res.tempFilePath = res.apFilePath
  } else if (key === 'chooseImage') {
    res.tempFilePaths = res.apFilePaths
  } else if (key === 'getClipboard') {
    res.data = res.text
  } else if (key === 'scan') {
    res.result = res.code
  } else if (key === 'getScreenBrightness') {
    res.value = res.brightness
    delete res.brightness
  }
}

export function initNativeApi (taro) {
  processApis(taro, my, {
    noPromiseApis,
    needPromiseApis,
    handleSyncApis,
    transformMeta,
    modifyAsyncResult,
    request
  })
}

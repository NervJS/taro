import {
  onAndSyncApis,
  noPromiseApis,
  otherApis,
  initPxTransform
} from '@tarojs/taro'

const apiDiff = {
  showModal: {
    alias: 'confirm',
    options: {
      change: [{
        old: 'cancelText',
        new: 'cancelButtonText'
      }, {
        old: 'confirmText',
        new: 'confirmButtonText'
      }]
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
      }]
    }
  },
  showActionSheet: {
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
  setClipboardData: {
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
          return options.scanType && options.scanType[0].slice(0, -4) || 'qr'
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

const RequestQueue = {
  MAX_REQUEST: 5,
  queue: [],
  request (options) {
    this.push(options)
    this.run()
  },

  push (options) {
    this.queue.push(options)
  },

  run () {
    if (!this.queue.length) {
      return
    }
    if (this.queue.length <= this.MAX_REQUEST) {
      let options = this.queue.shift()
      let completeFn = options.complete
      options.complete = () => {
        completeFn && completeFn.apply(options, [...arguments])
        this.run()
      }
      my.httpRequest(options)
    }
  }
}

function request (options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  if (options['header']) {
    options['headers'] = options['header']
    delete options['header']
  }
  const originSuccess = options['success']
  const originFail = options['fail']
  const originComplete = options['complete']
  const p = new Promise((resolve, reject) => {
    options['success'] = res => {
      res.statusCode = res.status
      delete res.status
      res.header = res.headers
      delete res.headers
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

    RequestQueue.request(options)
  })
  return p
}

function processApis (taro) {
  const weApis = Object.assign({ }, onAndSyncApis, noPromiseApis, otherApis)
  Object.keys(weApis).forEach(key => {
    if (!onAndSyncApis[key] && !noPromiseApis[key]) {
      taro[key] = options => {
        const result = generateSpecialApis(key, options || {})
        key = result.api
        options = result.options
        let task = null
        let obj = Object.assign({}, options)
        if (typeof options === 'string') {
          return my[key](options)
        }
        const p = new Promise((resolve, reject) => {
          ['fail', 'success', 'complete'].forEach((k) => {
            obj[k] = (res) => {
              if (k === 'success') {
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

          task = my[key](obj)
        })
        if (key === 'uploadFile' || key === 'downloadFile') {
          p.progress = cb => {
            task.onProgressUpdate(cb)
            return p
          }
          p.abort = cb => {
            cb && cb()
            task.abort()
            return p
          }
        }
        return p
      }
    } else {
      taro[key] = (...args) => {
        return my[key].apply(my, args)
      }
    }
  })
}

function pxTransform (size) {
  const { designWidth, deviceRatio } = this.config
  if (!(designWidth in deviceRatio)) {
    throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
    return
  }
  return parseInt(size, 10) / deviceRatio[designWidth] + 'rpx'
}

function generateSpecialApis (api, options) {
  let apiAlias = api
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

  return {
    api: apiAlias,
    options
  }
}

export default function initNativeApi (taro) {
  processApis(taro)
  taro.request = request
  taro.getCurrentPages = getCurrentPages
  taro.getApp = getApp
  taro.initPxTransform = initPxTransform.bind(taro)
  taro.pxTransform = pxTransform.bind(taro)
}

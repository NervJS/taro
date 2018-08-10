import {
  onAndSyncApis,
  noPromiseApis,
  otherApis,
  initPxTransform
} from '@tarojs/taro'

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
      wx.request(options)
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
  const originSuccess = options['success']
  const originFail = options['fail']
  const originComplete = options['complete']
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

    RequestQueue.request(options)
  })
  return p
}

function processApis (taro) {
  const weApis = Object.assign({ }, onAndSyncApis, noPromiseApis, otherApis)
  Object.keys(weApis).forEach(key => {
    if (!onAndSyncApis[key] && !noPromiseApis[key]) {
      taro[key] = options => {
        options = options || {}
        let task = null
        let obj = Object.assign({}, options)
        if (typeof options === 'string') {
          return wx[key](options)
        }
        const p = new Promise((resolve, reject) => {
          ['fail', 'success', 'complete'].forEach((k) => {
            obj[k] = (res) => {
              options[k] && options[k](res)
              if (k === 'success') {
                if (key === 'connectSocket') {
                  resolve(task)
                } else {
                  resolve(res)
                }
              } else if (k === 'fail') {
                reject(res)
              }
            }
          })
          task = wx[key](obj)
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
        return wx[key].apply(wx, args)
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

export default function initNativeApi (taro) {
  processApis(taro)
  taro.request = request
  taro.getCurrentPages = getCurrentPages
  taro.getApp = getApp
  taro.initPxTransform = initPxTransform.bind(taro)
  taro.pxTransform = pxTransform.bind(taro)
}

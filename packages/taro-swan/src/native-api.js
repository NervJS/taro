import {
  onAndSyncApis,
  noPromiseApis,
  otherApis,
  initPxTransform,
  Link
} from '@tarojs/taro'

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
      return swan.request(options)
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
  Object.keys(weApis).forEach(key => {
    if (!(key in swan)) {
      taro[key] = () => {
        console.warn(`百度小程序暂不支持 ${key}`)
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
            return swan[key](options, ...args)
          }
          return swan[key](options)
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
            task = swan[key](obj, ...args)
          } else {
            task = swan[key](obj)
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
        return swan[key].apply(swan, newArgs)
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

export default function initNativeApi (taro) {
  processApis(taro)
  taro.requestPayment = taro.requestPolymerPayment
  taro.request = link.request.bind(link)
  taro.addInterceptor = link.addInterceptor.bind(link)
  taro.cleanInterceptors = link.cleanInterceptors.bind(link)
  taro.getCurrentPages = getCurrentPages
  taro.getApp = getApp
  taro.initPxTransform = initPxTransform.bind(taro)
  taro.pxTransform = pxTransform.bind(taro)
}

import { isFunction, isString } from './is'
import { nonsupport, setUniqueKeyToRoute } from './utils'

declare const getCurrentPages: () => any
declare const getApp: () => any
declare const requirePlugin: () => void

type IObject = Record<string, any>

interface IProcessApisIOptions {
  noPromiseApis?: Set<string>
  needPromiseApis?: Set<string>
  handleSyncApis?: (key: string, global: IObject, args: any[]) => any
  transformMeta?: (key: string, options: IObject) => { key: string, options: IObject }
  modifyApis?: (apis: Set<string>) => void
  modifyAsyncResult?: (key: string, res) => void
  isOnlyPromisify?: boolean
  [propName: string]: any
}

export interface IApiDiff {
  [key: string]: {
    /** API重命名 */
    alias?: string
    options?: {
      /** API参数键名修改 */
      change?: {
        old: string
        new: string
      }[]
      /** API参数值修改 */
      set?: {
        key: string
        value: ((options: Record<string, any>) => unknown) | unknown
      }[]
    }
  }
}

const needPromiseApis = new Set<string>([
  'addPhoneContact',
  'authorize',
  'canvasGetImageData',
  'canvasPutImageData',
  'canvasToTempFilePath',
  'checkSession',
  'chooseAddress',
  'chooseImage',
  'chooseInvoiceTitle',
  'chooseLocation',
  'chooseVideo',
  'clearStorage',
  'closeBLEConnection',
  'closeBluetoothAdapter',
  'closeSocket',
  'compressImage',
  'connectSocket',
  'createBLEConnection',
  'downloadFile',
  'exitMiniProgram',
  'getAvailableAudioSources',
  'getBLEDeviceCharacteristics',
  'getBLEDeviceServices',
  'getBatteryInfo',
  'getBeacons',
  'getBluetoothAdapterState',
  'getBluetoothDevices',
  'getClipboardData',
  'getConnectedBluetoothDevices',
  'getConnectedWifi',
  'getExtConfig',
  'getFileInfo',
  'getImageInfo',
  'getLocation',
  'getNetworkType',
  'getSavedFileInfo',
  'getSavedFileList',
  'getScreenBrightness',
  'getSetting',
  'getStorage',
  'getStorageInfo',
  'getSystemInfo',
  'getUserInfo',
  'getWifiList',
  'hideHomeButton',
  'hideShareMenu',
  'hideTabBar',
  'hideTabBarRedDot',
  'loadFontFace',
  'login',
  'makePhoneCall',
  'navigateBack',
  'navigateBackMiniProgram',
  'navigateTo',
  'navigateToBookshelf',
  'navigateToMiniProgram',
  'notifyBLECharacteristicValueChange',
  'hideKeyboard',
  'hideLoading',
  'hideNavigationBarLoading',
  'hideToast',
  'openBluetoothAdapter',
  'openDocument',
  'openLocation',
  'openSetting',
  'pageScrollTo',
  'previewImage',
  'queryBookshelf',
  'reLaunch',
  'readBLECharacteristicValue',
  'redirectTo',
  'removeSavedFile',
  'removeStorage',
  'removeTabBarBadge',
  'requestSubscribeMessage',
  'saveFile',
  'saveImageToPhotosAlbum',
  'saveVideoToPhotosAlbum',
  'scanCode',
  'sendSocketMessage',
  'setBackgroundColor',
  'setBackgroundTextStyle',
  'setClipboardData',
  'setEnableDebug',
  'setInnerAudioOption',
  'setKeepScreenOn',
  'setNavigationBarColor',
  'setNavigationBarTitle',
  'setScreenBrightness',
  'setStorage',
  'setTabBarBadge',
  'setTabBarItem',
  'setTabBarStyle',
  'showActionSheet',
  'showFavoriteGuide',
  'showLoading',
  'showModal',
  'showShareMenu',
  'showTabBar',
  'showTabBarRedDot',
  'showToast',
  'startBeaconDiscovery',
  'startBluetoothDevicesDiscovery',
  'startDeviceMotionListening',
  'startPullDownRefresh',
  'stopBeaconDiscovery',
  'stopBluetoothDevicesDiscovery',
  'stopCompass',
  'startCompass',
  'startAccelerometer',
  'stopAccelerometer',
  'showNavigationBarLoading',
  'stopDeviceMotionListening',
  'stopPullDownRefresh',
  'switchTab',
  'uploadFile',
  'vibrateLong',
  'vibrateShort',
  'writeBLECharacteristicValue'
])

function getCanIUseWebp (taro) {
  return function () {
    const res = taro.getSystemInfoSync?.()

    if (!res) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('不支持 API canIUseWebp')
      }
      return false
    }

    const { platform } = res

    const platformLower = platform.toLowerCase()
    if (platformLower === 'android' || platformLower === 'devtools') {
      return true
    }
    return false
  }
}

function getNormalRequest (global) {
  return function request (options) {
    options = options
      ? (
        isString(options)
          ? { url: options }
          : options
      )
      : {}

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

      requestTask = global.request(options)
    })

    equipTaskMethodsIntoPromise(requestTask, p)

    p.abort = (cb) => {
      cb && cb()
      if (requestTask) {
        requestTask.abort()
      }
      return p
    }
    return p
  }
}

function processApis (taro, global, config: IProcessApisIOptions = {}) {
  const patchNeedPromiseApis = config.needPromiseApis || []
  const _needPromiseApis = new Set<string>([...patchNeedPromiseApis, ...needPromiseApis])
  const preserved = [
    'getEnv',
    'interceptors',
    'Current',
    'getCurrentInstance',
    'options',
    'nextTick',
    'eventCenter',
    'Events',
    'preload',
    'webpackJsonp'
  ]

  const apis = new Set(
    !config.isOnlyPromisify
      ? Object.keys(global).filter(api => preserved.indexOf(api) === -1)
      : patchNeedPromiseApis
  )

  if (config.modifyApis) {
    config.modifyApis(apis)
  }

  apis.forEach(key => {
    if (_needPromiseApis.has(key)) {
      const originKey = key
      taro[originKey] = (options: Record<string, any> | string = {}, ...args) => {
        let key = originKey

        // 第一个参数 options 为字符串，单独处理
        if (typeof options === 'string') {
          if (args.length) {
            return global[key](options, ...args)
          }
          return global[key](options)
        }

        // 改变 key 或 option 字段，如需要把支付宝标准的字段对齐微信标准的字段
        if (config.transformMeta) {
          const transformResult = config.transformMeta(key, options)
          key = transformResult.key
          ; (options as Record<string, any>) = transformResult.options
          // 新 key 可能不存在
          if (!global.hasOwnProperty(key)) {
            return nonsupport(key)()
          }
        }

        let task: any = null
        const obj: Record<string, any> = Object.assign({}, options)

        // 为页面跳转相关的 API 设置一个随机数作为路由参数。为了给 runtime 区分页面。
        setUniqueKeyToRoute(key, options)

        // Promise 化
        const p: any = new Promise((resolve, reject) => {
          obj.success = res => {
            config.modifyAsyncResult?.(key, res)
            options.success?.(res)
            if (key === 'connectSocket') {
              resolve(
                Promise.resolve().then(() => task ? Object.assign(task, res) : res)
              )
            } else {
              resolve(res)
            }
          }
          obj.fail = res => {
            options.fail?.(res)
            reject(res)
          }
          obj.complete = res => {
            options.complete?.(res)
          }
          if (args.length) {
            task = global[key](obj, ...args)
          } else {
            task = global[key](obj)
          }
        })

        // 给 promise 对象挂载属性
        if (['uploadFile', 'downloadFile'].includes(key)) {
          equipTaskMethodsIntoPromise(task, p)
          p.progress = cb => {
            task?.onProgressUpdate(cb)
            return p
          }
          p.abort = cb => {
            cb?.()
            task?.abort()
            return p
          }
        }
        return p
      }
    } else {
      let platformKey = key

      // 改变 key 或 option 字段，如需要把支付宝标准的字段对齐微信标准的字段
      if (config.transformMeta) {
        platformKey = config.transformMeta(key, {}).key
      }

      // API 不存在
      if (!global.hasOwnProperty(platformKey)) {
        taro[key] = nonsupport(key)
        return
      }
      if (isFunction(global[key])) {
        taro[key] = (...args) => {
          if (config.handleSyncApis) {
            return config.handleSyncApis(key, global, args)
          } else {
            return global[platformKey].apply(global, args)
          }
        }
      } else {
        taro[key] = global[platformKey]
      }
    }
  })

  !config.isOnlyPromisify && equipCommonApis(taro, global, config)
}

/**
 * 挂载常用 API
 * @param taro Taro 对象
 * @param global 小程序全局对象，如微信的 wx，支付宝的 my
 */
function equipCommonApis (taro, global, apis: Record<string, any> = {}) {
  taro.canIUseWebp = getCanIUseWebp(taro)
  taro.getCurrentPages = getCurrentPages || nonsupport('getCurrentPages')
  taro.getApp = getApp || nonsupport('getApp')
  taro.env = global.env || {}

  try {
    taro.requirePlugin = requirePlugin || nonsupport('requirePlugin')
  } catch (error) {
    taro.requirePlugin = nonsupport('requirePlugin')
  }

  // request & interceptors
  const request = apis.request || getNormalRequest(global)
  function taroInterceptor (chain) {
    return request(chain.requestParams)
  }
  const link = new taro.Link(taroInterceptor)
  taro.request = link.request.bind(link)
  taro.addInterceptor = link.addInterceptor.bind(link)
  taro.cleanInterceptors = link.cleanInterceptors.bind(link)
  taro.miniGlobal = taro.options.miniGlobal = global
  taro.getAppInfo = function () {
    return {
      platform: process.env.TARO_PLATFORM || 'MiniProgram',
      taroVersion: process.env.TARO_VERSION || 'unknown',
      designWidth: taro.config.designWidth
    }
  }
}

/**
 * 将Task对象中的方法挂载到promise对象中，适配小程序api原生返回结果
 * @param task Task对象 {RequestTask | DownloadTask | UploadTask}
 * @param promise Promise
 */
function equipTaskMethodsIntoPromise (task, promise) {
  if (!task || !promise) return
  const taskMethods = ['abort', 'onHeadersReceived', 'offHeadersReceived', 'onProgressUpdate', 'offProgressUpdate', 'onChunkReceived', 'offChunkReceived']
  task && taskMethods.forEach(method => {
    if (method in task) {
      promise[method] = task[method].bind(task)
    }
  })
}

export {
  processApis
}

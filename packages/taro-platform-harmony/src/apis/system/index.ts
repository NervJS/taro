// 设备信息,从 API Version 6 开始支持
import deviceInfo from '@ohos.deviceInfo'
// 显示设备属性,从 API Version 7 开始支持
import display from '@ohos.display'
// 从 API Version 7 开始支持
import i18n from '@ohos.i18n'
// 从 API Version 6 开始支持
import pasteboard from '@ohos.pasteboard'
// 从 API Version 7 开始支持。
import call from '@ohos.telephony.call'
// 从API Version 7 开始，该接口不再维护，推荐使用新接口'@ohos.brightness'
// 但是 新接口 @ohos.brightness 没有getValue
import brightness from '@system.brightness'
// 设备信息 从API Version 6开始，该接口不再维护，推荐使用新接口'@ohos.deviceInfo'进行设备信息查询
import device from '@system.device'
// 网络状态，从API Version 7 开始，该接口不再维护，推荐使用新接口'@ohos.telephony.observer'
// 但是新接口 @ohos.telephony.observer 没有network.getType。而且网络状态枚举值不清楚
import network from '@system.network'
import { isNull, isNumber, isString, isUndefined } from '@tarojs/shared'

import { callAsyncFail, callAsyncSuccess, unsupport } from '../utils'
import { GetAPIsOptionsSuccessType } from '../utils/types'

import type Taro from '@tarojs/taro'


type GetNetworkType = typeof Taro.getNetworkType;
type OnNetworkStatusChange = typeof Taro.onNetworkStatusChange;
type OffNetworkStatusChange = typeof Taro.offNetworkStatusChange;
type GetSystemInfo = typeof Taro.getSystemInfo;
type GetSystemInfoSync = typeof Taro.getSystemInfoSync;
type GetScreenBrightness = typeof Taro.getScreenBrightness;
type SetScreenBrightness = typeof Taro.setScreenBrightness;
//  OnMemoryWarning,OffMemoryWarningun are unsupported temporarily
//  type OnMemoryWarning = typeof Taro.onMemoryWarning;
//  type OffMemoryWarning = typeof Taro.offMemoryWarning;
type MakePhoneCall = typeof Taro.makePhoneCall;
type SetClipboardData = typeof Taro.setClipboardData;
type GetClipboardData = typeof Taro.getClipboardData;

/*  Obtains the network type  */
const getNetworkType: GetNetworkType = function (options) {
  let res: any = {}
  return new Promise((resolve, reject) => {
    network.getType({
      success: function (data) {
        res = {
          errMsg: 'getNetworkType:ok',
          networkType: data.type,
          metered: data.metered
        }
        callAsyncSuccess(resolve, res, options)
      },
      fail: function (data, code) {
        res = {
          errMsg: `getNetworkType:fail ${data || ''}`,
          code: code
        }
        callAsyncFail(reject, res, options)
      }
    })
  })
}

const onNetworkStatusChange: OnNetworkStatusChange = function (cb) {
  network.subscribe({
    success: function (data) {
      // metered返回值，boolean类型，表示是否按照流量计费
      // type返回值，string类型，表示网络类型，可能的值为2g，3g，4g，5g，wifi，none
      const res = {
        networkType: data.type,
        isConnected: data.type !== 'none'
      }
      cb?.(res)
    },
    fail: function (data, code) {
      const res: any = {}
      res.errMsg = `onNetworkStatusChange:fail ${data || ''}`
      res.code = code
      cb?.(res)
    }
  })
}

const offNetworkStatusChange: OffNetworkStatusChange = function () {
  network.unsubscribe()
}

/* 同步版本 */
const getSystemInfoSync: GetSystemInfoSync = function () {
  const res: any = {}
  res.SDKVersion = deviceInfo && deviceInfo.sdkApiVersion // 客户端基础库版本 string
  res.albumAuthorized = false // 允许使用相册的开关（仅 iOS 有效） boolean
  res.benchmarkLevel = null // 设备性能等级 number
  res.bluetoothEnabled = null // 蓝牙的系统开关 boolean
  res.brand = deviceInfo && deviceInfo.brand // 设备品牌 string
  res.cameraAuthorized = null // 允许使用摄像头的开关 boolean
  res.enableDebug = null // 是否已打开调试 boolean
  res.fontSizeSetting = null // 用户字体大小（单位px） number
  res.language = i18n && i18n.getSystemLanguage && i18n.getSystemLanguage() // string
  res.locationAuthorized = null // 定位的开关 boolean
  res.locationEnabled = null // 地理位置的系统开关 boolean
  res.microphoneAuthorized = null // 麦克风的开关 boolean
  res.model = deviceInfo && deviceInfo.deviceType // 设备型号 string
  res.notificationAuthorized = null // 通知的开关 boolean
  res.notificationAlertAuthorized = false // 通知带有提醒的开关（仅 iOS 有效） boolean
  res.notificationBadgeAuthorized = false // 通知带有标记的开关（仅 iOS 有效） boolean
  res.notificationSoundAuthorized = false // 通知带有声音的开关（仅 iOS 有效）boolean
  res.phoneCalendarAuthorized = null // 使用日历的开关 boolean
  res.wifiEnabled = false // Wi-Fi 的系统开关 boolean
  res.pixelRatio = null // 设备像素比,number
  res.platform = 'android' // 客户端平台 string
  res.safeArea = null // 在竖屏正方向下的安全区域 General.SafeAreaResult
  res.screenHeight = display && display.height // 屏幕高度，单位px number
  res.screenWidth = display && display.width // 屏幕宽度，单位px number
  res.statusBarHeight = null // 状态栏的高度，单位px number
  res.system = deviceInfo && deviceInfo.osFullName // 操作系统及版本 string
  res.theme = null // 系统当前主题，取值为light或dark 'light' | 'dark'
  res.windowWidth = device && device.windowWidth // 可使用窗口宽度，单位px number
  res.windowHeight = device && device.windowHeight // 可使用窗口高度，单位px number
  res.version = deviceInfo && deviceInfo.displayVersion // 版本号 string
  return res
}
/* 异步版本 */
const getSystemInfo: GetSystemInfo = function (options) {
  let res = {}
  return new Promise((resolve, reject) => {
    try {
      res = getSystemInfoSync()
      callAsyncSuccess(resolve, res, options)
    } catch (error) {
      res = {
        errMsg: `getSystemInfo:fail ${error && error.toString && error.toString()}`,
        error: error
      }
      callAsyncFail(reject, res, options)
    }
  })
}

/* 获得屏幕亮度 */
const getScreenBrightness: GetScreenBrightness = function (options) {
  let res = {}
  return new Promise((resolve, reject) => {
    brightness.getValue({
      success: function (data) {
        res = {
          errMsg: 'getScreenBrightness:ok',
          value: data.value
        }
        callAsyncSuccess<GetAPIsOptionsSuccessType<GetScreenBrightness>>(resolve, res, options)
      },
      fail: function (data, code) {
        res = {
          errMsg: `getScreenBrightness:fail ${data || ''}`,
          code: code
        }
        callAsyncFail(reject, res, options)
      }
    })
  })
}
/* 设置屏幕亮度 */
const setScreenBrightness: SetScreenBrightness = function (options) {
  const { value } = options
  let res = {}
  return new Promise((resolve, reject) => {
    if (!isNumber(value)) {
      res = {
        errMsg: 'the parameter:value invalid'
      }
      callAsyncFail(reject, res, options)
    } else {
      brightness.setValue({
        value: value,
        success: function () {
          res = {
            errMsg: 'setScreenBrightness:ok'
          }
          callAsyncSuccess(resolve, res, options)
        },
        fail: function (data, code) {
          res = {
            errMsg: `setScreenBrightness:fail ${data || ''}`,
            code: code
          }
          callAsyncFail(reject, res, options)
        }
      })
    }
  })
}

const onMemoryWarning = function (cb) {
  unsupport('onMemoryWarning')
  cb?.({ errMsg: '暂不支持 Taro.onMemoryWarning' })
}

const offMemoryWarning = function (cb) {
  unsupport('offMemoryWarning')
  cb?.({ errMsg: '暂不支持 Taro.offMemoryWarning' })
}

const makePhoneCall: MakePhoneCall = function (options) {
  const { phoneNumber } = options
  return new Promise((resolve, reject) => {
    let res = {}
    if (!isString(phoneNumber)) {
      res = {
        errMsg: 'the parameter:phoneNumber invalid'
      }
      callAsyncFail(reject, res, options)
    } else {
      call.makeCall(phoneNumber, err => {
        if (err) {
          console.error('Failed to makePhoneCall. Cause: ' + JSON.stringify(err))
          res = {
            errMsg: 'makePhoneCall:fail,err: ' + object2String(err)
          }
          callAsyncFail(reject, res, options)
        } else {
          callAsyncSuccess(resolve, res, options)
        }
      })
    }
  })
}

const setClipboardData: SetClipboardData = function (options) {
  const { data } = options
  let res = {}

  return new Promise((resolve, reject) => {
    const systemPasteboard = pasteboard.getSystemPasteboard()
    const pasteData = pasteboard.createPlainTextData(data)

    if (!isString(data) || isUndefined(data) || isNull(data)) {
      res = {
        errMsg: 'the parameter:data invalid'
      }
      callAsyncFail(reject, res, options)
    } else {
      systemPasteboard.setPasteData(pasteData, (error, data) => { // callback形式调用异步接口
        if (error) {
          console.error('Failed to set PasteData. Cause: ' + JSON.stringify(error))
          res = {
            errMsg: 'setClipboardData:fail,error: ' + object2String(error),
            error: error
          }
          callAsyncFail(reject, res, options)
        } else {
          res = {
            errMsg: 'setClipboardData:ok',
            data: data
          }
          callAsyncSuccess(resolve, res, options)
        }
      })
    }
  })
}

const getClipboardData:GetClipboardData = function (options) {
  return new Promise((resolve, reject) => {
    let res = {}
    const systemPasteboard = pasteboard.getSystemPasteboard()
    systemPasteboard.getPasteData((error, pasteData) => { // callback形式调用异步接口
      if (error) {
        console.error('Failed to obtain PasteData. Cause: ' + JSON.stringify(error))
        res = {
          errMsg: 'getClipboardData:fail,error: ' + object2String(error),
          error: error
        }
        callAsyncFail(reject, res, options)
      } else {
        const text = pasteData.getPrimaryText()
        res = {
          data: text
        }
        callAsyncSuccess(resolve, res, options)
      }
    })
  })
}

function object2String (obj) {
  let str = ''
  for (const item in obj) {
    str = str + item + ':' + obj[item] + ' \n'
  }
  return str
}
export {
  getClipboardData,
  getNetworkType,
  getScreenBrightness,
  getSystemInfo,
  getSystemInfoSync,
  makePhoneCall,
  offMemoryWarning,
  offNetworkStatusChange,
  onMemoryWarning,
  onNetworkStatusChange,
  setClipboardData,
  setScreenBrightness
}

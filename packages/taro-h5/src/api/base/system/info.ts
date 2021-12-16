import Taro from '@tarojs/api'
import MobileDetect from 'mobile-detect'

import { MethodHandler } from '../../utils/handler'

export const getSystemInfoSync: typeof Taro.getSystemInfoSync = () => {
  const md = new MobileDetect(navigator.userAgent)

  const info: ReturnType<typeof Taro.getSystemInfoSync> = {
    brand: md.mobile() || '', // 手机品牌
    model: md.mobile() || '', // 手机型号
    system: md.os(), // 操作系统版本
    pixelRatio: window.devicePixelRatio, // 设备像素比
    screenWidth: window.screen.width, // 屏幕宽度
    screenHeight: window.screen.height, // 屏幕高度
    windowWidth: document.documentElement.clientWidth, // 可使用窗口宽度
    windowHeight: document.documentElement.clientHeight, // 可使用窗口高度
    version: '', // 微信版本号
    statusBarHeight: NaN, // 状态栏的高度
    platform: navigator.platform, // 客户端平台
    language: navigator.language, // 微信设置的语言
    fontSizeSetting: NaN, // 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
    SDKVersion: '', // 客户端基础库版本

    // TODO
    albumAuthorized: false,
    benchmarkLevel: 0,
    bluetoothEnabled: false,
    cameraAuthorized: false,
    enableDebug: false,
    locationAuthorized: false,
    locationEnabled: false,
    microphoneAuthorized: false,
    notificationAlertAuthorized: false,
    notificationAuthorized: false,
    notificationBadgeAuthorized: false,
    notificationSoundAuthorized: false,
    safeArea: {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    },
    wifiEnabled: false
  }

  return info
}

export const getSystemInfo: typeof Taro.getSystemInfo = async (options = {}) => {
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'getSystemInfo', success, fail, complete })

  try {
    const info = await getSystemInfoSync()
    return handle.success(info)
  } catch (error) {
    return handle.fail({
      errMsg: error
    })
  }
}

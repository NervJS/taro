import ConfigurationConstant from '@ohos.app.ability.ConfigurationConstant'
// 设备信息,从 API Version 6 开始支持
import deviceInfo from '@ohos.deviceInfo'
// 显示设备属性,从 API Version 7 开始支持
import _display from '@ohos.display'
// 从 API Version 7 开始支持
import i18n from '@ohos.i18n'
import { Current, systemContext, systemPromise, TaroWindowUtil } from '@tarojs/runtime'

import { MethodHandler } from '../utils'

import type Taro from '@tarojs/taro/types'

let currentContext

Current.contextPromise.then((context) => {
  currentContext = context
  // 监听配置更新
  currentContext.getApplicationContext().on('environment', {
    onConfigurationUpdated(config) {
      AppStorage.setOrCreate('__TARO_APP_CONFIG', config)
    },
  })
})

/** 获取窗口信息 */
export const getWindowInfo: typeof Taro.getWindowInfo = () => {
  // Note: 获取实时信息，systemContext 值获取更新可能会被业务逻辑卡住
  const display = _display.getDefaultDisplaySync()

  const info: ReturnType<typeof Taro.getWindowInfo> & any = {
    /** 设备像素比 */
    pixelRatio: systemContext.densityPixels, // 设备像素比,number
    screenWidth: px2vp(display?.width), // 屏幕宽度，单位vp
    screenHeight: px2vp(display?.height), // 屏幕高度，单位vp
    windowWidth: systemContext.windowWidth || px2vp(display?.width), // 可使用窗口高度，单位px
    windowHeight: systemContext.windowHeight || px2vp(display?.height), // 可使用窗口宽度，单位px
    statusBarHeight: systemContext.statusBarHeight, // 状态栏的高度，单位vp
    safeArea: systemContext.safeArea, // 在竖屏正方向下的安全区域 General.SafeAreaResult 单位为vp
  }
  // Note: Harmony 端特定属性
  info.foldDisplayMode = canIUse('SystemCapability.Window.SessionManager') ? _display.getFoldDisplayMode() : 0 // 折叠屏显示模式
  info.isFoldable = _display.isFoldable()
  info.widthBreakpoint = AppStorage.get('widthBreakpoint') ?? 0
  info.heightBreakpoint = AppStorage.get('heightBreakpoint') ?? 0
  return info
}

/** 获取设备设置 */
export const getSystemSetting: typeof Taro.getSystemSetting = () => {
  const isLandscape = systemContext.windowWidth >= systemContext.windowHeight
  const info: ReturnType<typeof Taro.getSystemSetting> & any = {
    bluetoothEnabled: null, // 蓝牙的系统开关
    locationEnabled: null, // 地理位置的系统开关
    wifiEnabled: false, // Wi-Fi 的系统开关
    /** 设备方向 */
    deviceOrientation: isLandscape ? 'landscape' : 'portrait',
  }

  return info
}

/** 获取设备设置 */
export const getDeviceInfo: typeof Taro.getDeviceInfo = () => {
  const info: ReturnType<typeof Taro.getDeviceInfo> & any = {}
  if (deviceInfo) {
    info.abi = deviceInfo.abiList || '' // 应用二进制接口类型（仅 Android 支持） string
    info.deviceAbi = deviceInfo.abiList || '' // 设备二进制接口类型（仅 Android 支持） string
    info.brand = deviceInfo.brand // 设备品牌 string
    info.model = deviceInfo.deviceType // 设备型号 string
    info.system = deviceInfo.osFullName // 操作系统及版本 string

    // Note: 鸿蒙专属属性
    info.securityPatchTag = deviceInfo.securityPatchTag
    info.displayVersion = deviceInfo.displayVersion
    info.incrementalVersion = deviceInfo.incrementalVersion
    info.osReleaseType = deviceInfo.osReleaseType
    info.majorVersion = deviceInfo.majorVersion
    info.seniorVersion = deviceInfo.seniorVersion
    info.featureVersion = deviceInfo.featureVersion
    info.buildVersion = deviceInfo.buildVersion
    info.sdkApiVersion = deviceInfo.sdkApiVersion
    info.firstApiVersion = deviceInfo.firstApiVersion
    info.versionId = deviceInfo.versionId
    info.buildType = deviceInfo.buildType
    info.distributionOSName = deviceInfo.distributionOSName
    info.distributionOSVersion = deviceInfo.distributionOSVersion
    info.distributionOSApiVersion = deviceInfo.distributionOSApiVersion
    info.distributionOSReleaseType = deviceInfo.distributionOSReleaseType
    info.udid = deviceInfo.udid
    info.ODID = deviceInfo.ODID
  }
  info.benchmarkLevel = null // 设备性能等级 number
  info.platform = 'harmony' // 客户端平台 string
  info.CPUType = '' // CPU型号 string

  return info
}

/** 获取微信APP基础信息 */
export const getAppBaseInfo: typeof Taro.getAppBaseInfo = () => {
  const info: ReturnType<typeof Taro.getAppBaseInfo> = {
    SDKVersion: deviceInfo && deviceInfo.sdkApiVersion, // 客户端基础库版本 string
    enableDebug: Current.isDebug, // 是否已打开调试 boolean
    host: deviceInfo && deviceInfo.buildHost, // 当前运行的宿主环境
    language: i18n?.System?.getSystemLanguage?.() || i18n?.getSystemLanguage?.(), // 系统语言
    version: deviceInfo?.displayVersion, // 版本号 string
    // Note: 更新配置时才能记录
    theme:
      AppStorage.get('__TARO_APP_CONFIG')?.colorMode === ConfigurationConstant.ColorMode.COLOR_MODE_DARK
        ? 'dark'
        : 'light', // 系统当前主题，取值为light或dark 'light' | 'dark'
  }

  return info
}

/** 获取微信APP授权设置 */
export const getAppAuthorizeSetting: typeof Taro.getAppAuthorizeSetting = () => {
  const info: ReturnType<typeof Taro.getAppAuthorizeSetting> & any = {
    albumAuthorized: false, // 允许使用相册的开关（仅 iOS 有效） boolean
    bluetoothAuthorized: null, // 允许微信使用蓝牙的开关（仅 iOS 有效）
    cameraAuthorized: null, // 允许使用摄像头的开关 boolean
    locationAuthorized: null, // 定位的开关 boolean
    locationReducedAccuracy: false, // 定位准确度 boolean
    microphoneAuthorized: null, // 麦克风的开关 boolean
    notificationAuthorized: null, // 通知的开关 boolean
    notificationAlertAuthorized: false, // 通知带有提醒的开关（仅 iOS 有效） boolean
    notificationBadgeAuthorized: false, // 通知带有标记的开关（仅 iOS 有效） boolean
    notificationSoundAuthorized: false, // 通知带有声音的开关（仅 iOS 有效）boolean
    phoneCalendarAuthorized: null, // 使用日历的开关 boolean
  }

  return info
}

/* 同步版本 */
export const getSystemInfoSync: typeof Taro.getSystemInfoSync = function () {
  const res: any = {
    ...getWindowInfo(),
    ...getSystemSetting(),
    ...getDeviceInfo(),
    ...getAppBaseInfo(),
    ...getAppAuthorizeSetting(),
  }
  res.fontSizeSetting = null // 用户字体大小（单位px） number

  return res
}

/* 异步版本 */
export const getSystemInfo: typeof Taro.getSystemInfo = function (options = {}) {
  const name = 'getSystemInfo'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    Promise.all([TaroWindowUtil.resolver, systemPromise.resolver])
      .then(() => {
        try {
          handle.success(getSystemInfoSync(), { resolve, reject })
        } catch (error) {
          handle.fail(
            {
              errMsg: error && error.toString && error.toString(),
              error: error,
            } as any,
            { resolve, reject }
          )
        }
      })
      .catch((error) => {
        handle.fail(
          {
            errMsg: error && error.toString && error.toString(),
            error: error,
          } as any,
          { resolve, reject }
        )
      })
  })
}

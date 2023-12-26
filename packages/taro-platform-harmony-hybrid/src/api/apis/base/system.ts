import Taro from '@tarojs/api'

import { MethodHandler } from '../utils/handler'

/**
 * 获取窗口信息
 *
 * @canUse getWindowInfo
 * @__return
 * [pixelRatio, screenWidth, screenHeight, windowWidth, windowHeight, statusBarHeight, safeArea[\
 * bottom, height, left, right, top, width]]
 */
export const getWindowInfo: typeof Taro.getWindowInfo = () => {
  // @ts-ignore
  const info = native.getWindowInfo()
  const windowInfo: Taro.getWindowInfo.Result = {
    pixelRatio: info.pixelRatio,
    screenWidth: info.screenWidth,
    screenHeight: info.screenHeight,
    windowWidth: info.screenWidth,
    // @ts-ignore
    windowHeight: info.screenHeight - (window.currentNavigationStyle === 'default' ? (window.navigationHeight || 0) : 0),
    statusBarHeight: info.statusBarHeight,
    safeArea: info.safeArea || {
      /** 安全区域右下角纵坐标 */
      bottom: info.screenHeight,
      /** 安全区域的高度，单位逻辑像素, 窗口可用区域高度-状态栏高度 */
      height: info.screenHeight - info.statusBarHeight,
      /** 安全区域左上角横坐标 */
      left: 0,
      /** 安全区域右下角横坐标 */
      right: info.screenWidth,
      /** 安全区域左上角纵坐标, 状态栏高度 */
      top: info.statusBarHeight,
      /** 安全区域的宽度，单位逻辑像素 */
      width: info.screenWidth
    },
  }
  return windowInfo
}

const lastSystemSettingResult: Taro.getSystemSetting.Result = {}
let lastGetSystemSettingTime = 0

/**
 * 获取设备设置
 *
 * @canUse getSystemSetting
 * @__return [bluetoothEnabled, locationEnabled, wifiEnabled, deviceOrientation[portrait, landscape]]
 */
export const getSystemSetting: typeof Taro.getSystemSetting = () => {
  const currentTime = Date.now()
  if (currentTime - lastGetSystemSettingTime < 500) {
    return lastSystemSettingResult
  }
  // @ts-ignore
  const info = native.getSystemSetting()
  lastSystemSettingResult.bluetoothEnabled = info.bluetoothEnabled
  lastSystemSettingResult.locationEnabled = info.locationEnabled
  lastSystemSettingResult.wifiEnabled = info.wifiEnabled
  lastSystemSettingResult.deviceOrientation = info.deviceOrientation
  lastGetSystemSettingTime = currentTime
  return lastSystemSettingResult
}

/**
 * 获取APP基础信息
 *
 * @canUse getAppBaseInfo
 * @__return [SDKVersion, enableDebug, host[appId], language, version, theme[dark, light]]
 */
export const getAppBaseInfo: typeof Taro.getAppBaseInfo = () => {
  // @ts-ignore
  const info = native.getAppBaseInfo()
  // @ts-ignore
  const sdkApiVersion = native.getSystemInfoSync().ohosAPILevel.toString()
  const appBaseInfo: Taro.getAppBaseInfo.Result = {
    SDKVersion: sdkApiVersion,
    enableDebug: info.enableDebug,
    host: { appId: info.appId },
    language: info.appLanguage,
    version: info.appVersion,
    theme: info.theme
  }
  return appBaseInfo
}

/**
 * 获取APP授权设置
 *
 * @canUse getAppAuthorizeSetting
 * @__return
 * [albumAuthorized, bluetoothAuthorized, cameraAuthorized, locationAuthorized, locationReducedAccuracy,\
 * microphoneAuthorized, notificationAuthorized, phoneCalendarAuthorized]
 */
export const getAppAuthorizeSetting: typeof Taro.getAppAuthorizeSetting = () => {
  // @ts-ignore
  const info = native.getAppAuthorizeSetting()
  // @ts-ignore
  const appAuthorizeSetting: Taro.getAppAuthorizeSetting.Result = {
    /** 允许微信使用相册的开关（仅 iOS 有效） */
    albumAuthorized: info.albumAuthorized,
    /** 允许微信使用蓝牙的开关（仅 iOS 有效） */
    bluetoothAuthorized: info.bluetoothAuthorized,
    /** 允许微信使用摄像头的开关 */
    cameraAuthorized: info.cameraAuthorized,
    /** 允许微信使用定位的开关 */
    locationAuthorized: info.locationAuthorized,
    /** 定位准确度。true 表示模糊定位，false 表示精确定位（仅 iOS 有效） */
    locationReducedAccuracy: info.locationAccuracy === 'reduced',
    /** 允许微信使用麦克风的开关 */
    microphoneAuthorized: info.microphoneAuthorized,
    /** 允许微信通知的开关 */
    notificationAuthorized: info.notificationAuthorized,
    /** 允许微信读写日历的开关 */
    phoneCalendarAuthorized: info.phoneCalendarAuthorized
  }
  return appAuthorizeSetting
}

/**
 * 获取系统信息Taro.getSystemInfo的同步版本
 *
 * @canUse getSystemInfoSync
 * @__return
 * [brand, model, pixelRatio, screenWidth, screenHeight, windowWidth, windowHeight, statusBarHeight,\
 * language, version, system, platform, fontSizeSetting, SDKVersion, benchmarkLevel, albumAuthorized,\
 * cameraAuthorized, locationAuthorized, microphoneAuthorized, notificationAuthorized, phoneCalendarAuthorized,\
 * bluetoothEnabled, locationEnabled, wifiEnabled, safeArea[bottom, height, left, right, top, width],\
 * locationReducedAccuracy, theme[dark, light], host[appId], enableDebug, deviceOrientation[portrait, landscape]]
 */
export const getSystemInfoSync: typeof Taro.getSystemInfoSync = () => {
  // @ts-ignore
  const info = native.getSystemInfoSync()
  const windowInfo = getWindowInfo()
  const systemSetting = getSystemSetting()
  const appBaseInfo = getAppBaseInfo()
  const appAuthorizeSetting = getAppAuthorizeSetting()
  const systemInfoSync: Taro.getSystemInfoSync.Result = {
    /** 设备品牌 */
    brand: info.brand,
    /** 设备型号 */
    model: info.model,
    /** 设备像素比 */
    pixelRatio: windowInfo.pixelRatio,
    /** 屏幕宽度，单位px */
    screenWidth: windowInfo.screenWidth,
    /** 屏幕高度，单位px */
    screenHeight: windowInfo.screenHeight,
    /** 可使用窗口宽度，单位px */
    windowWidth: windowInfo.windowWidth,
    /** 可使用窗口高度，单位px */
    windowHeight: windowInfo.windowHeight,
    /** 状态栏的高度，单位px */
    statusBarHeight: windowInfo.statusBarHeight,
    /** 微信设置的语言 */
    language: info.language,
    /** 微信版本号 */
    version: info.version,
    /** 操作系统及版本 */
    system: info.system,
    /** 客户端平台 */
    platform: info.platform,
    /** 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 */
    fontSizeSetting: info?.fontSizeSetting ?? 16,
    /** 客户端基础库版本 */
    SDKVersion: info.ohosAPILevel.toString(),
    /** 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） */
    benchmarkLevel: info.benchmarkLevel || -1,
    /** 允许微信使用相册的开关（仅 iOS 有效） */
    albumAuthorized: appAuthorizeSetting.albumAuthorized === 'authorized',
    /** 允许微信使用摄像头的开关 */
    cameraAuthorized: appAuthorizeSetting.cameraAuthorized === 'authorized',
    /** 允许微信使用定位的开关 */
    locationAuthorized: appAuthorizeSetting.locationAuthorized === 'authorized',
    /** 允许微信使用麦克风的开关 */
    microphoneAuthorized: appAuthorizeSetting.microphoneAuthorized === 'authorized',
    /** 允许微信通知的开关 */
    notificationAuthorized: appAuthorizeSetting.notificationAuthorized === 'authorized',
    /** 允许微信使用日历的开关 */
    phoneCalendarAuthorized: appAuthorizeSetting.phoneCalendarAuthorized === 'authorized',
    /** 蓝牙的系统开关 */
    bluetoothEnabled: systemSetting.bluetoothEnabled,
    /** 地理位置的系统开关 */
    locationEnabled: systemSetting.locationEnabled,
    /** Wi-Fi 的系统开关 */
    wifiEnabled: systemSetting.wifiEnabled,
    /** 在竖屏正方向下的安全区域 */
    safeArea: windowInfo.safeArea,
    /** `true` 表示模糊定位，`false` 表示精确定位，仅 iOS 支持 */
    locationReducedAccuracy: appAuthorizeSetting.locationReducedAccuracy,
    /** 系统当前主题，取值为light或dark，全局配置"darkmode":true时才能获取，否则为 undefined （不支持小游戏） */
    theme: appBaseInfo.theme,
    /** 当前小程序运行的宿主环境 */
    host: appBaseInfo.host,
    /** 是否已打开调试。可通过右上角菜单或 [Taro.setEnableDebug](/docs/apis/base/debug/setEnableDebug) 打开调试。 */
    enableDebug: appBaseInfo.enableDebug,
    /** 设备方向 */
    deviceOrientation: info.deviceOrientation,
    /** 小程序当前运行环境 */
    // environment: process.env.NODE_ENV
  }
  return systemInfoSync
}

/**
 * 获取系统信息
 *
 * @canUse getSystemInfo
 * @__success
 * [brand, model, pixelRatio, screenWidth, screenHeight, windowWidth, windowHeight, statusBarHeight,\
 * language, version, system, platform, fontSizeSetting, SDKVersion, benchmarkLevel, albumAuthorized,\
 * cameraAuthorized, locationAuthorized, microphoneAuthorized, notificationAuthorized, phoneCalendarAuthorized,\
 * bluetoothEnabled, locationEnabled, wifiEnabled, safeArea[bottom, height, left, right, top, width],\
 * locationReducedAccuracy, theme[dark, light], host[appId], enableDebug, deviceOrientation[portrait, landscape]]
 */
export const getSystemInfo: typeof Taro.getSystemInfo = async (options = {}) => {
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'getSystemInfo', success, fail, complete })
  try {
    const info = await getSystemInfoSync()
    return handle.success(info)
  } catch (error) {
    return handle.fail({
      errMsg: error,
    })
  }
}

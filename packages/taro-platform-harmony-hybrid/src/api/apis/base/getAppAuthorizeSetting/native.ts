import Taro from '@tarojs/api'

import native from '../../NativeApi'

/**
 * 获取APP授权设置
 *
 * @canUse getAppAuthorizeSetting
 * @__return
 * [albumAuthorized, bluetoothAuthorized, cameraAuthorized, locationAuthorized, locationReducedAccuracy,\
 * microphoneAuthorized, notificationAuthorized, phoneCalendarAuthorized]
 */
export const getAppAuthorizeSetting: typeof Taro.getAppAuthorizeSetting = () => {
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
    phoneCalendarAuthorized: info.phoneCalendarAuthorized,
  }
  return appAuthorizeSetting
}

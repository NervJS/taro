declare namespace Taro {
  namespace getSystemInfoSync {
    /**
     * 注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion
     */
    interface Result {
      /** 客户端基础库版本 */
      SDKVersion: string
      /** 允许微信使用相册的开关（仅 iOS 有效） */
      albumAuthorized: boolean
      /** 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） */
      benchmarkLevel: number
      /** 蓝牙的系统开关 */
      bluetoothEnabled: boolean
      /** 设备品牌 */
      brand: string
      /** 允许微信使用摄像头的开关 */
      cameraAuthorized: boolean
      /** 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 */
      fontSizeSetting: number
      /** 微信设置的语言 */
      language: string
      /** 允许微信使用定位的开关 */
      locationAuthorized: boolean
      /** 地理位置的系统开关 */
      locationEnabled: boolean
      /** 允许微信使用麦克风的开关 */
      microphoneAuthorized: boolean
      /** 设备型号 */
      model: string
      /** 允许微信通知带有提醒的开关（仅 iOS 有效） */
      notificationAlertAuthorized: boolean
      /** 允许微信通知的开关 */
      notificationAuthorized: boolean
      /** 允许微信通知带有标记的开关（仅 iOS 有效） */
      notificationBadgeAuthorized: boolean
      /** 允许微信通知带有声音的开关（仅 iOS 有效） */
      notificationSoundAuthorized: boolean
      /** 设备像素比 */
      pixelRatio: number
      /** 客户端平台 */
      platform: string
      /** 在竖屏正方向下的安全区域 */
      safeArea: General.SafeAreaResult
      /** 屏幕高度，单位px */
      screenHeight: number
      /** 屏幕宽度，单位px */
      screenWidth: number
      /** 状态栏的高度，单位px */
      statusBarHeight: number
      /** 操作系统及版本 */
      system: string
      /** 微信版本号 */
      version: string
      /** Wi-Fi 的系统开关 */
      wifiEnabled: boolean
      /** 可使用窗口高度，单位px */
      windowHeight: number
      /** 可使用窗口宽度，单位px */
      windowWidth: number
    }
  }

  /**
   * 获取系统信息同步接口。
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * try {
   *   const res = Taro.getSystemInfoSync()
   *   console.log(res.model)
   *   console.log(res.pixelRatio)
   *   console.log(res.windowWidth)
   *   console.log(res.windowHeight)
   *   console.log(res.language)
   *   console.log(res.version)
   *   console.log(res.platform)
   * } catch (e) {
   *   // Do something when catch error
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfoSync.html
   */
  function getSystemInfoSync(): getSystemInfoSync.Result

  namespace getSystemInfo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: Result | any) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: any) => void
      /** 接口调用成功的回调函数 */
      success?: (res: Result) => void
    }
    /**
     * 注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion
     */
    interface Result extends General.CallbackResult {
      /** 客户端基础库版本 */
      SDKVersion: string
      /** 允许微信使用相册的开关（仅 iOS 有效） */
      albumAuthorized: boolean
      /** 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） */
      benchmarkLevel: number
      /** 蓝牙的系统开关 */
      bluetoothEnabled: boolean
      /** 设备品牌 */
      brand: string
      /** 允许微信使用摄像头的开关 */
      cameraAuthorized: boolean
      /** 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 */
      fontSizeSetting: number
      /** 微信设置的语言 */
      language: string
      /** 允许微信使用定位的开关 */
      locationAuthorized: boolean
      /** 地理位置的系统开关 */
      locationEnabled: boolean
      /** 允许微信使用麦克风的开关 */
      microphoneAuthorized: boolean
      /** 设备型号 */
      model: string
      /** 允许微信通知带有提醒的开关（仅 iOS 有效） */
      notificationAlertAuthorized: boolean
      /** 允许微信通知的开关 */
      notificationAuthorized: boolean
      /** 允许微信通知带有标记的开关（仅 iOS 有效） */
      notificationBadgeAuthorized: boolean
      /** 允许微信通知带有声音的开关（仅 iOS 有效） */
      notificationSoundAuthorized: boolean
      /** 设备像素比 */
      pixelRatio: number
      /** 客户端平台 */
      platform: string
      /** 在竖屏正方向下的安全区域 */
      safeArea: General.SafeAreaResult
      /** 屏幕高度，单位px */
      screenHeight: number
      /** 屏幕宽度，单位px */
      screenWidth: number
      /** 状态栏的高度，单位px */
      statusBarHeight: number
      /** 操作系统及版本 */
      system: string
      /** 微信版本号 */
      version: string
      /** Wi-Fi 的系统开关 */
      wifiEnabled: boolean
      /** 可使用窗口高度，单位px */
      windowHeight: number
      /** 可使用窗口宽度，单位px */
      windowWidth: number
      /** 调用结果 */
      errMsg: string
  }
  }
  /**
   * 获取系统信息，支持 `Promise` 化使用。
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.getSystemInfo({
   *   success: res => console.log(res)
   * })
   * .then(res => console.log(res))
   * ```
   * @example
   * ```tsx
   * Taro.getSystemInfo({
   *   success: function (res) {
   *     console.log(res.model)
   *     console.log(res.pixelRatio)
   *     console.log(res.windowWidth)
   *     console.log(res.windowHeight)
   *     console.log(res.language)
   *     console.log(res.version)
   *     console.log(res.platform)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfo.html
   */
  function getSystemInfo(res?: getSystemInfo.Option): Promise<getSystemInfo.Result>
}

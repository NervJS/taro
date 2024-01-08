import Taro from '../../index'

declare module '../../index' {
  namespace openSystemBluetoothSetting {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace openAppAuthorizeSetting {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getWindowInfo {
    interface Result {
      /** 设备像素比 */
      pixelRatio: number
      /** 屏幕宽度，单位px */
      screenWidth: number
      /** 屏幕高度，单位px */
      screenHeight: number
      /** 可使用窗口宽度，单位px */
      windowWidth: number
      /** 可使用窗口高度，单位px */
      windowHeight: number
      /** 状态栏的高度，单位px */
      statusBarHeight?: number
      /** 在竖屏正方向下的安全区域 */
      safeArea?: TaroGeneral.SafeAreaResult
    }
  }

  namespace getSystemSetting {
    interface Result {
      /** 蓝牙的系统开关 */
      bluetoothEnabled?: boolean
      /** 地理位置的系统开关 */
      locationEnabled?: boolean
      /** Wi-Fi 的系统开关 */
      wifiEnabled?: boolean
      /** 设备方向 */
      deviceOrientation?: keyof DeviceOrientation
    }
    /** 设备方向合法值 */
    interface DeviceOrientation {
      /** 竖屏 */
      portrait
      /** 横屏 */
      landscape
    }
  }

  namespace getSystemInfoSync {
    interface Result {
      /** 设备品牌 */
      brand: string
      /** 设备型号 */
      model: string
      /** 设备像素比 */
      pixelRatio: number
      /** 屏幕宽度，单位px */
      screenWidth: number
      /** 屏幕高度，单位px */
      screenHeight: number
      /** 可使用窗口宽度，单位px */
      windowWidth: number
      /** 可使用窗口高度，单位px */
      windowHeight: number
      /** 状态栏的高度，单位px */
      statusBarHeight?: number
      /** 微信设置的语言 */
      language: string
      /** 微信版本号 */
      version?: string
      /** 操作系统及版本 */
      system: string
      /** 客户端平台 */
      platform: string
      /** 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 */
      fontSizeSetting?: number
      /** 客户端基础库版本 */
      SDKVersion?: string
      /** 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） */
      benchmarkLevel: number
      /** 允许微信使用相册的开关（仅 iOS 有效） */
      albumAuthorized?: boolean
      /** 允许微信使用摄像头的开关 */
      cameraAuthorized?: boolean
      /** 允许微信使用定位的开关 */
      locationAuthorized?: boolean
      /** 允许微信使用麦克风的开关 */
      microphoneAuthorized?: boolean
      /** 允许微信通知的开关 */
      notificationAuthorized?: boolean
      /** 允许微信通知带有提醒的开关（仅 iOS 有效） */
      notificationAlertAuthorized?: boolean
      /** 允许微信通知带有标记的开关（仅 iOS 有效） */
      notificationBadgeAuthorized?: boolean
      /** 允许微信通知带有声音的开关（仅 iOS 有效） */
      notificationSoundAuthorized?: boolean
      /** 允许微信使用日历的开关 */
      phoneCalendarAuthorized?: boolean
      /** 蓝牙的系统开关 */
      bluetoothEnabled?: boolean
      /** 地理位置的系统开关 */
      locationEnabled?: boolean
      /** Wi-Fi 的系统开关 */
      wifiEnabled?: boolean
      /** 在竖屏正方向下的安全区域 */
      safeArea?: TaroGeneral.SafeAreaResult
      /** `true` 表示模糊定位，`false` 表示精确定位，仅 iOS 支持 */
      locationReducedAccuracy?: boolean
      /** 系统当前主题，取值为light或dark，全局配置"darkmode":true时才能获取，否则为 undefined （不支持小游戏） */
      theme?: keyof Theme
      /** 当前小程序运行的宿主环境 */
      host?: Host
      /** 是否已打开调试。可通过右上角菜单或 [Taro.setEnableDebug](/docs/apis/base/debug/setEnableDebug) 打开调试。 */
      enableDebug?: boolean
      /** 设备方向 */
      deviceOrientation?: keyof DeviceOrientation
      /** 小程序当前运行环境 */
      environment?: string
    }
    /** 系统主题合法值 */
    interface Theme {
      /** 深色主题 */
      dark
      /** 浅色主题 */
      light
    }
    interface Host {
      /** 宿主 app 对应的 appId */
      appId: string
    }
    /** 设备方向合法值 */
    interface DeviceOrientation {
      /** 竖屏 */
      portrait
      /** 横屏 */
      landscape
    }
  }

  namespace getSystemInfoAsync {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: Result) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult | Result) => void
    }
    interface Result extends TaroGeneral.CallbackResult {
      /** 设备品牌 */
      brand: string
      /** 设备型号 */
      model: string
      /** 设备像素比 */
      pixelRatio: number
      /** 屏幕宽度，单位px */
      screenWidth: number
      /** 屏幕高度，单位px */
      screenHeight: number
      /** 可使用窗口宽度，单位px */
      windowWidth: number
      /** 可使用窗口高度，单位px */
      windowHeight: number
      /** 状态栏的高度，单位px */
      statusBarHeight?: number
      /** 微信设置的语言 */
      language: string
      /** 微信版本号 */
      version?: string
      /** 操作系统及版本 */
      system: string
      /** 客户端平台 */
      platform: string
      /** 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 */
      fontSizeSetting?: number
      /** 客户端基础库版本 */
      SDKVersion?: string
      /** 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） */
      benchmarkLevel: number
      /** 允许微信使用相册的开关（仅 iOS 有效） */
      albumAuthorized?: boolean
      /** 允许微信使用摄像头的开关 */
      cameraAuthorized?: boolean
      /** 允许微信使用定位的开关 */
      locationAuthorized?: boolean
      /** 允许微信使用麦克风的开关 */
      microphoneAuthorized?: boolean
      /** 允许微信通知的开关 */
      notificationAuthorized?: boolean
      /** 允许微信通知带有提醒的开关（仅 iOS 有效） */
      notificationAlertAuthorized?: boolean
      /** 允许微信通知带有标记的开关（仅 iOS 有效） */
      notificationBadgeAuthorized?: boolean
      /** 允许微信通知带有声音的开关（仅 iOS 有效） */
      notificationSoundAuthorized?: boolean
      /** 允许微信使用日历的开关 */
      phoneCalendarAuthorized?: boolean
      /** 蓝牙的系统开关 */
      bluetoothEnabled?: boolean
      /** 地理位置的系统开关 */
      locationEnabled?: boolean
      /** Wi-Fi 的系统开关 */
      wifiEnabled?: boolean
      /** 在竖屏正方向下的安全区域 */
      safeArea?: TaroGeneral.SafeAreaResult
      /** `true` 表示模糊定位，`false` 表示精确定位，仅 iOS 支持 */
      locationReducedAccuracy?: boolean
      /** 系统当前主题，取值为light或dark，全局配置"darkmode":true时才能获取，否则为 undefined （不支持小游戏） */
      theme?: keyof Theme
      /** 当前小程序运行的宿主环境 */
      host?: Host
      /** 是否已打开调试。可通过右上角菜单或 [Taro.setEnableDebug](/docs/apis/base/debug/setEnableDebug) 打开调试。 */
      enableDebug?: boolean
      /** 设备方向 */
      deviceOrientation?: keyof DeviceOrientation
      /** 小程序当前运行环境 */
      environment?: string
    }
    /** 系统主题合法值 */
    interface Theme {
      /** 深色主题 */
      dark
      /** 浅色主题 */
      light
    }
    interface Host {
      /** 宿主 app 对应的 appId */
      appId: string
    }
    /** 设备方向合法值 */
    interface DeviceOrientation {
      /** 竖屏 */
      portrait
      /** 横屏 */
      landscape
    }
  }

  namespace getSystemInfo {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: Result) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult | Result) => void
    }
    interface Result extends TaroGeneral.CallbackResult {
      /** 设备品牌 */
      brand: string
      /** 设备型号 */
      model: string
      /** 设备像素比 */
      pixelRatio: number
      /** 屏幕宽度，单位px */
      screenWidth: number
      /** 屏幕高度，单位px */
      screenHeight: number
      /** 可使用窗口宽度，单位px */
      windowWidth: number
      /** 可使用窗口高度，单位px */
      windowHeight: number
      /** 状态栏的高度，单位px */
      statusBarHeight?: number
      /** 微信设置的语言 */
      language: string
      /** 微信版本号 */
      version?: string
      /** 操作系统及版本 */
      system: string
      /** 客户端平台 */
      platform: string
      /** 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 */
      fontSizeSetting?: number
      /** 客户端基础库版本 */
      SDKVersion?: string
      /** 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） */
      benchmarkLevel: number
      /** 允许微信使用相册的开关（仅 iOS 有效） */
      albumAuthorized?: boolean
      /** 允许微信使用摄像头的开关 */
      cameraAuthorized?: boolean
      /** 允许微信使用定位的开关 */
      locationAuthorized?: boolean
      /** 允许微信使用麦克风的开关 */
      microphoneAuthorized?: boolean
      /** 允许微信通知的开关 */
      notificationAuthorized?: boolean
      /** 允许微信通知带有提醒的开关（仅 iOS 有效） */
      notificationAlertAuthorized?: boolean
      /** 允许微信通知带有标记的开关（仅 iOS 有效） */
      notificationBadgeAuthorized?: boolean
      /** 允许微信通知带有声音的开关（仅 iOS 有效） */
      notificationSoundAuthorized?: boolean
      /** 允许微信使用日历的开关 */
      phoneCalendarAuthorized?: boolean
      /** 蓝牙的系统开关 */
      bluetoothEnabled?: boolean
      /** 地理位置的系统开关 */
      locationEnabled?: boolean
      /** Wi-Fi 的系统开关 */
      wifiEnabled?: boolean
      /** 在竖屏正方向下的安全区域 */
      safeArea?: TaroGeneral.SafeAreaResult
      /** `true` 表示模糊定位，`false` 表示精确定位，仅 iOS 支持 */
      locationReducedAccuracy?: boolean
      /** 系统当前主题，取值为light或dark，全局配置"darkmode":true时才能获取，否则为 undefined （不支持小游戏） */
      theme?: keyof Theme
      /** 当前小程序运行的宿主环境 */
      host?: Host
      /** 是否已打开调试。可通过右上角菜单或 [Taro.setEnableDebug](/docs/apis/base/debug/setEnableDebug) 打开调试。 */
      enableDebug?: boolean
      /** 设备方向 */
      deviceOrientation?: keyof DeviceOrientation
      /** 小程序当前运行环境 */
      environment?: string
    }
    /** 系统主题合法值 */
    interface Theme {
      /** 深色主题 */
      dark
      /** 浅色主题 */
      light
    }
    interface Host {
      /** 宿主 app 对应的 appId */
      appId: string
    }
    /** 设备方向合法值 */
    interface DeviceOrientation {
      /** 竖屏 */
      portrait
      /** 横屏 */
      landscape
    }
  }

  namespace getSkylineInfoSync {
    interface Result {
      /** 当前运行环境是否支持 Skyline 渲染引擎 */
      isSupported: boolean
      /** 当前运行环境 Skyline 渲染引擎 的版本号，形如 0.9.7 */
      version: string
      /** 当前运行环境不支持 Skyline 渲染引擎 的原因，仅在 isSupported 为 false 时出现  */
      reason?: string
    }
  }

  namespace getSkylineInfo {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: Result) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult | Result) => void
    }
    interface Result {
      /** 当前运行环境是否支持 Skyline 渲染引擎 */
      isSupported: boolean
      /** 当前运行环境 Skyline 渲染引擎 的版本号，形如 0.9.7 */
      version: string
      /** 当前运行环境不支持 Skyline 渲染引擎 的原因，仅在 isSupported 为 false 时出现  */
      reason?: string
    }
  }

  namespace getRendererUserAgent {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: Result) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult | Result) => void
    }
    interface Result {
      userAgent: string
    }
  }

  namespace getDeviceInfo {
    interface Result {
      /** 应用二进制接口类型（仅 Android 支持） */
      abi?: string
      /** 设备二进制接口类型（仅 Android 支持） */
      deviceAbi: string
      /** 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） */
      benchmarkLevel: number
      /** 设备品牌 */
      brand: string
      /** 设备型号 */
      model: string
      /** 操作系统及版本 */
      system: string
      /** 客户端平台 */
      platform: string
      /** 设备 CPU 型号（仅 Android 支持） */
      CPUType: string
    }
  }

  namespace getAppBaseInfo {
    interface Result {
      /** 客户端基础库版本 */
      SDKVersion?: string
      /** 是否已打开调试。可通过右上角菜单或 [Taro.setEnableDebug](/docs/apis/base/debug/setEnableDebug) 打开调试。 */
      enableDebug?: boolean
      /** 当前小程序运行的宿主环境 */
      host?: Host
      /** 微信设置的语言 */
      language: string
      /** 微信版本号 */
      version?: string
      /** 系统当前主题，取值为light或dark，全局配置"darkmode":true时才能获取，否则为 undefined （不支持小游戏） */
      theme?: keyof Theme
    }
    /** 系统主题合法值 */
    interface Theme {
      /** 深色主题 */
      dark
      /** 浅色主题 */
      light
    }
    interface Host {
      /** 宿主 app 对应的 appId */
      appId: string
    }
  }

  namespace getAppAuthorizeSetting {
    interface Result {
      /** 允许微信使用相册的开关（仅 iOS 有效） */
      albumAuthorized: keyof Authorized
      /** 允许微信使用蓝牙的开关（仅 iOS 有效） */
      bluetoothAuthorized: keyof Authorized
      /** 允许微信使用摄像头的开关 */
      cameraAuthorized: keyof Authorized
      /** 允许微信使用定位的开关 */
      locationAuthorized: keyof Authorized
      /** 定位准确度。true 表示模糊定位，false 表示精确定位（仅 iOS 有效） */
      locationReducedAccuracy: boolean
      /** 允许微信使用麦克风的开关 */
      microphoneAuthorized: keyof Authorized
      /** 允许微信通知的开关 */
      notificationAuthorized: keyof Authorized
      /** 允许微信通知带有提醒的开关（仅 iOS 有效） */
      notificationAlertAuthorized: keyof Authorized
      /** 允许微信通知带有标记的开关（仅 iOS 有效） */
      notificationBadgeAuthorized: keyof Authorized
      /** 允许微信通知带有声音的开关（仅 iOS 有效） */
      notificationSoundAuthorized: keyof Authorized
      /** 允许微信读写日历的开关 */
      phoneCalendarAuthorized: keyof Authorized
    }
    /** 授权合法值 */
    interface Authorized {
      /** 表示已经获得授权，无需再次请求授权 */
      authorized
      /** 表示请求授权被拒绝，无法再次请求授权 （此情况需要引导用户打开[打开系统设置](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.openAppAuthorizeSetting.html)，在设置页中打开权限） */
      denied
      /** 表示尚未请求授权，会在微信下一次调用系统相应权限时请求 （仅 iOS 会出现。此种情况下引导用户[打开系统设置](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.openAppAuthorizeSetting.html)，不展示开关） */
      'not determined'
    }
  }

  interface TaroStatic {
    /** 跳转系统蓝牙设置页
     * @supported weapp
     * @example
     * ```tsx
     * Taro.openSystemBluetoothSetting({
     *   success (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.openSystemBluetoothSetting.html
     */
    openSystemBluetoothSetting(option: openSystemBluetoothSetting.Option): Promise<TaroGeneral.CallbackResult>

    /** 跳转系统微信授权管理页
     * @supported weapp
     * @example
     * ```tsx
     * Taro.openAppAuthorizeSetting({
     *   success (res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.openAppAuthorizeSetting.html
     */
    openAppAuthorizeSetting(option: openAppAuthorizeSetting.Option): Promise<TaroGeneral.CallbackResult>

    /** 获取窗口信息
     * @supported weapp, harmony_hybrid
     * @h5 不支持 statusBarHeight、safeArea
     * @example
     * ```tsx
     * const windowInfo = Taro.getWindowInfo()
     *
     * console.log(windowInfo.pixelRatio)
     * console.log(windowInfo.screenWidth)
     * console.log(windowInfo.screenHeight)
     * console.log(windowInfo.windowWidth)
     * console.log(windowInfo.windowHeight)
     * console.log(windowInfo.statusBarHeight)
     * console.log(windowInfo.safeArea)
     * console.log(windowInfo.screenTop)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getWindowInfo.html
     */
    getWindowInfo(): getWindowInfo.Result

    /** 获取设备设置
     * @supported weapp, h5, harmony_hybrid
     * @h5 不支持 bluetoothEnabled、locationEnabled、wifiEnabled
     * @example
     * ```tsx
     * const systemSetting = Taro.getSystemSetting()
     *
     * console.log(systemSetting.bluetoothEnabled)
     * console.log(systemSetting.deviceOrientation)
     * console.log(systemSetting.locationEnabled)
     * console.log(systemSetting.wifiEnabled)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemSetting.html
     */
    getSystemSetting(): getSystemSetting.Result

    /** [Taro.getSystemInfo](./getSystemInfo) 的同步版本
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @h5 不支持 version、statusBarHeight、fontSizeSetting、SDKVersion
     * @weapp 小程序可以在微信和企业微信中调用此接口，但是在企业微信中调用此接口时，会额外返回一个 environment 字段（微信中不返回），如此字段值为 wxwork，则表示当前小程序运行在企业微信环境中。
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
    getSystemInfoSync(): getSystemInfoSync.Result

    /** 异步获取系统信息。需要一定的微信客户端版本支持，在不支持的客户端上，会使用同步实现来返回。
     * @supported weapp, h5
     * @h5 不支持 version、statusBarHeight、fontSizeSetting、SDKVersion
     * @weapp 小程序可以在微信和企业微信中调用此接口，但是在企业微信中调用此接口时，会额外返回一个 environment 字段（微信中不返回），如此字段值为 wxwork，则表示当前小程序运行在企业微信环境中。
     * @example
     * ```tsx
     * Taro.getSystemInfoAsync({
     *   success (res) {
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
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfoAsync.html
     */
    getSystemInfoAsync(res?: getSystemInfoAsync.Option): Promise<getSystemInfo.Result>

    /** 获取系统信息，支持 `Promise` 化使用。
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @h5 不支持 version、statusBarHeight、fontSizeSetting、SDKVersion
     * @weapp 小程序可以在微信和企业微信中调用此接口，但是在企业微信中调用此接口时，会额外返回一个 environment 字段（微信中不返回），如此字段值为 wxwork，则表示当前小程序运行在企业微信环境中。
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
    getSystemInfo(res?: getSystemInfo.Option): Promise<getSystemInfo.Result>

    /** 获取当前运行环境对于 Skyline 渲染引擎 的支持情况
     *  基础库 2.26.2 开始支持
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSkylineInfoSync.html
     */
    getSkylineInfoSync(): getSkylineInfoSync.Result

    /** 获取当前运行环境对于 Skyline 渲染引擎 的支持情况
     *  基础库 2.26.2 开始支持
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSkylineInfo.html
     */
    getSkylineInfo(option?: getSkylineInfo.Option): Promise<getSkylineInfo.Result>

    /** 获取 Webview 小程序的 UserAgent
     *  基础库 2.26.3 开始支持
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getRendererUserAgent.html
     */
    getRendererUserAgent(option?: getRendererUserAgent.Option): Promise<getRendererUserAgent.Result>

    /** 获取设备基础信息
     * @supported weapp, h5
     * @h5 不支持 abi、benchmarkLevel
     * @example
     * ```tsx
     * const deviceInfo = Taro.getDeviceInfo()
     *
     * console.log(deviceInfo.abi)
     * console.log(deviceInfo.benchmarkLevel)
     * console.log(deviceInfo.brand)
     * console.log(deviceInfo.model)
     * console.log(deviceInfo.platform)
     * console.log(deviceInfo.system)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getDeviceInfo.html
     */
    getDeviceInfo(): getDeviceInfo.Result

    /** 获取微信APP基础信息
     * @supported weapp, h5, harmony_hybrid
     * @h5 不支持 SDKVersion、host、version
     * @example
     * ```tsx
     * const appBaseInfo = Taro.getAppBaseInfo()
     *
     * console.log(appBaseInfo.SDKVersion)
     * console.log(appBaseInfo.enableDebug)
     * console.log(appBaseInfo.host)
     * console.log(appBaseInfo.language)
     * console.log(appBaseInfo.version)
     * console.log(appBaseInfo.theme)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getAppBaseInfo.html
     */
    getAppBaseInfo(): getAppBaseInfo.Result

    /** 获取微信APP授权设置
     *
     * - 'authorized' 表示已经获得授权，无需再次请求授权；
     * - 'denied' 表示请求授权被拒绝，无法再次请求授权；（此情况需要引导用户[打开系统设置](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.openAppAuthorizeSetting.html)，在设置页中打开权限）
     * - 'non determined' 表示尚未请求授权，会在微信下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
     * @supported weapp, h5, harmony_hybrid
     * @h5 暂未支持设置权限
     * @example
     * ```tsx
     * const appAuthorizeSetting = Taro.getAppAuthorizeSetting()
     *
     * console.log(appAuthorizeSetting.albumAuthorized)
     * console.log(appAuthorizeSetting.bluetoothAuthorized)
     * console.log(appAuthorizeSetting.cameraAuthorized)
     * console.log(appAuthorizeSetting.locationAuthorized)
     * console.log(appAuthorizeSetting.locationReducedAccuracy)
     * console.log(appAuthorizeSetting.microphoneAuthorized)
     * console.log(appAuthorizeSetting.notificationAlertAuthorized)
     * console.log(appAuthorizeSetting.notificationAuthorized)
     * console.log(appAuthorizeSetting.notificationBadgeAuthorized)
     * console.log(appAuthorizeSetting.notificationSoundAuthorized)
     * console.log(appAuthorizeSetting.phoneCalendarAuthorized)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getAppAuthorizeSetting.html
     */
    getAppAuthorizeSetting(): getAppAuthorizeSetting.Result
  }
}

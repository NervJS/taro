declare namespace Taro {
  namespace getSystemInfoSync {
    type Return = {
      /**
       * 手机品牌
       */
      brand: string
      /**
       * 手机型号
       */
      model: string
      /**
       * 设备像素比
       */
      pixelRatio: number
      /**
       * 屏幕宽度
       */
      screenWidth: number
      /**
       * 屏幕高度
       */
      screenHeight: number
      /**
       * 可使用窗口宽度
       */
      windowWidth: number
      /**
       * 可使用窗口高度
       */
      windowHeight: number
      /**
       * 状态栏的高度
       */
      statusBarHeight: number
      /**
       * 微信设置的语言
       */
      language: string
      /**
       * 微信版本号
       */
      version: string
      /**
       * 操作系统版本
       */
      system: string
      /**
       * 客户端平台
       */
      platform: string
      /**
       * 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
       */
      fontSizeSetting: number
      /**
       * 客户端基础库版本
       */
      SDKVersion: string
    }
  }
  /**
   * 获取系统信息同步接口。
   * 
   * 注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion
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
  function getSystemInfoSync(): getSystemInfoSync.Return

  namespace getSystemInfo {
    type Promised = {
      /**
       * 手机品牌
       */
      brand: string
      /**
       * 手机型号
       */
      model: string
      /**
       * 设备像素比
       */
      pixelRatio: string
      /**
       * 屏幕宽度
       */
      screenWidth: number
      /**
       * 屏幕高度
       */
      screenHeight: number
      /**
       * 可使用窗口宽度
       */
      windowWidth: number
      /**
       * 可使用窗口高度
       */
      windowHeight: number
      /**
       * 状态栏的高度
       */
      statusBarHeight: number
      /**
       * 微信设置的语言
       */
      language: string
      /**
       * 微信版本号
       */
      version: string
      /**
       * 操作系统版本
       */
      system: string
      /**
       * 客户端平台
       */
      platform: string
      /**
       * 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
       */
      fontSizeSetting: number
      /**
       * 客户端基础库版本
       */
      SDKVersion: string
    }
    type Param = {}
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
   *   success: function(res) {
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
  function getSystemInfo(res?: getSystemInfo.Param): Promise<getSystemInfo.Promised>
}

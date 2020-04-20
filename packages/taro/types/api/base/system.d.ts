declare namespace Taro {
  /**
   * 系统信息
   */

  namespace getSystemInfoSync {
    type Return = {
      /**
       * 手机品牌
       *
       * @since 1.5.0
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
       *
       * @since 1.1.0
       */
      screenWidth: number
      /**
       * 屏幕高度
       *
       * @since 1.1.0
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
       *
       * @since 1.9.0
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
       *
       * @since 1.5.0
       */
      fontSizeSetting: number
      /**
       * 客户端基础库版本
       *
       * @since 1.1.0
       */
      SDKVersion: string
    }
  }
  /**
   * 获取系统信息同步接口
   *
   * **示例代码：**
   *
   ```javascript
   try {
     var res = Taro.getSystemInfoSync()
     console.log(res.model)
     console.log(res.pixelRatio)
     console.log(res.windowWidth)
     console.log(res.windowHeight)
     console.log(res.language)
     console.log(res.version)
     console.log(res.platform)
   } catch (e) {
     // Do something when catch error
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfoSync.html
   */
  function getSystemInfoSync(): getSystemInfoSync.Return

  namespace getSystemInfo {
    type Promised = {
      /**
       * 手机品牌
       *
       * @since 1.5.0
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
       *
       * @since 1.1.0
       */
      screenWidth: number
      /**
       * 屏幕高度
       *
       * @since 1.1.0
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
       *
       * @since 1.9.0
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
       *
       * @since 1.5.0
       */
      fontSizeSetting: number
      /**
       * 客户端基础库版本
       *
       * @since 1.1.0
       */
      SDKVersion: string
    }
    type Param = {}
  }
  /**
   * 获取系统信息。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getSystemInfo({
     success: function(res) {
       console.log(res.model)
       console.log(res.pixelRatio)
       console.log(res.windowWidth)
       console.log(res.windowHeight)
       console.log(res.language)
       console.log(res.version)
       console.log(res.platform)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfo.html
   */
  function getSystemInfo(OBJECT?: getSystemInfo.Param): Promise<getSystemInfo.Promised>
}

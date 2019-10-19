declare namespace Taro {
  namespace navigateToMiniProgram {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 要打开的小程序 appId
       */
      appId: string
      /**
       * 打开的页面路径，如果为空则打开首页
       */
      path?: string
      /**
       * 需要传递给目标小程序的数据，目标小程序可在 `App.onLaunch()`，`App.onShow()` 中获取到这份数据。[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html)
       */
      extraData?: any
      /**
       * 要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） ，仅在当前小程序为开发版或体验版时此参数有效；如果当前小程序是体验版或正式版，则打开的小程序必定是正式版。默认值 release
       */
      envVersion?: string
    }
  }
  /**
   * @since 1.3.0
   * >
   * > iOS 微信客户端 6.5.9 版本开始支持，Android 客户端即将在 6.5.10 版本开始支持，请先使用 iOS 客户端进行调试
   *
   * 打开同一公众号下关联的另一个小程序。**（注：必须是同一公众号下，而非同个 open 账号下）**
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 在开发者工具上调用此 API 并不会真实的跳转到另外的小程序，但是开发者工具会校验本次调用跳转是否成功[详情](https://developers.weixin.qq.com/miniprogram/dev/devtools/different.html#小程序跳转的调试支持)
   * 2.  `tip`: 开发者工具上支持被跳转的小程序处理接收参数的调试[详情](https://developers.weixin.qq.com/miniprogram/dev/devtools/different.html#小程序跳转的调试支持)
   * 3.  `tip`: 只有同一公众号下的关联的小程序之间才可相互跳转 [详情](https://mp.weixin.qq.com/debug/wxadoc/introduction/index.html#%E5%85%AC%E4%BC%97%E5%8F%B7%E5%85%B3%E8%81%94%E5%B0%8F%E7%A8%8B%E5%BA%8F)
   *
   * **示例代码：**
   *
   ```javascript
   Taro.navigateToMiniProgram({
     appId: '',
     path: 'pages/index/index?id=123',
     extraData: {
       foo: 'bar'
     },
     envVersion: 'develop',
     success(res) {
       // 打开成功
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html
   */
  function navigateToMiniProgram(OBJECT: navigateToMiniProgram.Param): Promise<navigateToMiniProgram.Promised>

  namespace navigateBackMiniProgram {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 需要返回给上一个小程序的数据，上一个小程序可在 `App.onShow()` 中获取到这份数据。[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html)
       */
      extraData?: any
    }
  }
  /**
   * @since 1.3.0
   * >
   * > iOS 微信客户端 6.5.9 版本开始支持，Android 客户端即将在 6.5.10 版本开始支持，请先使用 iOS 客户端进行调试
   *
   * 返回到上一个小程序，只有在当前小程序是被其他小程序打开时可以调用成功
   *
   * **示例代码：**
   *
   ```javascript
   Taro.navigateBackMiniProgram({
     extraData: {
       foo: 'bar'
     },
     success(res) {
       // 返回成功
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateBackMiniProgram.html
   */
  function navigateBackMiniProgram(OBJECT?: navigateBackMiniProgram.Param): Promise<navigateBackMiniProgram.Promised>
}

declare namespace Taro {
  namespace openSetting {
    type Promised = {
      /**
       * 用户授权结果，其中 key 为 scope 值，value 为 Bool 值，表示用户是否允许授权，详见 [scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)
       */
      authSetting: any
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 调起客户端小程序设置界面，返回用户设置的操作结果。
   *
   * 注：设置界面只会出现小程序已经向用户请求过的权限。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.openSetting({
     success: (res) => {
              // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
           }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.openSetting.html
   */
  function openSetting(OBJECT?: openSetting.Param): Promise<openSetting.Promised>

  namespace getSetting {
    type Promised = {
      /**
       * 用户授权结果，其中 key 为 scope 值，value 为 Bool 值，表示用户是否允许授权，详见 [scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)
       */
      authSetting: any
    }
    type Param = {}
  }
  /**
   * @since 1.2.0
   *
   * 获取用户的当前设置。
   *
   * 注：返回值中只会出现小程序已经向用户请求过的权限。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getSetting({
     success: (res) => {
              // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
           }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html
   */
  function getSetting(OBJECT?: getSetting.Param): Promise<getSetting.Promised>
}

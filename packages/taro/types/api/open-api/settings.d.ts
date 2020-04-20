declare namespace Taro {
  namespace openSetting {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends General.CallbackResult {
      /** 用户授权结果 */
      authSetting: AuthSetting
      /** 调用结果 */
      errMsg: string
    }
  }

  /** 调起客户端小程序设置界面，返回用户设置的操作结果。**设置界面只会出现小程序已经向用户请求过的[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)**。
   *
   * 注意：[2.3.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 版本开始，用户发生点击行为后，才可以跳转打开设置页，管理授权信息。[详情](https://developers.weixin.qq.com/community/develop/doc/000cea2305cc5047af5733de751008)
   * @supported weapp
   * @example
   * ```tsx
   * Taro.openSetting({
   *   success: function (res) {
   *     console.log(res.authSetting)
   *     // res.authSetting = {
   *     //   "scope.userInfo": true,
   *     //   "scope.userLocation": true
   *     // }
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.openSetting.html
   */
  function openSetting(option?: openSetting.Option): Promise<openSetting.SuccessCallbackResult>

  namespace getSetting {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends General.CallbackResult {
      /** 用户授权结果 */
      authSetting: AuthSetting
      /** 调用结果 */
      errMsg: string
    }
  }

  /** 获取用户的当前设置。**返回值中只会出现小程序已经向用户请求过的[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)**。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.getSetting({
   *   success: function (res) {
   *     console.log(res.authSetting)
   *     // res.authSetting = {
   *     //   "scope.userInfo": true,
   *     //   "scope.userLocation": true
   *     // }
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html
   */
  function getSetting(option?: getSetting.Option): Promise<getSetting.SuccessCallbackResult>

  /** 用户授权设置信息，详情参考[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)
   * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
  */
  interface AuthSetting {
    /** 是否授权通讯地址，对应接口 [wx.chooseAddress](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html) */
    'scope.address'?: boolean
    /** 是否授权摄像头，对应[[camera](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html)](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) 组件 */
    'scope.camera'?: boolean
    /** 是否授权获取发票，对应接口 [wx.chooseInvoice](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoice.html) */
    'scope.invoice'?: boolean
    /** 是否授权发票抬头，对应接口 [wx.chooseInvoiceTitle](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html) */
    'scope.invoiceTitle'?: boolean
    /** 是否授权录音功能，对应接口 [wx.startRecord](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html) */
    'scope.record'?: boolean
    /** 是否授权用户信息，对应接口 [wx.getUserInfo](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html) */
    'scope.userInfo'?: boolean
    /** 是否授权地理位置，对应接口 [wx.getLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html), [wx.chooseLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html) */
    'scope.userLocation'?: boolean
    /** 是否授权微信运动步数，对应接口 [wx.getWeRunData](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html) */
    'scope.werun'?: boolean
    /** 是否授权保存到相册 [wx.saveImageToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html), [wx.saveVideoToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html) */
    'scope.writePhotosAlbum'?: boolean
  }
}

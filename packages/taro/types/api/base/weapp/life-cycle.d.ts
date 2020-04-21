declare namespace Taro {
  /**
   * 获取小程序启动时的参数。与 [`App.onLaunch`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onlaunchobject-object) 的回调参数一致。
   *
   * **注意**
   * 部分版本在无`referrerInfo`的时候会返回 `undefined`，建议使用 `options.referrerInfo && options.referrerInfo.appId` 进行判断。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html
   */
  function getLaunchOptionsSync(): General.LaunchOptionsApp
}

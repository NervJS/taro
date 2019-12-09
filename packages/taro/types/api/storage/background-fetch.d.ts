declare namespace Taro {
  // 周期性更新

  namespace setBackgroundFetchToken {
    interface Option {
      /** 自定义的登录态 */
      token: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 设置自定义登录态，在周期性拉取数据时带上，便于第三方服务器验证请求合法性
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/background-fetch/wx.setBackgroundFetchToken.html
   */
  function setBackgroundFetchToken(option: setBackgroundFetchToken.Option): void

  namespace onBackgroundFetchData {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 收到 backgroundFetch 数据时的回调
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/background-fetch/wx.onBackgroundFetchData.html
   */
  function onBackgroundFetchData(option?: onBackgroundFetchData.Option): void

  namespace getBackgroundFetchToken {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 获取设置过的自定义登录态。若无，则返回 fail。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/background-fetch/wx.getBackgroundFetchToken.html
   */
  function getBackgroundFetchToken(option?: getBackgroundFetchToken.Option): void

  namespace getBackgroundFetchData {
    interface Option {
      /** 取值为 periodic */
      fetchType: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 拉取 backgroundFetch 客户端缓存数据
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/background-fetch/wx.getBackgroundFetchData.html
   */
  function getBackgroundFetchData(option: getBackgroundFetchData.Option): void
}

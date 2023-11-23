import Taro from '../../index'

declare module '../../index' {
  namespace pluginLogin {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 用于换取 openpid 的凭证（有效期五分钟）。插件开发者可以用此 code 在开发者服务器后台调用 [auth.getPluginOpenPId](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/user-info/auth.getPluginOpenPId.html) 换取 openpid。 */
      code: string
    }
  }

  namespace login {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 超时时间，单位ms */
      timeout?: number
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 [auth.code2Session](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html)，使用 code 换取 openid 和 session_key 等信息 */
      code: string
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace checkSession {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** **该接口仅在小程序插件中可调用**，调用接口获得插件用户标志凭证（code）。插件可以此凭证换取用于识别用户的标识 openpid。用户不同、宿主小程序不同或插件不同的情况下，该标识均不相同，即当且仅当同一个用户在同一个宿主小程序中使用同一个插件时，openpid 才会相同
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.pluginLogin.html
     */
    pluginLogin(option?: pluginLogin.Option): Promise<pluginLogin.SuccessCallbackResult>

    /** 调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成。更多使用方法详见 [小程序登录](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.login({
     *   success: function (res) {
     *     if (res.code) {
     *       //发起网络请求
     *       Taro.request({
     *         url: 'https://test.com/onLogin',
     *         data: {
     *           code: res.code
     *         }
     *       })
     *     } else {
     *       console.log('登录失败！' + res.errMsg)
     *     }
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
     */
    login(option?: login.Option): Promise<login.SuccessCallbackResult>

    /** 检查登录态是否过期。
     *
     * 通过 Taro.login 接口获得的用户登录态拥有一定的时效性。用户越久未使用小程序，用户登录态越有可能失效。反之如果用户一直在使用小程序，则用户登录态一直保持有效。具体时效逻辑由微信维护，对开发者透明。开发者只需要调用 Taro.checkSession 接口检测当前用户登录态是否有效。
     *
     * 登录态过期后开发者可以再调用 Taro.login 获取新的用户登录态。调用 Taro.checkSession 成功说明当前 session_key 未过期，调用失败说明 session_key 已过期。更多使用方法详见 [小程序登录](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.checkSession({
     *   success: function () {
     *     //session_key 未过期，并且在本生命周期一直有效
     *   },
     *   fail: function () {
     *     // session_key 已经失效，需要重新执行登录流程
     *     Taro.login() //重新登录
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.checkSession.html
     */
    checkSession(option?: checkSession.Option): Promise<TaroGeneral.CallbackResult>
  }
}

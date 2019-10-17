declare namespace Taro {
  namespace login {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
      /**
       * 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
       */
      code: string
    }
    type Param = {
      /**
       * 超时时间，单位 ms
       *
       * @since 1.9.90
       */
      timeout?: number
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 登录接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: Promised) => void
    /**
     * 登录接口调用失败的回调函数
     */
    type ParamPropFail = (err: Promised) => void
    /**
     * 登录接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = (err: Promised) => void
  }
  /**
   * 调用接口Taro.login() 获取**临时登录凭证（code）**
   *
   * **示例代码：**
   *
   ```javascript
   //app.js
   App({
     onLaunch: function() {
       Taro.login({
         success: function(res) {
           if (res.code) {
             //发起网络请求
             Taro.request({
               url: 'https://test.com/onLogin',
               data: {
                 code: res.code
               }
             })
           } else {
             console.log('登录失败！' + res.errMsg)
           }
         }
       });
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
   */
  function login(OBJECT?: login.Param): Promise<login.Promised>

  namespace checkSession {
    type Param = {}
  }
  /**
   * 校验用户当前session_key是否有效。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.checkSession({
     success: function(){
       //session_key 未过期，并且在本生命周期一直有效
     },
     fail: function(){
       // session_key 已经失效，需要重新执行登录流程
       Taro.login() //重新登录
       ....
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.checkSession.html
   */
  function checkSession(OBJECT?: checkSession.Param): Promise<any>
}

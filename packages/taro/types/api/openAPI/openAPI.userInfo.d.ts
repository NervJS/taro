declare namespace Taro {
  namespace getUserInfo {
    type Promised = {
      /**
       * 用户信息对象，不包含 openid 等敏感信息
       */
      userInfo: PromisedPropUserInfo
      /**
       * 不包括敏感信息的原始数据字符串，用于计算签名。
       */
      rawData: string
      /**
       * 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档 [signature](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)。
       */
      signature: string
      /**
       * 包括敏感数据在内的完整用户信息的加密数据，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       */
      encryptedData: string
      /**
       * 加密算法的初始向量，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       */
      iv: string
      /**
       * 敏感数据对应的云 ID，开通[云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud)
       */
      cloudID: string
    }
    /**
     * 用户信息对象，不包含 openid 等敏感信息
     */
    type PromisedPropUserInfo = {
      /**
       * 用户昵称
       */
      nickName: string
      /**
       * 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
       */
      avatarUrl: string
      /**
       * 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
       */
      gender: 0 | 1 | 2
      /**
       * 用户所在城市
       */
      city: string
      /**
       * 用户所在省份
       */
      province: string
      /**
       * 用户所在国家
       */
      country: string
      /**
       * 用户的语言，简体中文为zh_CN
       */
      language: string
    }
    type Param = {
      /**
       * 是否带上登录态信息
       *
       * @since 1.1.0
       */
      withCredentials?: boolean
      /**
       * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en。
       *
       * @since 1.3.0
       */
      lang?: string
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
     * 获取用户信息接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: Promised) => void
    /**
     * 获取用户信息接口调用失败的回调函数
     */
    type ParamPropFail = (err: Promised) => void
    /**
     * 获取用户信息接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = (err: Promised) => void
  }
  /**
   * 获取用户信息，withCredentials 为 true 时需要先调用 [Taro.login](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html) 接口。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.userInfo
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getUserInfo({
     success: function(res) {
       var userInfo = res.userInfo
       var nickName = userInfo.nickName
       var avatarUrl = userInfo.avatarUrl
       var gender = userInfo.gender //性别 0：未知、1：男、2：女
       var province = userInfo.province
       var city = userInfo.city
       var country = userInfo.country
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```json
   {
       "openId": "OPENID",
       "nickName": "NICKNAME",
       "gender": GENDER,
       "city": "CITY",
       "province": "PROVINCE",
       "country": "COUNTRY",
       "avatarUrl": "AVATARURL",
       "unionId": "UNIONID",
       "watermark":
       {
           "appid":"APPID",
       "timestamp":TIMESTAMP
       }
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html
   */
  function getUserInfo(OBJECT?: getUserInfo.Param): Promise<getUserInfo.Promised>
}

declare namespace Taro {
  namespace getUserInfo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 显示用户信息的语言 */
      lang?: keyof UserInfo.language
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 是否带上登录态信息。当 withCredentials 为 true 时，要求此前有调用过 Taro.login 且登录态尚未过期，此时返回的数据会包含 encryptedData, iv 等敏感信息；当 withCredentials 为 false 时，不要求有登录态，返回的数据不包含 encryptedData, iv 等敏感信息。 */
      withCredentials?: boolean
    }

    interface SuccessCallbackResult extends General.CallbackResult {
      /** 敏感数据对应的云 ID，开通[云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud) */
      cloudID: string
      /** 包括敏感数据在内的完整用户信息的加密数据，详见 [用户数据的签名验证和加解密]((signature#加密数据解密算法)) */
      encryptedData: string
      /** 加密算法的初始向量，详见 [用户数据的签名验证和加解密]((signature#加密数据解密算法)) */
      iv: string
      /** 不包括敏感信息的原始数据字符串，用于计算签名 */
      rawData: string
      /** 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，详见 [用户数据的签名验证和加解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html) */
      signature: string
      /** 用户信息对象，不包含 openid 等敏感信息 */
      userInfo: UserInfo
      /** 调用结果 */
      errMsg: string
    }
  }

  /** 获取用户信息。
   *
   * **接口调整说明**
   * 在用户未授权过的情况下调用此接口，将不再出现授权弹窗，会直接进入 fail 回调（详见[《公告》](https://developers.weixin.qq.com/community/develop/doc/0000a26e1aca6012e896a517556c01))。在用户已授权的情况下调用此接口，可成功获取用户信息。
   * @supported weapp
   * @example
   * ```tsx
   * // 必须是在用户已经授权的情况下调用
   * Taro.getUserInfo({
   *   success: function(res) {
   *     var userInfo = res.userInfo
   *     var nickName = userInfo.nickName
   *     var avatarUrl = userInfo.avatarUrl
   *     var gender = userInfo.gender //性别 0：未知、1：男、2：女
   *     var province = userInfo.province
   *     var city = userInfo.city
   *     var country = userInfo.country
   *   }
   * })
   * ```
   *
   * 敏感数据有两种获取方式，一是使用 [加密数据解密算法]((open-ability/signature#加密数据解密算法)) 。
   * 获取得到的开放数据为以下 json 结构：
   *
   * ```json
   * {
   *   "openId": "OPENID",
   *   "nickName": "NICKNAME",
   *   "gender": GENDER,
   *   "city": "CITY",
   *   "province": "PROVINCE",
   *   "country": "COUNTRY",
   *   "avatarUrl": "AVATARURL",
   *   "unionId": "UNIONID",
   *   "watermark": {
   *     "appid":"APPID",
   *     "timestamp": TIMESTAMP
   *   }
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html
   */
  function getUserInfo(option?: getUserInfo.Option): Promise<getUserInfo.SuccessCallbackResult>


    
  /** 用户信息
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html
   */
  interface UserInfo {
    /** 用户头像图片的 URL。URL 最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 640x640 的正方形头像，46 表示 46x46 的正方形头像，剩余数值以此类推。默认132），用户没有头像时该项为空。若用户更换头像，原有头像 URL 将失效。 */
    avatarUrl: string
    /** 用户所在城市 */
    city: string
    /** 用户所在国家 */
    country: string
    /** 用户性别 */
    gender: keyof UserInfo.gender
    /** 显示 country，province，city 所用的语言 */
    language: keyof UserInfo.language
    /** 用户昵称 */
    nickName: string
    /** 用户所在省份 */
    province: string
  }

  namespace UserInfo {
    interface language {
      en: '英文'
      zh_CN: '简体中文'
      zh_TW: '繁体中文'
    }

    interface gender {
      0: '未知'
      1: '男性'
      2: '女性'
    }
  }
}

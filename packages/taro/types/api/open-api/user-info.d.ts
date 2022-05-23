import Taro from '../../index'

declare module '../../index' {
  namespace getUserInfo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 显示用户信息的语言 */
      lang?: keyof UserInfo.Language
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 是否带上登录态信息。当 withCredentials 为 true 时，要求此前有调用过 Taro.login 且登录态尚未过期，此时返回的数据会包含 encryptedData, iv 等敏感信息；当 withCredentials 为 false 时，不要求有登录态，返回的数据不包含 encryptedData, iv 等敏感信息。 */
      withCredentials?: boolean
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 敏感数据对应的云 ID，开通[云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud) */
      cloudID?: string
      /** 包括敏感数据在内的完整用户信息的加密数据，详见 [用户数据的签名验证和加解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95) */
      encryptedData: string
      /** 加密算法的初始向量，详见 [用户数据的签名验证和加解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95) */
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

  namespace getUserProfile {
    interface Option {
      /** 显示用户信息的语言 */
      lang?: keyof UserInfo.Language
      /** 声明获取用户个人信息后的用途，不超过30个字符 */
      desc: string
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }

    interface SuccessCallbackResult extends getUserInfo.SuccessCallbackResult {
      /** 用户信息对象 */
      userInfo: UserInfo
      /** 不包括敏感信息的原始数据字符串，用于计算签名 */
      rawData: string
      /** 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，详见 [用户数据的签名验证和加解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html) */
      signature: string
      /** 包括敏感数据在内的完整用户信息的加密数据，详见 [用户数据的签名验证和加解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95) */
      encryptedData: string
      /** 加密算法的初始向量，详见 [用户数据的签名验证和加解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95) */
      iv: string
      /** 敏感数据对应的云 ID，开通云开发的小程序才会返回，可通过云调用直接获取开放数据，详细 [见云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud) */
      cloudID: string
    }
  }

  /** 用户信息
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html
   */
  interface UserInfo {
    /** 用户昵称 */
    nickName: string
    /** 用户头像图片的 URL。URL 最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 640x640 的正方形头像，46 表示 46x46 的正方形头像，剩余数值以此类推。默认132），用户没有头像时该项为空。若用户更换头像，原有头像 URL 将失效。 */
    avatarUrl: string
    /** 用户性别。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) */
    gender?: keyof UserInfo.Gender
    /** 用户所在国家。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) */
    country: string
    /** 用户所在省份。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) */
    province: string
    /** 用户所在城市。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) */
    city: string
    /** 显示 country，province，city 所用的语言。强制返回 “zh_CN”，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) */
    language: keyof UserInfo.Language
  }

  namespace UserInfo {
    interface Language {
      en: '英文'
      zh_CN: '简体中文'
      zh_TW: '繁体中文'
    }

    interface Gender {
      0: '未知'
      1: '男性'
      2: '女性'
    }
  }

  interface TaroStatic {
    /** 获取用户信息。
     *
     * **接口调整说明**
     * 在用户未授权过的情况下调用此接口，将不再出现授权弹窗，会直接进入 fail 回调（详见[《公告》](https://developers.weixin.qq.com/community/develop/doc/0000a26e1aca6012e896a517556c01))。在用户已授权的情况下调用此接口，可成功获取用户信息。
     * @supported weapp, tt
     * @example
     * ```tsx
     * // 必须是在用户已经授权的情况下调用
     *
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
     * 敏感数据有两种获取方式，一是使用 [加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95) 。
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
    getUserInfo(option?: getUserInfo.Option): Promise<getUserInfo.SuccessCallbackResult>

    /**
     * 获取用户信息。每次请求都会弹出授权窗口，用户同意后返回 `userInfo`。
     *
     * 若开发者需要获取用户的个人信息（头像、昵称、性别与地区），可以通过 Taro.getUserProfile 接口进行获取，
     *
     * 微信该接口从基础库 **2.10.4** 版本开始支持，该接口只返回用户个人信息，不包含用户身份标识符。该接口中 desc 属性（声明获取用户个人信息后的用途）后续会展示在弹窗中，请开发者谨慎填写。
     *
     * 开发者每次通过该接口获取用户个人信息均需用户确认，请开发者妥善保管用户快速填写的头像昵称，避免重复弹窗。
     *
     * [微信端调整背景和说明，请参考文档](https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801)
     * @supported weapp, tt
     * @example
     * 推荐使用 Taro.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
     *
     * ```tsx
     * Taro.getUserProfile({
     *   desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
     *   success: (res) => {
     *     // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
     *     this.setState({
     *       userInfo: res.userInfo,
     *       hasUserInfo: true
     *     })
     *   }
     * })
     * ```
     * @since 2.2.17+，3.0.29+
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html
     */
    getUserProfile(option: getUserProfile.Option): Promise<getUserProfile.SuccessCallbackResult>
  }
}

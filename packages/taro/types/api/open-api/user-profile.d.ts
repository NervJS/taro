declare namespace Taro {
  namespace getUserProfile {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 显示用户信息的语言 */
      lang?: keyof UserInfo.language
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 声明获取用户个人信息后的用途，不超过30个字符 */
      desc: string
    }

    interface SuccessCallbackResult extends General.CallbackResult {
      /** 用户信息对象，不包含 openid 等敏感信息 */
      userInfo: UserInfo
      /** 调用结果 */
      errMsg: string
    }
  }

  function getUserProfile(option?: getUserProfile.Option): Promise<getUserProfile.SuccessCallbackResult>


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

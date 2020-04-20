declare namespace Taro {
  namespace openCard {
    interface Option {
      /** 需要打开的卡券列表 */
      cardList: RequestInfo[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }

    /** 需要打开的卡券列表 */
    interface RequestInfo {
      /** 卡券 ID */
      cardId: string
      /** 由 Taro.addCard 的返回对象中的加密 code 通过解密后得到，解密请参照：[code 解码接口](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1499332673_Unm7V) */
      code: string
    }
  }

  /** 查看微信卡包中的卡券。只有通过 [认证](https://developers.weixin.qq.com/miniprogram/product/renzheng.html) 的小程序或文化互动类目的小游戏才能使用。更多文档请参考 [微信卡券接口文档](https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=1490190158&version=1&lang=zh_CN&platform=2)。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.openCard({
   *   cardList: [{
   *     cardId: '',
   *     code: ''
   *   }, {
   *     cardId: '',
   *     code: ''
   *   }],
   *   success: function (res) { }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.openCard.html
   */
  function openCard(option: openCard.Option): Promise<General.CallbackResult>

  namespace addCard {
    interface Option {
      /** 需要添加的卡券列表 */
      cardList: RequestInfo[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    /** 需要添加的卡券列表 */
    interface RequestInfo {
      /** 卡券的扩展参数。需将 CardExt 对象 JSON 序列化为**字符串**传入 */
      cardExt: string
      /** 卡券 ID */
      cardId: string
    }

    interface SuccessCallbackResult extends General.CallbackResult {
      /** 卡券添加结果列表 */
      cardList: AddCardResponseInfo[]
      /** 调用结果 */
      errMsg: string
    }
    /** 卡券添加结果列表 */
    interface AddCardResponseInfo {
      /** 卡券的扩展参数，结构请参考下文 */
      cardExt: string
      /** 用户领取到卡券的 ID */
      cardId: string
      /** 加密 code，为用户领取到卡券的code加密后的字符串，解密请参照：[code 解码接口](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1499332673_Unm7V) */
      code: string
      /** 是否成功 */
      isSuccess: boolean
    }
  }

  /** 批量添加卡券。只有通过 [认证](https://developers.weixin.qq.com/miniprogram/product/renzheng.html) 的小程序或文化互动类目的小游戏才能使用。更多文档请参考 [微信卡券接口文档](https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=1490190158&version=1&lang=zh_CN&platform=2)。
   *
   * **cardExt 说明**
   * cardExt 是卡券的扩展参数，其值是一个 JSON 字符串。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.addCard({
   *   cardList: [
   *     {
   *       cardId: '',
   *       cardExt: '{"code": "", "openid": "", "timestamp": "", "signature":""}'
   *     }, {
   *       cardId: '',
   *       cardExt: '{"code": "", "openid": "", "timestamp": "", "signature":""}'
   *     }
   *   ],
   *   success: function (res) {
   *     console.log(res.cardList) // 卡券添加结果
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.addCard.html
   */
  function addCard(option: addCard.Option): Promise<addCard.SuccessCallbackResult>
}

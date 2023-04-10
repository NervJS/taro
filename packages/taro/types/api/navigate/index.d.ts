import Taro from '../../index'

declare module '../../index' {
  namespace openEmbeddedMiniProgram {
    interface Option {
      /** 要打开的小程序 appId */
      appId?: string
      /** 打开的页面路径，如果为空则打开首页。path 中 ? 后面的部分会成为 query，在小程序的 `App.onLaunch`、`App.onShow` 和 `Page.onLoad` 的回调函数或小游戏的 [Taro.onShow](#) 回调函数、[Taro.getLaunchOptionsSync](/docs/apis/base/weapp/life-cycle/getLaunchOptionsSync) 中可以获取到 query 数据。对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"。 */
      path?: string
      /** 需要传递给目标小程序的数据，目标小程序可在 `App.onLaunch`，`App.onShow` 中获取到这份数据。如果跳转的是小游戏，可以在 [Taro.onShow](#)、[Taro.getLaunchOptionsSync](/docs/apis/base/weapp/life-cycle/getLaunchOptionsSync) 中可以获取到这份数据数据。 */
      extraData?: TaroGeneral.IAnyObject
      /** 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。 */
      envVersion?: keyof EnvVersion
      /** 小程序链接，当传递该参数后，可以不传 appId 和 path。链接可以通过【小程序菜单】->【复制链接】获取。 */
      shortLink?: string
      /** 校验方式 。默认为binding */
      verify?: keyof Verify
      /** 不 reLaunch 目标小程序，直接打开目标跳转的小程序退后台时的页面，需满足以下条件：1. 目标跳转的小程序生命周期未被销毁；2. 且目标当次启动的path、query、apiCategory与上次启动相同。默认值为 false 。 */
      noRelaunchIfPathUnchanged?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }

    interface Verify {
      /** 校验小程序管理后台的绑定关系 */
      binding
      /** 校验目标打开链接是否为小程序联盟商品。 */
      unionProduct
    }

    interface EnvVersion {
      /** 开发版 */
      develop
      /** 体验版 */
      trial
      /** 正式版 */
      release
    }
  }

  namespace navigateToMiniProgram {
    interface Option {
      /** 要打开的小程序 appId */
      appId?: string
      /** 打开的页面路径，如果为空则打开首页。path 中 ? 后面的部分会成为 query，在小程序的 `App.onLaunch`、`App.onShow` 和 `Page.onLoad` 的回调函数或小游戏的 [Taro.onShow](#) 回调函数、[Taro.getLaunchOptionsSync](/docs/apis/base/weapp/life-cycle/getLaunchOptionsSync) 中可以获取到 query 数据。对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"。 */
      path?: string
      /** 需要传递给目标小程序的数据，目标小程序可在 `App.onLaunch`，`App.onShow` 中获取到这份数据。如果跳转的是小游戏，可以在 [Taro.onShow](#)、[Taro.getLaunchOptionsSync](/docs/apis/base/weapp/life-cycle/getLaunchOptionsSync) 中可以获取到这份数据数据。 */
      extraData?: TaroGeneral.IAnyObject
      /** 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。 */
      envVersion?: keyof EnvVersion
      /** 小程序链接，当传递该参数后，可以不传 appId 和 path。链接可以通过【小程序菜单】->【复制链接】获取。 */
      shortLink?: string
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }

    interface EnvVersion {
      /** 开发版 */
      develop
      /** 体验版 */
      trial
      /** 正式版 */
      release
    }
  }

  namespace navigateBackMiniProgram {
    interface Option {
      /** 需要返回给上一个小程序的数据，上一个小程序可在 `App.onShow` 中获取到这份数据。 [详情](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html)。 */
      extraData?: TaroGeneral.IAnyObject
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace exitMiniProgram {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace openBusinessView {
    /**
     * wxpayScoreEnable 业务参数
     * @see https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter6_1_9.shtml
     */
    interface ScoreEnableExtraData {
      /**
       * 用于跳转到微信侧小程序授权数据,跳转到微信侧小程序传入，有效期为1小时；apply_permissions_token可以从[《商户预授权API》](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter6_1_2.shtml)接口的返回参数中获取。
       * 示例值：1230000109
       * @type {string[1,2048]}
       */
      apply_permissions_token: string
    }
    /**
     * wxpayScoreUse 业务参数
     * @see https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter6_1_13.shtml
     */
    interface ScoreUsedExtraData {
      /**
       * 商户号：微信支付分配的商户号。
       * 示例值：1230000109
       * @type {string[1,32]}
       */
      mch_id: string
      /**
       * 可在【创建订单】接口的返回字段package中获取。
       * 示例值：XXXXXXXX
       * @type {string[1,128]}
       */
      package: string
      /**
       * 时间戳：生成签名时间戳，单位秒。
       * 示例值：1530097563
       * @type {string[1,32]}
       */
      timestamp: string
      /**
       * 随机字符串：生成签名随机串。由数字、大小写字母组成，长度不超过32位。
       * 示例值：zyx53Nkey8o4bHpxTQvd8m7e92nG5mG2
       * @type {string[1,32]}
       */
      nonce_str: string
      /**
       * 签名方式：签名类型，仅支持HMAC-SHA256。
       * 示例值：HMAC-SHA256
       * @type {string[1,32]}
       */
      sign_type: string
      /**
       * 签名：使用字段mch_id、service_id、out_order_no、timestamp、nonce_str、sign_type按照签名生成算法计算得出的签名值。
       * 示例值：029B52F67573D7E3BE74904BF9AEA
       * @type {string[1,64]}
       */
      sign: string
    }
    /**
     * wxpayScoreDetail 业务参数
     * @see https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter6_1_25.shtml
     */
    interface ScoreDetailExtraData {
      /**
       * 商户号：微信支付分配的商户号。
       * 示例值：1230000109
       * @type {string[1,32]}
       */
      mch_id: string
      /**
       * 服务ID
       * 示例值：88888888000011
       * @type {string[1,32]}
       */
      service_id: string
      /**
       * 商户服务订单号：商户系统内部服务订单号（不是交易单号）。
       * 示例值：234323JKHDFE1243252
       * @type {string[1,32]}
       */
      out_order_no: string
      /**
       * 时间戳：生成签名时间戳，单位秒。
       * 示例值：1530097563
       * @type {string[1,32]}
       */
      timestamp: string
      /**
       * 随机字符串：生成签名随机串。由数字、大小写字母组成，长度不超过32位。
       * 示例值：zyx53Nkey8o4bHpxTQvd8m7e92nG5mG2
       * @type {string[1,32]}
       */
      nonce_str: string
      /**
       * 签名方式：签名类型，仅支持HMAC-SHA256。
       * 示例值：HMAC-SHA256
       * @type {string[1,32]}
       */
      sign_type: string
      /**
       * 签名：使用字段mch_id、service_id、out_order_no、timestamp、nonce_str、sign_type按照签名生成算法计算得出的签名值。
       * 示例值：029B52F67573D7E3BE74904BF9AEA
       * @type {string[1,64]}
       */
      sign: string
    }

    interface Option {
      /**
       * 跳转类型：固定配置：wxpayScoreDetail
       * 示例值：wxpayScoreDetail
       * @type {string[1,16]}
       * @memberof Option
       */
      businessType: 'wxpayScoreEnable' | 'wxpayScoreUse' | 'wxpayScoreDetail' | string
      /** 业务参数：需要传递给支付分的业务数据 */
      extraData: ScoreEnableExtraData | ScoreUsedExtraData | ScoreDetailExtraData
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 打开半屏小程序。接入指引请参考 [半屏小程序能力](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/openEmbeddedMiniProgram.html)。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/navigate/wx.openEmbeddedMiniProgram.html
     */
    openEmbeddedMiniProgram(option?: openEmbeddedMiniProgram.Option): Promise<TaroGeneral.CallbackResult>

    /** 打开另一个小程序
     *
     * **使用限制**
     * ##### 需要用户触发跳转
     * 从 2.3.0 版本开始，若用户未点击小程序页面任意位置，则开发者将无法调用此接口自动跳转至其他小程序。
     * ##### 需要用户确认跳转
     * 从 2.3.0 版本开始，在跳转至其他小程序前，将统一增加弹窗，询问是否跳转，用户确认后才可以跳转其他小程序。如果用户点击取消，则回调 `fail cancel`。
     * ##### 每个小程序可跳转的其他小程序数量限制为不超过 10 个
     * 从 2.4.0 版本以及指定日期（具体待定）开始，开发者提交新版小程序代码时，如使用了跳转其他小程序功能，则需要在代码配置中声明将要跳转的小程序名单，限定不超过 10 个，否则将无法通过审核。该名单可在发布新版时更新，不支持动态修改。配置方法详见 [小程序全局配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)。调用此接口时，所跳转的 appId 必须在配置列表中，否则回调 `fail appId "${appId}" is not in navigateToMiniProgramAppIdList`。
     *
     * **关于调试**
     * - 在开发者工具上调用此 API 并不会真实的跳转到另外的小程序，但是开发者工具会校验本次调用跳转是否成功。[详情](https://developers.weixin.qq.com/miniprogram/dev/devtools/different.html#跳转小程序调试支持)
     * - 开发者工具上支持被跳转的小程序处理接收参数的调试。[详情](https://developers.weixin.qq.com/miniprogram/dev/devtools/different.html#跳转小程序调试支持)
     * @supported weapp, tt
     * @example
     * ```tsx
     * Taro.navigateToMiniProgram({
     *   appId: '',
     *   path: 'page/index/index?id=123',
     *   extraData: {
     *     foo: 'bar'
     *   },
     *   envVersion: 'develop',
     *   success: function(res) {
     *     // 打开成功
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html
     */
    navigateToMiniProgram(option: navigateToMiniProgram.Option): Promise<TaroGeneral.CallbackResult>

    /** 返回到上一个小程序。只有在当前小程序是被其他小程序打开时可以调用成功
     *
     * 注意：**微信客户端 iOS 6.5.9，Android 6.5.10 及以上版本支持**
     * @supported weapp, tt
     * @example
     * ```tsx
     * Taro.navigateBackMiniProgram({
     *   extraData: {
     *     foo: 'bar'
     *   },
     *   success: function (res) {
     *     // 返回成功
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateBackMiniProgram.html
     */
    navigateBackMiniProgram(option: navigateBackMiniProgram.Option): Promise<TaroGeneral.CallbackResult>

    /** 退出当前小程序。必须有点击行为才能调用成功。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.exitMiniProgram()
     * ···
     *
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/navigate/wx.exitMiniProgram.html
     */
    exitMiniProgram(option?: exitMiniProgram.Option): Promise<TaroGeneral.CallbackResult>

    /** 商户通过调用订单详情接口打开微信支付分小程序，引导用户查看订单详情（小程序端）
     * @supported weapp
     * @example
     * ```tsx
     * if (Taro.openBusinessView) {
     *   Taro.openBusinessView({
     *     businessType: 'wxpayScoreDetail',
     *     extraData: {
     *       mch_id: '1230000109',
     *       service_id: '88888888000011',
     *       out_order_no: '1234323JKHDFE1243252',
     *       timestamp: '1530097563',
     *       nonce_str: 'zyx53Nkey8o4bHpxTQvd8m7e92nG5mG2',
     *       sign_type: 'HMAC-SHA256',
     *       sign: '029B52F67573D7E3BE74904BF9AEA'
     *     },
     *     success() {
     *       //dosomething
     *     },
     *     fail() {
     *       //dosomething
     *     },
     *     complete() {
     *       //dosomething
     *     }
     *   });
     * } else {
     *   //引导用户升级微信版本
     * }
     * ```
     * @see https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter6_1_25.shtml
     */
    openBusinessView(option: openBusinessView.Option): Promise<TaroGeneral.CallbackResult>
  }
}

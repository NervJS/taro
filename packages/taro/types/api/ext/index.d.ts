declare namespace Taro {
  namespace getExtConfigSync {
    interface ExtInfo {
      /** 第三方平台自定义的数据 */
      extConfig: General.IAnyObject
    }
  }

  /** Taro.getExtConfig 的同步版本。
   *
   * **Tips**
   * 1. 本接口暂时无法通过 Taro.canIUse 判断是否兼容，开发者需要自行判断 Taro.getExtConfigSync 是否存在来兼容
   * @supported weapp
   * @example
   * ```tsx
   * let extConfig = Taro.getExtConfigSync? Taro.getExtConfigSync(): {}
   * 
   * console.log(extConfig)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ext/wx.getExtConfigSync.html
   */
  function getExtConfigSync(): getExtConfigSync.ExtInfo

  namespace getExtConfig {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 第三方平台自定义的数据 */
      extConfig: General.IAnyObject
      /** 调用结果 */
      errMsg: string
    }
  }
  /** 获取[第三方平台](https://developers.weixin.qq.com/miniprogram/dev/devtools/ext.html)自定义的数据字段。
    *
    * **Tips**
    * 1. 本接口暂时无法通过 Taro.canIUse 判断是否兼容，开发者需要自行判断 Taro.getExtConfig 是否存在来兼容
   * @supported weapp
   * @example
   * ```tsx
   * if(Taro.getExtConfig) {
   *   Taro.getExtConfig({
   *     success: function (res) {
   *       console.log(res.extConfig)
   *     }
   *   })
   * }
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ext/wx.getExtConfig.html
   */
  function getExtConfig(option?: getExtConfig.Option): Promise<getExtConfig.SuccessCallbackResult>
}

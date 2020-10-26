declare namespace Taro {
  namespace chooseAddress {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult {
      /** 国标收货地址第二级地址 */
      cityName: string
      /** 国标收货地址第三级地址 */
      countyName: string
      /** 详细收货地址信息 */
      detailInfo: string
      /** 错误信息 */
      errMsg: string
      /** 收货地址国家码 */
      nationalCode: string
      /** 邮编 */
      postalCode: string
      /** 国标收货地址第一级地址 */
      provinceName: string
      /** 收货人手机号码 */
      telNumber: string
      /** 收货人姓名 */
      userName: string
    }
  }

  /** 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.chooseAddress({
   *   success: function (res) {
   *     console.log(res.userName)
   *     console.log(res.postalCode)
   *     console.log(res.provinceName)
   *     console.log(res.cityName)
   *     console.log(res.countyName)
   *     console.log(res.detailInfo)
   *     console.log(res.nationalCode)
   *     console.log(res.telNumber)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html
   */
  function chooseAddress(option?: chooseAddress.Option): Promise<chooseAddress.SuccessCallbackResult>
}

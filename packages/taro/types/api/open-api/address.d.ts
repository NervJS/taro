import Taro from '../../index'

declare module '../../index' {
  namespace chooseAddress {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: SuccessCallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 收货人姓名 */
      userName: string
      /** 邮编
       * @supported weapp, qq
       */
      postalCode: string
      /** 国标收货地址第一级地址 */
      provinceName: string
      /** 国标收货地址第二级地址 */
      cityName: string
      /** 国标收货地址第三级地址 */
      countyName: string
      /** 国标收货地址第四级地址
       * @supported weapp, qq
       */
      streetName: string
      /** 详细收货地址信息 */
      detailInfo: string
      /** 新选择器详细收货地址信息
       * @supported weapp, qq
       */
      detailInfoNew: string
      /** 收货地址国家码
       * @supported weapp, qq
       */
      nationalCode: string
      /** 收货人手机号码 */
      telNumber: string
    }
  }

  interface TaroStatic {
    /** 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
     * @supported weapp, qq, tt, jd
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
    chooseAddress(option?: chooseAddress.Option): Promise<chooseAddress.SuccessCallbackResult>
  }
}

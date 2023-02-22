/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import Taro from '../../index'

declare module '../../index' {
  namespace chooseAddress {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
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

  interface TaroStatic {
    /** 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
     * @supported weapp, tt
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

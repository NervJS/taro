declare namespace Taro {
  namespace requestPayment {
    type Param = {
      /**
       * 时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
       */
      timeStamp: string
      /**
       * 随机字符串，长度为32个字符以下。
       */
      nonceStr: string
      /**
       * 统一下单接口返回的 prepay\_id 参数值，提交格式如：prepay\_id=_*_
       */
      package: string
      /**
       * 签名算法，暂支持 MD5
       */
      signType: string
      /**
       * 签名,具体签名方案参见[小程序支付接口文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3);
       */
      paySign: string
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 发起微信支付。
   *
   * **回调结果：**
   *
   *   回调类型  |  errMsg                                 |  说明
   * ------------|-----------------------------------------|------------------------------------------
   *   success   |  requestPayment:ok                      |  调用支付成功
   *   fail      |  requestPayment:fail cancel             |  用户取消支付
   *   fail      |  requestPayment:fail (detail message)   |调用支付失败，其中 detail message 为后台返回的详细失败原因
   *
   * **Bug & Tip：**
   *
   * 1.  `bug`: 6.5.2 及之前版本中，用户取消支付不会触发 fail 回调，只会触发 complete 回调，回调 errMsg 为 'requestPayment:cancel'
   *
   * **示例代码：**
   *
   ```javascript
   Taro.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success':function(res){
      },
      'fail':function(res){
      }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html
   */
  function requestPayment(OBJECT: requestPayment.Param): Promise<any>
}

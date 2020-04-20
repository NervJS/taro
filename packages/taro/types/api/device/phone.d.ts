declare namespace Taro {
  namespace makePhoneCall {
    type Param = {
      /**
       * 需要拨打的电话号码
       */
      phoneNumber: string
    }
  }
  /**
   *
   * **示例代码：**
   *
   ```javascript
   Taro.makePhoneCall({
     phoneNumber: '1340000' //仅为示例，并非真实的电话号码
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/phone/wx.makePhoneCall.html
   */
  function makePhoneCall(OBJECT: makePhoneCall.Param): Promise<any>
}

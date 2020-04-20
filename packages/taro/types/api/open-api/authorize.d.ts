declare namespace Taro {
  namespace authorize {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 需要获取权限的scope，详见 [scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html#scope-列表)
       */
      scope: string
    }
  }
  /**
   * @since 1.2.0
   *
   * 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。
   *
   * **示例代码：**
   *
   ```javascript
   // 可以通过 Taro.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
   Taro.getSetting({
       success(res) {
           if (!res.authSetting['scope.record']) {
               Taro.authorize({
                   scope: 'scope.record',
                   success() {
                       // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
                       Taro.startRecord()
                   }
               })
           }
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
   */
  function authorize(OBJECT: authorize.Param): Promise<authorize.Promised>
}

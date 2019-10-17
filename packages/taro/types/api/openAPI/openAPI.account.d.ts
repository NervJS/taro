declare namespace Taro {
  /**
   * @since 2.2.2
   *
   * 获取当前帐号信息
   *
   * **示例代码：**
   *
   ```javascript
   const accountInfo = wx.getAccountInfoSync();
   console.log(accountInfo.miniProgram.appId) // 小程序 appId
   console.log(accountInfo.plugin.appId) // 插件 appId
   console.log(accountInfo.plugin.version) // 插件版本号， 'a.b.c' 这样的形式
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/account-info/wx.getAccountInfoSync.html
   */
  function getAccountInfoSync(): getAccountInfoSync.Return
  namespace getAccountInfoSync {
    interface Return {
      /**
       * 小程序帐号信息
       */
      miniProgram: {
        /**
         * 小程序 appId
         */
        appId: string
      }
      /**
       * 插件帐号信息（仅在插件中调用时包含这一项）
       */
      plugin?: {
        /**
         * 插件 appId
         */
        appId: string
        /**
         * 插件版本号
         */
        version: string
      }
    }
  }
}

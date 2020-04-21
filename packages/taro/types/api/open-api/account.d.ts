declare namespace Taro {
  namespace getAccountInfoSync {
    /** 帐号信息 */
    interface AccountInfo {
      /** 小程序帐号信息 */
      miniProgram: MiniProgram
      /** 插件帐号信息（仅在插件中调用时包含这一项） */
      plugin: Plugin
    }
    /** 小程序帐号信息 */
    interface MiniProgram {
      /** 小程序 appId */
      appId: string
    }
    /** 插件帐号信息（仅在插件中调用时包含这一项） */
    interface Plugin {
      /** 插件 appId */
      appId: string
      /** 插件版本号 */
      version: string
    }
  }

  /** 获取当前帐号信息
   * @supported weapp
   * @example
   * ```tsx
   * const accountInfo = Taro.getAccountInfoSync();
   * 
   * console.log(accountInfo.miniProgram.appId) // 小程序 appId
   * console.log(accountInfo.plugin.appId) // 插件 appId
   * console.log(accountInfo.plugin.version) // 插件版本号， 'a.b.c' 这样的形式
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/account-info/wx.getAccountInfoSync.html
   */
  function getAccountInfoSync(): getAccountInfoSync.AccountInfo
}

import Taro from '../../index'

declare module '../../index' {
  namespace updateWeChatApp {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace UpdateManager {
    /** 向微信后台请求检查更新结果事件的回调函数 */
    type OnCheckForUpdateCallback = (
      result: OnCheckForUpdateResult,
    ) => void
    interface OnCheckForUpdateResult {
      /** 是否有新版本 */
      hasUpdate: boolean
    }
  }

  /** UpdateManager 对象，用来管理更新，可通过 Taro.getUpdateManager 接口获取实例。
   * 
   * **Tips**
   *  - 微信开发者工具上可以通过「编译模式」下的「下次编译模拟更新」开关来调试
   *  - 小程序开发版/体验版没有「版本」概念，所以无法在开发版/体验版上测试更版本更新情况
   * @supported weapp, tt
   * @example
   * ```tsx
   * const updateManager = Taro.getUpdateManager()
   *
   * updateManager.onCheckForUpdate(function (res) {
   *   // 请求完新版本信息的回调
   *   console.log(res.hasUpdate)
   * })
   *
   * updateManager.onUpdateReady(function () {
   *   wx.showModal({
   *     title: '更新提示',
   *     content: '新版本已经准备好，是否重启应用？',
   *     success: function (res) {
   *       if (res.confirm) {
   *         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
   *         updateManager.applyUpdate()
   *       }
   *     }
   *   })
   * })
   *
   * updateManager.onUpdateFailed(function () {
   *   // 新版本下载失败
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.html
   */
  interface UpdateManager {
    /** 强制小程序重启并使用新版本。在小程序新版本下载完成后（即收到 `onUpdateReady` 回调）调用。
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.applyUpdate.html
     */
    applyUpdate(): void
    /** 监听向微信后台请求检查更新结果事件。微信在小程序冷启动时自动检查更新，不需由开发者主动触发。
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.onCheckForUpdate.html
     */
    onCheckForUpdate(
        /** 向微信后台请求检查更新结果事件的回调函数 */
        callback: UpdateManager.OnCheckForUpdateCallback,
    ): void
    /** 监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.onUpdateReady.html
     */
    onUpdateReady(
        /** 小程序有版本更新事件的回调函数 */
        callback: (res: TaroGeneral.CallbackResult) => void,
    ): void
    /** 监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.onUpdateFailed.html
     */
    onUpdateFailed(
        /** 小程序更新失败事件的回调函数 */
        callback: (res: TaroGeneral.CallbackResult) => void,
    ): void
  }

  interface TaroStatic {
    /** 更新客户端版本。当判断用户小程序所在客户端版本过低时，可使用该接口跳转到更新微信页面。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/update/wx.updateWeChatApp.html
     */
    updateWeChatApp(option: updateWeChatApp.Option): Promise<TaroGeneral.CallbackResult>

    /**
     * 获取**全局唯一**的版本更新管理器，用于管理小程序更新。
     * 关于小程序的更新机制，可以查看[运行机制](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/operating-mechanism.html)文档。
     * @example
     * ```tsx
     * const updateManager = Taro.getUpdateManager()
     *   updateManager.onCheckForUpdate(function (res) {
     *   // 请求完新版本信息的回调
     *   console.log(res.hasUpdate)
     * })
     * updateManager.onUpdateReady(function () {
     *   Taro.showModal({
     *     title: '更新提示',
     *     content: '新版本已经准备好，是否重启应用？',
     *     success: function (res) {
     *       if (res.confirm) {
     *         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
     *         updateManager.applyUpdate()
     *       }
     *     }
     *   })
     * })
     * updateManager.onUpdateFailed(function () {
     *   // 新的版本下载失败
     * })
     * ```
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/update/wx.getUpdateManager.html
     */
    getUpdateManager(): UpdateManager
  }
}

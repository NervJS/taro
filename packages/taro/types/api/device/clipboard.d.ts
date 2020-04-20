declare namespace Taro {
  namespace setClipboardData {
    interface Promised extends General.CallbackResult {
      /** 调用信息 */
      errMsg: string
      /** 剪贴板的内容 */
      data: string
    }
    interface Option {
      /** 剪贴板的内容 */
      data: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 设置系统剪贴板的内容。调用成功后，会弹出 toast 提示"内容已复制"，持续 1.5s
   * @supported weapp, h5, rn
   * @h5 部分实现
   * @example
   * ```tsx
   * Taro.setClipboardData({
   *   data: 'data',
   *   success: function (res) {
   *     Taro.getClipboardData({
   *       success: function (res) {
   *         console.log(res.data) // data
   *       }
   *     })
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html
   */
 function setClipboardData(option: setClipboardData.Option): Promise<setClipboardData.Promised>

  namespace getClipboardData {
    interface Promised extends General.CallbackResult {
      /** 调用信息 */
      errMsg: string
      /** 剪贴板的内容 */
      data: string
    }
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackOption) => void
    }
    interface SuccessCallbackOption {
      /** 剪贴板的内容 */
      data: string
    }
  }
  /**
   * 获取系统剪贴板内容
   * @supported weapp, h5, rn
   * @h5 部分实现
   * @example
   * ```tsx
   * Taro.getClipboardData({
   *   success: function (res){
   *     console.log(res.data)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.getClipboardData.html
   */
  function getClipboardData(res?: getClipboardData.Option): Promise<getClipboardData.Promised>
}

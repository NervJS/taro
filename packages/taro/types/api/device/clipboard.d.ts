declare namespace Taro {
  namespace setClipboardData {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 剪贴板的内容
       */
      data: string
    }
    type Param = {
      /**
       * 需要设置的内容
       */
      data: string
    }
  }
  /**
   * 设置系统剪贴板的内容
   * 
   * **注意** 调用成功后，会弹出 toast 提示"内容已复制"，持续 1.5s
   * @example
   * ```tsx
   * Taro.setClipboardData({
   *   data: 'data',
   *   success: function(res) {
   *     Taro.getClipboardData({
   *       success: function(res) {
   *         console.log(res.data) // data
   *       }
   *     })
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html
   */
  function setClipboardData(res: setClipboardData.Param): Promise<setClipboardData.Promised>

  namespace getClipboardData {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 剪贴板的内容
       */
      data: string
    }
    type Param = {}
  }
  /**
   * 获取系统剪贴板内容
   * @example
   * ```tsx
   * Taro.getClipboardData({
   *   success: function(res){
   *     console.log(res.data)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.getClipboardData.html
   */
  function getClipboardData(res?: getClipboardData.Param): Promise<getClipboardData.Promised>
}

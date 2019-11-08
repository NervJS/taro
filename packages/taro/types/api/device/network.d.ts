declare namespace Taro {
  namespace onNetworkStatusChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 当前是否有网络连接
       */
      isConnected: boolean
      /**
       * 网络类型
       *
       * **networkType 有效值：**
       *
       *   值        |  说明
       * ------------|---------------------
       *   wifi      |  wifi 网络
       *   2g        |  2g 网络
       *   3g        |  3g 网络
       *   4g        |  4g 网络
       *   none      |  无网络
       *   unknown   |Android下不常见的网络类型
       */
      networkType: string
    }
  }
  /**
   * 监听网络状态变化。
   * @example
   * ```tsx
   * Taro.onNetworkStatusChange(function(res) {
   *   console.log(res.isConnected)
   *   console.log(res.networkType)
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.onNetworkStatusChange.html
   */
  function onNetworkStatusChange(callback: onNetworkStatusChange.Param): void

  namespace getNetworkType {
    type Promised = {
      /**
       * 网络类型
       */
      networkType: any
    }
    type Param = {}
  }
  /**
   * 获取网络类型。
   *
   * **success返回参数说明：**
   *
   * ```tsx
   * Taro.getNetworkType({
   *   success: function(res) {
   *     // 返回网络类型, 有效值：
   *     // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
   *     var networkType = res.networkType
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.getNetworkType.html
   */
  function getNetworkType(res?: getNetworkType.Param): Promise<getNetworkType.Promised>

  // TODO: wx.offNetworkStatusChange
}

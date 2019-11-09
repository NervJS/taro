declare namespace Taro {
  namespace stopCompass {
    type Param = {}
  }
  /**
   * 停止监听罗盘数据。
   * @example
   * ```tsx
   * Taro.stopCompass()
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.stopCompass.html
   */
  function stopCompass(res?: stopCompass.Param): Promise<any>

  namespace startCompass {
    type Param = {}
  }
  /**
   * 开始监听罗盘数据。
   * @example
   * ```tsx
   * Taro.startCompass()
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.startCompass.html
   */
  function startCompass(res?: startCompass.Param): Promise<any>

  namespace onCompassChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 面对的方向度数
       */
      direction: number
    }
  }
  /**
   * 监听罗盘数据，频率：5次/秒，接口调用后会自动开始监听，可使用`Taro.stopCompass`停止监听。
   * @example
   * ```tsx
   * Taro.onCompassChange(function (res) {
   *   console.log(res.direction)
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.onCompassChange.html
   */
  function onCompassChange(callback: onCompassChange.Param): void

  // TODO: wx.offCompassChange
}

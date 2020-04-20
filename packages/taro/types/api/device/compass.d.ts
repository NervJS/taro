declare namespace Taro {
  namespace stopCompass {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 停止监听罗盘数据
   * @supported weapp, h5
   * @example
   * ```tsx
   * Taro.stopCompass()
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.stopCompass.html
   */
  function stopCompass(option?: stopCompass.Option): Promise<General.CallbackResult>

  namespace startCompass {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 开始监听罗盘数据
   * @supported weapp, h5
   * @example
   * ```js
   * Taro.startCompass()
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.startCompass.html
   */
  function startCompass(option?: startCompass.Option): Promise<General.CallbackResult>

  namespace onCompassChange {
    /** 罗盘数据变化事件的回调函数 */
    type Callback = (
      result: OnCompassChangeCallbackResult,
    ) => void
    interface OnCompassChangeCallbackResult {
      /** 精度
       * 
       * 由于平台差异，accuracy 在 iOS/Android 的值不同。
       *
       * - iOS：accuracy 是一个 number 类型的值，表示相对于磁北极的偏差。0 表示设备指向磁北，90 表示指向东，180 表示指向南，依此类推。
       * - Android：accuracy 是一个 string 类型的枚举值。
       */
      accuracy: number | keyof accuracy | string
      /** 面对的方向度数 */
      direction: number
    }

    interface accuracy {
      /** 高精度 */
      high
      /** 中等精度 */
      medium
      /** 低精度 */
      low
      /** 不可信，传感器失去连接 */
      'no-contact'
      /** 不可信，原因未知 */
      unreliable
      /** 未知的精度枚举值，即该 Android 系统此时返回的表示精度的 value 不是一个标准的精度枚举值 */
      'unknow ${value}'
    }
  }
  /** 监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 Taro.stopCompass 停止监听。
   * @supported weapp, h5
   * @example
   * ```tsx
   * Taro.onCompassChange(function (res) {
   *   console.log(res.direction)
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.onCompassChange.html
   */
  function onCompassChange(
    /** 罗盘数据变化事件的回调函数 */
    callback: onCompassChange.Callback,
  ): void

  /** 取消监听罗盘数据变化事件，参数为空，则取消所有的事件监听。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.offCompassChange.html
   */
  function offCompassChange(
    /** 罗盘数据变化事件的回调函数 */
    callback: (...args: any[]) => any,
  ): void
}

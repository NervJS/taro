declare namespace Taro {
  /** 停止监听陀螺仪数据。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/gyroscope/wx.stopGyroscope.html
   */
  function stopGyroscope(option?: stopGyroscope.Option): Promise<General.CallbackResult>

  namespace stopGyroscope {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 开始监听陀螺仪数据。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/gyroscope/wx.startGyroscope.html
   */
  function startGyroscope(option: startGyroscope.Option): Promise<General.CallbackResult>


  namespace startGyroscope {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 监听陀螺仪数据回调函数的执行频率 */
      interval?: keyof interval
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }

    /** 监听陀螺仪数据回调函数的执行频率 */
    interface interval {
      /** 适用于更新游戏的回调频率，在 20ms/次 左右 */
      game
      /** 适用于更新 UI 的回调频率，在 60ms/次 左右 */
      ui
      /** 普通的回调频率，在 200ms/次 左右 */
      normal
    }
  }
  
  /** 监听陀螺仪数据变化事件。频率根据 Taro.startGyroscope() 的 interval 参数。可以使用 Taro.stopGyroscope() 停止监听。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/gyroscope/wx.onGyroscopeChange.html
   */
  function onGyroscopeChange(
    /** 陀螺仪数据变化事件的回调函数 */
    callback: onGyroscopeChange.Callback,
  ): void
  namespace onGyroscopeChange {
    /** 陀螺仪数据变化事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      /** x 轴的角速度 */
      x: number
      /** y 轴的角速度 */
      y: number
      /** z 轴的角速度 */
      z: number
    }
  }
  /** 取消监听陀螺仪数据变化事件。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/gyroscope/wx.offGyroscopeChange.html
   */
  function offGyroscopeChange(
    /** 陀螺仪数据变化事件的回调函数 */
    callback: (...args: any[]) => any,
  ): void
}

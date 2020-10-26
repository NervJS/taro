declare namespace Taro {
  /** 开始监听设备方向的变化。
   * @supported weapp, h5, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.startDeviceMotionListening.html
   */
  function startDeviceMotionListening(
    option: startDeviceMotionListening.Option,
  ): void

  namespace startDeviceMotionListening {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 监听设备方向的变化回调函数的执行频率
       * @default "normal"
       */
      interval?: keyof interval
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface interval {
      /** 适用于更新游戏的回调频率，在 20ms/次 左右 */
      game
      /** 适用于更新 UI 的回调频率，在 60ms/次 左右 */
      ui
      /** 普通的回调频率，在 200ms/次 左右 */
      normal
    }
  }

  /**
   * 停止监听设备方向的变化。
   * @supported weapp, h5, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.stopDeviceMotionListening.html
   */
  function stopDeviceMotionListening(
    option?: stopDeviceMotionListening.Option,
  ): void

  namespace stopDeviceMotionListening {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /**
   * 监听设备方向变化事件。频率根据 Taro.startDeviceMotionListening() 的 interval 参数。可以使用 Taro.stopDeviceMotionListening() 停止监听。
   * @supported weapp, h5, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.onDeviceMotionChange.html
   */
  function onDeviceMotionChange (callback: onDeviceMotionChange.Callback): void

  namespace onDeviceMotionChange {
    /** 设备方向变化事件的回调函数 */
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      /** 当 手机坐标 X/Y 和 地球 X/Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为 [0, 2*PI)。逆时针转动为正。 */
      alpha: number
      /** 当手机坐标 Y/Z 和地球 Y/Z 重合时，绕着 X 轴转动的夹角为 beta。范围值为 [-1*PI, PI) 。顶部朝着地球表面转动为正。也有可能朝着用户为正。 */
      beta: number
      /** 当手机 X/Z 和地球 X/Z 重合时，绕着 Y 轴转动的夹角为 gamma。范围值为 [-1*PI/2, PI/2)。右边朝着地球表面转动为正。 */
      gamma: number
    }
  }

  /** 取消监听设备方向变化事件，参数为空，则取消所有的事件监听。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.offDeviceMotionChange.html
   */
  function offDeviceMotionChange(
    /** 设备方向变化事件的回调函数 */
    callback: (...args: any[]) => any,
  ): void
}

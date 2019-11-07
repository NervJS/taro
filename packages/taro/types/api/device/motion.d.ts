declare namespace Taro {
  /**
   * 开始监听设备方向的变化。
   * @supported weapp, h5, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.startDeviceMotionListening.html
   */
  function startDeviceMotionListening (option: startDeviceMotionListening.Option): void

  namespace startDeviceMotionListening {
    type Option = {
      /** 监听设备方向的变化回调函数的执行频率
       * @default "normal"
       */
      interval?: keyof interval
      /** 接口调用成功的回调函数 */
      success?: SuccessCallback
      /** 接口调用失败的回调函数 */
      fail?: FailCallback
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: Callback
    }

    type interval = {
      /** 适用于更新游戏的回调频率，在 20ms/次 左右 */
      game: 'game',
      /** 适用于更新 UI 的回调频率，在 60ms/次 左右 */
      ui: 'ui',
      /** 普通的回调频率，在 200ms/次 左右 */
      normal: 'normal'
    }

    /** 接口调用成功的回调函数 */
    type SuccessCallback = (res: GeneralCallbackResult) => void
    /** 接口调用失败的回调函数 */
    type FailCallback = (res: GeneralCallbackResult) => void
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    type Callback = (res: GeneralCallbackResult) => void
    interface GeneralCallbackResult {
      errMsg: string
    }
  }

  /**
   * 停止监听设备方向的变化。
   * @supported weapp, h5, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.stopDeviceMotionListening.html
   */
  function stopDeviceMotionListening(option?: stopDeviceMotionListening.Option): void

  namespace stopDeviceMotionListening {
    type Option = {
      /** 接口调用成功的回调函数 */
      success?: SuccessCallback
      /** 接口调用失败的回调函数 */
      fail?: FailCallback
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: Callback
    }
    /** 接口调用成功的回调函数 */
    type SuccessCallback = (res: GeneralCallbackResult) => void
    /** 接口调用失败的回调函数 */
    type FailCallback = (res: GeneralCallbackResult) => void
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    type Callback = (res: GeneralCallbackResult) => void
    interface GeneralCallbackResult {
      errMsg: string
    }
  }
  /**
   * 监听设备方向变化事件。频率根据 [wx.startDeviceMotionListening()](https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.startDeviceMotionListening.html) 的 interval 参数。可以使用 [wx.stopDeviceMotionListening()](https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.stopDeviceMotionListening.html) 停止监听。
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

  // TODO: wx.offDeviceMotionChange
}

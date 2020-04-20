declare namespace Taro {
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  type StopDeviceMotionListeningCompleteCallback = (
    res: GeneralCallbackResult,
  ) => void
  /** 接口调用失败的回调函数 */
  type StopDeviceMotionListeningFailCallback = (
      res: GeneralCallbackResult,
  ) => void
  /** 接口调用成功的回调函数 */
  type StopDeviceMotionListeningSuccessCallback = (
      res: GeneralCallbackResult,
  ) => void
  interface StopDeviceMotionListeningOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: StopDeviceMotionListeningCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: StopDeviceMotionListeningFailCallback
    /** 接口调用成功的回调函数 */
    success?: StopDeviceMotionListeningSuccessCallback
  }
  /** [wx.stopDeviceMotionListening(Object object)](https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.stopDeviceMotionListening.html)
   *
   * 停止监听设备方向的变化。
   *
   * 最低基础库： `2.3.0`
   */
  function stopDeviceMotionListening(
    option?: StopDeviceMotionListeningOption,
  ): void

  interface GeneralCallbackResult {
    errMsg: string
  }
  type StartDeviceMotionListeningCompleteCallback = (
    res: GeneralCallbackResult,
  ) => void
  /** 接口调用失败的回调函数 */
  type StartDeviceMotionListeningFailCallback = (
      res: GeneralCallbackResult,
  ) => void
  /** 接口调用成功的回调函数 */
  type StartDeviceMotionListeningSuccessCallback = (
      res: GeneralCallbackResult,
  ) => void
  interface StartDeviceMotionListeningOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: StartDeviceMotionListeningCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: StartDeviceMotionListeningFailCallback
    /** 监听设备方向的变化回调函数的执行频率
     *
     * 可选值：
     * - 'game': 适用于更新游戏的回调频率，在 20ms/次 左右;
     * - 'ui': 适用于更新 UI 的回调频率，在 60ms/次 左右;
     * - 'normal': 普通的回调频率，在 200ms/次 左右; */
    interval?: 'game' | 'ui' | 'normal'
    /** 接口调用成功的回调函数 */
    success?: StartDeviceMotionListeningSuccessCallback
  }
  /** [wx.startDeviceMotionListening(Object object)](https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.startDeviceMotionListening.html)
   *
   * 开始监听设备方向的变化。
   *
   * 最低基础库： `2.3.0`
   */
  function startDeviceMotionListening(
    option: StartDeviceMotionListeningOption,
  ): void

  interface OnDeviceMotionChangeCallbackResult {
    /** 当 手机坐标 X/Y 和 地球 X/Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为 [0, 2*PI)。逆时针转动为正。 */
    alpha: number
    /** 当手机坐标 Y/Z 和地球 Y/Z 重合时，绕着 X 轴转动的夹角为 beta。范围值为 [-1*PI, PI) 。顶部朝着地球表面转动为正。也有可能朝着用户为正。 */
    beta: number
    /** 当手机 X/Z 和地球 X/Z 重合时，绕着 Y 轴转动的夹角为 gamma。范围值为 [-1*PI/2, PI/2)。右边朝着地球表面转动为正。 */
    gamma: number
  }
  /** 设备方向变化事件的回调函数 */
  type OnDeviceMotionChangeCallback = (
    result: OnDeviceMotionChangeCallbackResult,
  ) => void
  /** [wx.onDeviceMotionChange(function callback)](https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.onDeviceMotionChange.html)
   *
   * 监听设备方向变化事件。频率根据 [wx.startDeviceMotionListening()](https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.startDeviceMotionListening.html) 的 interval 参数。可以使用 [wx.stopDeviceMotionListening()](https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.stopDeviceMotionListening.html) 停止监听。
   *
   * 最低基础库： `2.3.0`
   */
  function onDeviceMotionChange(
    /** 设备方向变化事件的回调函数 */
    callback: OnDeviceMotionChangeCallback
  ): void

  // TODO: wx.offDeviceMotionChange
}

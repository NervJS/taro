declare namespace Taro {
  /** Taro.getBatteryInfo 的同步版本
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/battery/wx.getBatteryInfoSync.html
   */
  function getBatteryInfoSync(): getBatteryInfoSync.Result

  namespace getBatteryInfoSync {
    interface Result {
      /** 是否正在充电中 */
      isCharging: boolean
      /** 设备电量，范围 1 - 100 */
      level: string
    }
  }
  
  /** 获取设备电量。同步 API Taro.getBatteryInfoSync 在 iOS 上不可用。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/battery/wx.getBatteryInfo.html
   */
  function getBatteryInfo(option?: getBatteryInfo.Option): void

  namespace getBatteryInfo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends General.CallbackResult {
      /** 是否正在充电中 */
      isCharging: boolean
      /** 设备电量，范围 1 - 100 */
      level: string
      /** 调用结果 */
      errMsg: string
    }
  }
}

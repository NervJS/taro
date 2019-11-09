declare namespace Taro {
  namespace vibrateShort {
    type Param = {}
  }
  /**
   * 使手机发生较短时间的振动（15ms）
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`：`vibrateShort` 接口仅在 iPhone7/iPhone7Plus 及 Android 机型生效
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/vibrate/wx.vibrateShort.html
   */
  function vibrateShort(res?: vibrateShort.Param): Promise<any>

  namespace vibrateLong {
    type Param = {}
  }
  /**
   * 使手机发生较长时间的振动（400ms）
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/vibrate/wx.vibrateLong.html
   */
  function vibrateLong(res?: vibrateLong.Param): Promise<any>
}

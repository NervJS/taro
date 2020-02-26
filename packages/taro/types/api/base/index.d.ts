declare namespace Taro {
  /** 判断小程序的 API，回调，参数，组件等是否在当前版本可用。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.canIUse('openBluetoothAdapter')
   * Taro.canIUse('getSystemInfoSync.return.screenWidth')
   * Taro.canIUse('getSystemInfo.success.screenWidth')
   * Taro.canIUse('showToast.object.image')
   * Taro.canIUse('onCompassChange.callback.direction')
   * Taro.canIUse('request.object.method.GET')
   * Taro.canIUse('live-player')
   * Taro.canIUse('text.selectable')
   * Taro.canIUse('button.open-type.contact')
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.canIUse.html
   */
  function canIUse(
    /**
     * 使用 `${API}.${method}.${param}.${option}` 或者 `${component}.${attribute}.${option}` 方式来调用
     * 
     * **参数说明**
     * 
     * - `${API}` 代表 API 名字
     * - `${method}` 代表调用方式，有效值为return, success, object, callback
     * - `${param}` 代表参数或者返回值
     * - `${option}` 代表参数的可选值或者返回值的属性
     * - `${component}` 代表组件名字
     * - `${attribute}` 代表组件属性
     * - `${option}` 代表组件属性的可选值
     */
    schema: string
  ): boolean

  /**
   * 将 Base64 字符串转成 ArrayBuffer 数据。
   * @supported weapp, h5
   * @example
   * ```tsx
   * const base64 = 'CxYh'
   * const arrayBuffer = Taro.base64ToArrayBuffer(base64)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.base64ToArrayBuffer.html
   */
  function base64ToArrayBuffer (
    /** 要转化成 ArrayBuffer 对象的 Base64 字符串 */
    base64: string,
  ): ArrayBuffer

  /**
   * 将 ArrayBuffer 数据转成 Base64 字符串。
   * @supported weapp, h5
   * @example
   * ```tsx
   * const arrayBuffer = new Uint8Array([11, 22, 33])
   * const base64 = Taro.arrayBufferToBase64(arrayBuffer)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.arrayBufferToBase64.html
   */
  function arrayBufferToBase64 (
    /** 要转换成 Base64 字符串的 ArrayBuffer 对象 */
    buffer: ArrayBuffer,
  ): string
}

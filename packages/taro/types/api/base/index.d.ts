declare namespace Taro {
  /** 判断小程序的 API，回调，参数，组件等是否在当前版本可用。
   * 
   * **String** 参数说明：
   * 
   * 使用`${API}.${method}.${param}.${options}`或者`${component}.${attribute}.${option}`方式来调用，例如：
   *    `${API}` 代表 API 名字
   *    `${method}` 代表调用方式，有效值为`return`, `success`, `object`, `callback`
   *    `${param}` 代表参数或者返回值
   *    `${options}` 代表参数的可选值
   *    `${component}` 代表组件名字
   *    `${attribute}` 代表组件属性
   *    `${option}` 代表组件属性的可选值
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
  function canIUse(param: string): boolean

  type arrayBuffer = Uint8Array | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | ArrayBuffer

  /**
   * 将 Base64 字符串转成 ArrayBuffer 数据。
   * @supported weapp, h5
   * @example
   * ```tsx
   * const base64 = 'CxYh'
   * const arrayBuffer = Taro.base64ToArrayBuffer(base64)
   * ```
   */
  function base64ToArrayBuffer(base64: string): arrayBuffer

  /**
   * 将 ArrayBuffer 数据转成 Base64 字符串。
   * @example
   * ```tsx
   * const arrayBuffer = new Uint8Array([11, 22, 33])
   * const base64 = Taro.arrayBufferToBase64(arrayBuffer)
   * ```
   */
  function arrayBufferToBase64(buffer: arrayBuffer): string
}

import Taro from '../../index'

declare module '../../index' {
  interface TaroStatic {
    /** 判断小程序的 API，回调，参数，组件等是否在当前版本可用。
     * @supported weapp, tt, h5, harmony_hybrid
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
    canIUse(
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

    /** 判断能否使用 WebP 格式
     *
     * > 在小程序平台中仅在 android 和 devtools 设备时可用
     * @supported global
     */
    canIUseWebp(): boolean

    /**
     * 将 Base64 字符串转成 ArrayBuffer 数据。
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @example
     * ```tsx
     * const base64 = 'CxYh'
     * const arrayBuffer = Taro.base64ToArrayBuffer(base64)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.base64ToArrayBuffer.html
     */
    base64ToArrayBuffer (
      /** 要转化成 ArrayBuffer 对象的 Base64 字符串 */
      base64: string,
    ): ArrayBuffer

    /**
     * 将 ArrayBuffer 数据转成 Base64 字符串。
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @example
     * ```tsx
     * const arrayBuffer = new Uint8Array([11, 22, 33])
     * const base64 = Taro.arrayBufferToBase64(arrayBuffer)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.arrayBufferToBase64.html
     */
    arrayBufferToBase64 (
      /** 要转换成 Base64 字符串的 ArrayBuffer 对象 */
      buffer: ArrayBuffer,
    ): string

    /**
     * 跳转预加载 API
     * @param options 预加载的数据
     * @example
     * ```tsx
     * Taro.preload({ key: 'value' })
     * ```
     */
    preload (options: Record<string, any>)

    /**
     * 跳转预加载 API
     * @param key 预加载的数据 key
     * @param value 预加载的数据 value
     * @example
     * ```tsx
     * Taro.preload('key', 'value')
     * ```
     */
    preload (key: string, value: any)

    /**
     * 预加载的数据
     * @ignore
     */
    preloadData: Record<string, any>
  }
}

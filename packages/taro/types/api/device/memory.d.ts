import Taro from '../../index'

declare module '../../index' {
  namespace onMemoryWarning {
    /** 内存不足告警事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      /** 内存告警等级，只有 Android 才有，对应系统宏定义 */
      level: keyof Level
    }

    interface Level {
      /** TRIM_MEMORY_RUNNING_MODERATE */
      5
      /** TRIM_MEMORY_RUNNING_LOW */
      10
      /** TRIM_MEMORY_RUNNING_CRITICAL */
      15
    }
  }

  interface TaroStatic {
    /** 监听内存不足告警事件。
     *
     * 当 iOS/Android 向小程序进程发出内存警告时，触发该事件。触发该事件不意味小程序被杀，大部分情况下仅仅是告警，开发者可在收到通知后回收一些不必要资源避免进一步加剧内存紧张。
     * @supported weapp, alipay, swan, jd, tt
     * @example
     * ```tsx
     * Taro.onMemoryWarning(function () {
     *   console.log('onMemoryWarningReceive')
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/performance/wx.onMemoryWarning.html
     */
    onMemoryWarning(
      /** 内存不足告警事件的回调函数 */
      callback: onMemoryWarning.Callback,
    ): void

    /** 取消监听内存不足告警事件。
     * @supported weapp, alipay, swan
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/memory/wx.offMemoryWarning.html
     */
    offMemoryWarning(
      /** 取消监听内存不足告警事件 */
      callback?: onMemoryWarning.Callback,
    ): void
  }
}

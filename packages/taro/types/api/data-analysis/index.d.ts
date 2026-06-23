import Taro from '../../index'

declare module '../../index' {
  namespace getCommonConfig {
    interface Option {
      /** 需要获取的数据指标的对象数组，每个string的格式约定：配置类型_分表key */
      keys?: string[]
      /** 0：通用配置模式 1：实验模式, 参数与返回结果的使用等效于接口wx.getExptInfoSync */
      mode: 0 | 1
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 错误码 */
      errcode: number
      /** 错误信息 */
      errmsg: string
      /** 配置类型, 1-表类型 2-kv类型 */
      conf_type: number
      /** 根据conf_type来确定conf内容, conf_type为1时conf是一个json数组, 类似"[{xxx},{xxx}]", 每一项对应表类型每一行配置内容, 其中conf_type为2时conf是一个json对象，类似"{xxxx}" */
      conf: string
      /** 过期时间,单位秒. 0表示当次有效 */
      expire_sec: number
    }
  }

  interface TaroStatic {
    /** 自定义业务数据监控上报接口。
     *
     * **使用说明**
     * 使用前，需要在「小程序管理后台-运维中心-性能监控-业务数据监控」中新建监控事件，配置监控描述与告警类型。每一个监控事件对应唯一的监控ID，开发者最多可以创建128个监控事件。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.reportMonitor('1', 1)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.reportMonitor.html
     */
     reportMonitor(
      /** 监控ID，在「小程序管理后台」新建数据指标后获得 */
      name: string,
      /** 上报数值，经处理后会在「小程序管理后台」上展示每分钟的上报总量 */
      value: number,
    ): void

    /** 自定义分析数据上报接口。使用前，需要在小程序管理后台自定义分析中新建事件，配置好事件名与字段。
     * @supported weapp, swan, tt
     * @example
     * ```tsx
     * Taro.reportAnalytics('purchase', {
     *   price: 120,
     *   color: 'red'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.reportAnalytics.html
     */
    reportAnalytics(
      /** 事件名 */
      eventName: string,
      /** 上报的自定义数据，key 为配置中的字段名，value 为上报的数据。 */
      data: TaroGeneral.IAnyObject,
    ): void

    /** 事件上报
     * @supported weapp
     * @example
     * ```tsx
     * Taro.reportEvent('purchase', {
     *   price: 120,
     *   color: 'red'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.reportEvent.html
     */
    reportEvent(
      /** 事件名 */
      eventId: string,
      /** 上报的自定义数据，key 为配置中的字段名，value 为上报的数据。 */
      data: TaroGeneral.IAnyObject,
    ): void

    /** 给定实验参数数组，获取对应的实验参数值
     * @supported weapp
     * @example
     * ```tsx
     * Taro.getExptInfoSync(['color'])
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.getExptInfoSync.html
     */
    getExptInfoSync(
      /** 实验参数数组，不填则获取所有实验参数 */
      keys?: Array<string>
    ): TaroGeneral.IAnyObject

    /** 给定实验参数数组，获取对应的实验参数值
     * @supported weapp
     * @example
     * ```tsx
     * Taro.getCommonConfig({
     *   keys:["key1", "key2"],
     *   mode: 0,
     *   success: (res) => {
     *     console.log("success")
     *     console.log(res)
     *   },
     *   fail: (res) => {
     *     console.log("fail")
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.getCommonConfig.html
     */
    getCommonConfig(
      option: getCommonConfig.Option
    ): Promise<getCommonConfig.SuccessCallbackResult>
  }
}

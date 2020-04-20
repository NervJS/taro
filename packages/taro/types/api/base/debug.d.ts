declare namespace Taro {
  namespace setEnableDebug {
    type Option = {
      /** 是否打开调试 */
      enableDebug: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface Promised extends General.CallbackResult {
      /** 调用结果 */
      errMsg: string
    }
  }
  /**
   * 设置是否打开调试开关，此开关对正式版也能生效。
   * @supported weapp
   * @example
   * ```tsx
   * // 打开调试
   * Taro.setEnableDebug({
   *     enableDebug: true
   * })
   * // 关闭调试
   * Taro.setEnableDebug({
   *     enableDebug: false
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.setEnableDebug.html
   */
  function setEnableDebug(res: setEnableDebug.Option): Promise<setEnableDebug.Promised>

  namespace getLogManager {
    type Option = {
      /**
       * @default 0
       */
      level?: keyof level
    }

    type level = {
      /** 表示会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志 */
      0
      /** 表示不会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志 */
      1
    }
  }
  /**
   * 获取日志管理器对象。
   * @supported weapp
   * @example
   * ```tsx
   * const logger = Taro.getLogManager({level: 1})
   * 
   * logger.log({str: 'hello world'}, 'basic log', 100, [1, 2, 3])
   * logger.info({str: 'hello world'}, 'info log', 100, [1, 2, 3])
   * logger.debug({str: 'hello world'}, 'debug log', 100, [1, 2, 3])
   * logger.warn({str: 'hello world'}, 'warn log', 100, [1, 2, 3])
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.getLogManager.html
   */
  function getLogManager(res?: getLogManager.Option): LogManager

  /**
   * 日志管理器实例，可以通过 Taro.getLogManager 获取。
   * 
   * 使用说明
   * 最多保存5M的日志内容，超过5M后，旧的日志内容会被删除。
   * 对于小程序，用户可以通过使用 button 组件的 open-type="feedback" 来上传打印的日志。
   * 对于小游戏，用户可以通过使用 Taro.createFeedbackButton 来创建上传打印的日志的按钮。
   * 开发者可以通过小程序管理后台左侧菜单“反馈管理”页面查看相关打印日志。
   * 
   * 基础库默认会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志。
   */
  interface LogManager {
    /** 写 debug 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.debug.html
     */
    debug(
      /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb */
      ...args: any[]
    ): void
    /** 写 info 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.info.html
     */
    info(
      /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb */
      ...args: any[]
    ): void
    /** 写 log 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.log.html
     */
    log(
      /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb */
      ...args: any[]
    ): void
    /** 写 warn 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.warn.html
     */
    warn(
      /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb */
      ...args: any[]
    ): void
}

  /**
   * 获取实时日志管理器对象。
   * @supported weapp
   * @example
   * ```tsx
   * const logger = Taro.getRealtimeLogManager()
   * logger.info({str: 'hello world'}, 'info log', 100, [1, 2, 3])
   * logger.error({str: 'hello world'}, 'error log', 100, [1, 2, 3])
   * logger.warn({str: 'hello world'}, 'warn log', 100, [1, 2, 3])
   * ```
   */
  function getRealtimeLogManager(): RealtimeLogManager

  /**
   * 实时日志管理器实例，可以通过 Taro.getRealtimeLogManager 获取。
   * 
   * 使用说明
   * 为帮助小程序开发者快捷地排查小程序漏洞、定位问题，我们推出了实时日志功能。从基础库2.7.1开始，开发者可通过提供的接口打印日志，日志汇聚并实时上报到小程序后台。
   * 开发者可从小程序管理后台“开发->运维中心->实时日志”进入日志查询页面，查看开发者打印的日志信息。
   */

  interface RealtimeLogManager {
    /** 添加过滤关键字
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.addFilterMsg.html
     */
    addFilterMsg(
      /** 是 setFilterMsg 的添加接口。用于设置多个过滤关键字。 */
      msg: string
    ): void
    /** 写 error 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.error.html
     */
    error(
      /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过5Kb */
      ...args: any[]
    ): void
    /** 设置实时日志page参数所在的页面
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.in.html
     */
    in(
      /** page 实例 */
      pageInstance
    ): void
    /** 写 info 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.info.html
     */
    info(
      /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过5Kb */
      ...args: any[]
    ): void
    /** 设置过滤关键字
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.setFilterMsg.html
     */
    setFilterMsg(
      /** 过滤关键字，最多不超过1Kb，可以在小程序管理后台根据设置的内容搜索得到对应的日志。 */
      msg: string
    ): void
    /** 写 warn 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.warn.html
     */
    warn(
      /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过5Kb */
      ...args: any[]
    ): void
  }
}

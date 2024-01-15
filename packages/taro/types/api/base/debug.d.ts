import Taro from '../../index'

declare module '../../index' {
  namespace setEnableDebug {
    type Option = {
      /** 是否打开调试 */
      enableDebug: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface Promised extends TaroGeneral.CallbackResult {
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace getLogManager {
    type Option = {
      /**
       * @default 0
       */
      level?: keyof Level
    }

    type Level = {
      /** 表示会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志 */
      0
      /** 表示不会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志 */
      1
    }
  }

  /** 向调试面板中打印日志。console 是一个全局对象，可以直接访问。在微信客户端中，向 vConsole 中输出日志。
   * 
   * **注意**
   *  - 由于 vConsole 功能有限，以及不同客户端对 console 方法的支持情况有差异，建议开发者在小程序中只使用本文档中提供的方法。
   *  - 部分内容展示的限制请参见调试
   * @supported weapp, harmony_hybrid
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/console.html
   */
  interface console {
    /** 向调试面板中打印 debug 日志
     * @supported weapp, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/console.debug.html
     */
    debug(
      /** 日志内容，可以有任意多个。 */
      ...args: any[]
    ): void
    /** 向调试面板中打印 error 日志
     * @supported weapp, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/console.error.html
     */
    error(
      /** 日志内容，可以有任意多个。 */
      ...args: any[]
    ): void
    /** 在调试面板中创建一个新的分组
     *
     * **注意**
     * 仅在工具中有效，在 vConsole 中为空函数实现。
     * @supported weapp, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/console.group.html
     */
    group(
      /** 分组标记 */
      label?: string,
    ): void
    /** 结束由 [console.group](#group) 创建的分组
     *
     * **注意**
     * 仅在工具中有效，在 vConsole 中为空函数实现。
     * @supported weapp, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/console.groupEnd.html
     */
    groupEnd(): void
    /** 向调试面板中打印 info 日志
     * @supported weapp, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/console.info.html
     */
    info(
      /** 日志内容，可以有任意多个。 */
      ...args: any[]
    ): void
    /** 向调试面板中打印 log 日志
     * @supported weapp, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/console.log.html
     */
    log(
      /** 日志内容，可以有任意多个。 */
      ...args: any[]
    ): void
    /** 向调试面板中打印 warn 日志
     * @supported weapp, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/console.warn.html
     */
    warn(
      /** 日志内容，可以有任意多个。 */
      ...args: any[]
    ): void
  }

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
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.html
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
   * 实时日志管理器实例，可以通过 Taro.getRealtimeLogManager 获取。
   *
   * 使用说明
   * 为帮助小程序开发者快捷地排查小程序漏洞、定位问题，我们推出了实时日志功能。从基础库2.7.1开始，开发者可通过提供的接口打印日志，日志汇聚并实时上报到小程序后台。
   * 开发者可从小程序管理后台“开发->运维中心->实时日志”进入日志查询页面，查看开发者打印的日志信息。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.html
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
    /** 获取给定标签的日志管理器实例，目前只支持在插件使用
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.tag.html
     */
    tag(
      /** 标签名 */
      tagName: string
    ): RealtimeTagLogManager
    /** 写 warn 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.warn.html
     */
    warn(
      /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过5Kb */
      ...args: any[]
    ): void
  }

  /** 给定标签的实时日志管理器实例，可以通过 给定标签的实时日志管理器实例，可以通过 [RealtimeLogManager.tag](./RealtimeLogManager#tag) 接口获取，目前只支持在插件使用。 接口获取，目前只支持在插件使用。
   * 
   * **使用说明**
   * RealtimeTagLogManager 功能和 [RealtimeLogManager](./RealtimeLogManager) 相似，但是为了让输出的实时日志更易于分析，其具有更严格的格式要求。
   * RealtimeTagLogManager 使用时需要传入标签，调用该实例所输出的日志均会被汇集到对应标签下，同时该实例的日志只支持 key-value 格式进行输出。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeTagLogManager.html
   */
  interface RealtimeTagLogManager {
    /** 添加过滤关键字
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeTagLogManager.addFilterMsg.html
     */
    addFilterMsg(
      /** 是 setFilterMsg 的添加接口。用于设置多个过滤关键字。 */
      msg: string
    ): void
    /** 写 error 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeTagLogManager.error.html
     */
    error(
      /** 日志的 key */
      key: string,
      /** 日志的 key */
      value: Object | any[] | number | string,
    ): void
    /** 写 info 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeTagLogManager.info.html
     */
    info(
      /** 日志的 key */
      key: string,
      /** 日志的 key */
      value: Object | any[] | number | string,
    ): void
    /** 设置过滤关键字
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeTagLogManager.setFilterMsg.html
     */
    setFilterMsg(
      /** 过滤关键字，最多不超过1Kb，可以在小程序管理后台根据设置的内容搜索得到对应的日志。 */
      msg: string
    ): void
    /** 写 warn 日志
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeTagLogManager.warn.html
     */
    warn(
      /** 日志的 key */
      key: string,
      /** 日志的 key */
      value: Object | any[] | number | string,
    ): void
  }

  interface TaroStatic {
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
    setEnableDebug(res: setEnableDebug.Option): Promise<setEnableDebug.Promised>

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
    getRealtimeLogManager(): RealtimeLogManager

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
    getLogManager(res?: getLogManager.Option): LogManager
  }
}

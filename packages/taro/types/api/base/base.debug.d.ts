declare namespace Taro {
  namespace setEnableDebug {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 是否打开调试
       */
      enableDebug: boolean
    }
  }
  /**
   * @since 1.4.0
   *
   * 设置是否打开调试开关，此开关对正式版也能生效。
   *
   * **示例代码：**
   *
   ```javascript
   // 打开调试
   Taro.setEnableDebug({
       enableDebug: true
   })
         // 关闭调试
   Taro.setEnableDebug({
       enableDebug: false
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.setEnableDebug.html
   */
  function setEnableDebug(OBJECT: setEnableDebug.Param): Promise<setEnableDebug.Promised>

  namespace getLogManager {
    type Param = {
      /**
       * @since 2.3.2
       *
       * 取值为0/1，取值为0表示是否会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志，取值为1则不会。默认值是 0
       */
      level?: number
    }
    type Return = {
      /**
       * 写 debug 日志
       */
      debug(...args: any[]): void
      /**
       * 写 info 日志
       */
      info(...args: any[]): void
      /**
       * 写 log 日志
       */
      log(...args: any[]): void
      /**
       * 写 warn 日志
       */
      warn(...args: any[]): void
    }
  }
  /**
   * @since 2.1.0
   *
   * 获取日志管理器对象。
   *
   * **示例代码：**
   *
   ```javascript
   const logger = Taro.getLogManager({level: 1})
   logger.log({str: 'hello world'}, 'basic log', 100, [1, 2, 3])
   logger.info({str: 'hello world'}, 'info log', 100, [1, 2, 3])
   logger.debug({str: 'hello world'}, 'debug log', 100, [1, 2, 3])
   logger.warn({str: 'hello world'}, 'warn log', 100, [1, 2, 3])
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.getLogManager.html
   */
  function getLogManager(OBJECT?: getLogManager.Param): getLogManager.Return

  // TODO: wx.getRealtimeLogManager
}

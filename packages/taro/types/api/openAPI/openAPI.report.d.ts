declare namespace Taro {
  /**
   * 自定义业务数据监控上报接口。
   * @since 2.0.1
   * @example
   ```javascript
   Taro.reportMonitor('1', 1)
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/report/wx.reportMonitor.html
   */
  function reportMonitor(monitorId: string, count: number): void
}

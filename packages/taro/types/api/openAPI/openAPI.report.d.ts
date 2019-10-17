declare namespace Taro {
  /**
   * @since 2.0.1
   *
   * 自定义业务数据监控上报接口。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.reportMonitor('1', 1)
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/report/wx.reportMonitor.html
   */
  function reportMonitor(monitorId: string, count: number): void
}

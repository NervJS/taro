declare namespace Taro {
  /**
   * 自定义分析数据上报接口。使用前，需要在小程序管理后台自定义分析中新建事件，配置好事件名与字段。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.reportAnalytics('purchase', {
     price: 120,
     color: 'red'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/data-analysis/wx.reportAnalytics.html
   */
  function reportAnalytics(eventName: string, data: any): void
}

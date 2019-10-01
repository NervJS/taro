declare namespace Taro {
  /**
   * 停止当前页面下拉刷新。
   *
   * **示例代码：**
   *
   ```javascript
   Page({
     onPullDownRefresh: function(){
       Taro.stopPullDownRefresh()
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/pull-down-refresh/wx.stopPullDownRefresh.html
   */
  function stopPullDownRefresh(): void

  namespace startPullDownRefresh {
    type Promised = {
      /**
       * 接口调用结果
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.5.0
   *
   * 开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startPullDownRefresh()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/pull-down-refresh/wx.startPullDownRefresh.html
   */
  function startPullDownRefresh(OBJECT?: startPullDownRefresh.Param): Promise<startPullDownRefresh.Promised>
}

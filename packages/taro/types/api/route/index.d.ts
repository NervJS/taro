declare namespace Taro {
  namespace switchTab {
    type Param = {
      /**
       * 需要跳转的 tabBar 页面的路径（需在 app.json 的 [tabBar](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#tabbar) 字段定义的页面），路径后不能带参数
       */
      url: string
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   *
   * **示例代码：**
   *
   ```json
   {
     "tabBar": {
       "list": [{
         "pagePath": "index",
         "text": "首页"
       },{
         "pagePath": "other",
         "text": "其他"
       }]
     }
   }
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Taro.switchTab({
     url: '/index'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html
   */
  function switchTab(OBJECT: switchTab.Param): Promise<any>

  namespace reLaunch {
    type Param = {
      /**
       * 需要跳转的应用内页面路径 , 路径后可以带参数。参数与路径之间使用`?`分隔，参数键与参数值用`=`相连，不同参数用`&`分隔；如 'path?key=value&key2=value2'，如果跳转的页面路径是 tabBar 页面则不能带参数
       */
      url: string
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * @since 1.1.0
   *
   * 关闭所有页面，打开到应用内的某个页面。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.reLaunch({
     url: 'test?id=1'
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   //test.js
   Page({
     onLoad: function(option){
       console.log(option.query)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html
   */
  function reLaunch(OBJECT: reLaunch.Param): Promise<any>

  namespace redirectTo {
    type Param = {
      /**
       * 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用`?`分隔，参数键与参数值用`=`相连，不同参数用`&`分隔；如 'path?key=value&key2=value2'
       */
      url: string
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 关闭当前页面，跳转到应用内的某个页面。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.redirectTo({
     url: 'test?id=1'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.redirectTo.html
   */
  function redirectTo(OBJECT: redirectTo.Param): Promise<any>

  namespace navigateTo {
    type Param = {
      /**
       * 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用`?`分隔，参数键与参数值用`=`相连，不同参数用`&`分隔；如 'path?key=value&key2=value2'
       */
      url: string
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 保留当前页面，跳转到应用内的某个页面，使用`Taro.navigateBack`可以返回到原页面。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.navigateTo({
     url: 'test?id=1'
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   //test.js
   Page({
     onLoad: function(option){
       console.log(option.query)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
   */
  function navigateTo(OBJECT: navigateTo.Param): Promise<any>

  namespace navigateBack {
    type Param = {
      /**
       * 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
       *
       * @default 1
       */
      delta?: number
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 关闭当前页面，返回上一页面或多级页面。可通过 [`getCurrentPages()`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getCurrentPages.html) 获取当前的页面栈，决定需要返回几层。
   *
   * **Tip：**
   *
   * 1.  `tip`: Taro.navigateTo 和 Taro.redirectTo 不允许跳转到 tabbar 页面，只能用 Taro.switchTab 跳转到 tabbar 页面
   *
   * **示例代码：**
   *
   ```javascript
   // 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。见下方示例代码
         // 此处是A页面
   Taro.navigateTo({
     url: 'B?id=1'
   })
         // 此处是B页面
   Taro.navigateTo({
     url: 'C?id=1'
   })
         // 在C页面内 navigateBack，将返回A页面
   Taro.navigateBack({
     delta: 2
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html
   */
  function navigateBack(OBJECT?: navigateBack.Param): Promise<any>

  // TODO: EventChannel
}

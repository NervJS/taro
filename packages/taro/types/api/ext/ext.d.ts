declare namespace Taro {
  namespace getExtConfigSync {
    type Return = {
      /**
       * 第三方平台自定义的数据
       */
      extConfig: any
    }
  }
  /**
   * @since 1.1.0
   *
   * 获取[第三方平台](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/ext.html)自定义的数据字段的同步接口。
   *
   * **Bug & Tip：**
   *
   * 1.  `Taro.getExtConfigSync` 暂时无法通过 `Taro.canIUse` 判断是否兼容，开发者需要自行判断 `Taro.getExtConfigSync` 是否存在来兼容
   *
   * **示例代码：**
   *
   ```javascript
   let extConfig = Taro.getExtConfigSync? Taro.getExtConfigSync(): {}
   console.log(extConfig)
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ext/wx.getExtConfigSync.html
   */
  function getExtConfigSync(): getExtConfigSync.Return

  namespace getExtConfig {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
      /**
       * 第三方平台自定义的数据
       */
      extConfig: any
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 获取[第三方平台](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/ext.html)自定义的数据字段。
   *
   * **Bug & Tip：**
   *
   * 1.  `Taro.getExtConfig` 暂时无法通过 `Taro.canIUse` 判断是否兼容，开发者需要自行判断 `Taro.getExtConfig` 是否存在来兼容
   *
   * **示例代码：**
   *
   ```javascript
   if(Taro.getExtConfig) {
     Taro.getExtConfig({
       success: function (res) {
         console.log(res.extConfig)
       }
     })
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ext/wx.getExtConfig.html
   */
  function getExtConfig(OBJECT?: getExtConfig.Param): Promise<getExtConfig.Promised>
}

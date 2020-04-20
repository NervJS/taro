declare namespace Taro {
  namespace getWeRunData {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
      /**
       * 包括敏感数据在内的完整用户信息的加密数据，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       *
       * **encryptedData：**
       *
       * encryptedData 解密后为以下 json 结构，详见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       *
       *   属性                       |  类型          |  说明
       * -----------------------------|----------------|-------------------
       *   stepInfoList               |  ObjectArray   |用户过去三十天的微信运动步数
       *   stepInfoList[].timestamp   |  Number        |时间戳，表示数据对应的时间
       *   stepInfoList[].step        |  Number        |  微信运动步数
       */
      encryptedData: string
      /**
       * 加密算法的初始向量，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       */
      iv: string
      /**
       * 敏感数据对应的云 ID，开通云开发的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud)
       */
      cloudID: string
    }
    type Param = {
      /**
       * 超时时间，单位 ms
       *
       * @since 1.9.90
       */
      timeout?: number
    }
  }
  /**
   * @since 1.2.0
   *
   * 获取用户过去三十天微信运动步数，需要先调用 [Taro.login](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html) 接口。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.werun
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getWeRunData({
       success(res) {
           const encryptedData = res.encryptedData
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html
   */
  function getWeRunData(OBJECT?: getWeRunData.Param): Promise<getWeRunData.Promised>
}

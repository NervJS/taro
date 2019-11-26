declare namespace Taro {
  namespace updateShareMenu {
    type Param = {
      /**
       * 是否使用带 shareTicket 的转发[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html)
       */
      withShareTicket?: boolean,
      /**
       * 是否是动态消息，详见[动态消息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share/updatable-message.html)
       * 
       */
      isUpdatableMessage?: boolean,
      /**
       * 动态消息的 activityId。通过 [updatableMessage.createActivityId](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/updatable-message/updatableMessage.createActivityId.html) 接口获取
       * 
       */
      activityId?: string,
      /**
       * 动态消息的模板信息
       * 
       */
      templateInfo?: TemplateInfo
    }

    interface TemplateInfo {
      /**
       * 参数列表
       */
      parameterList: Array<TemplateInfoParameter>
    }

    interface TemplateInfoParameter {
      /**
       * 参数名
       */
      name: string,
      /**
       * 参数值
       */
      value: string
    }
  }
  /**
   * 更新转发属性
   * @example
   ```tsx
   Taro.updateShareMenu({
     withShareTicket: true,
     success() {
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.updateShareMenu.html
   */
  function updateShareMenu(res?: updateShareMenu.Param): Promise<any>

  namespace showShareMenu {
    type Param = {
      /**
       * 是否使用带 shareTicket 的转发[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html)
       */
      withShareTicket?: boolean,
      /**
      * QQ小程序分享功能，支持分享到QQ、QQ空间、微信好友、微信朋友圈
      * 支持的值： ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
      */
      showShareItems?: string[]
    }
  }
  /**
   * 显示当前页面的转发按钮
   * @example
   ```tsx
   Taro.showShareMenu({
     withShareTicket: true
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html
   */
  function showShareMenu(res?: showShareMenu.Param): Promise<any>

  namespace hideShareMenu {
    type Param = {}
  }
  /**
   * 隐藏转发按钮
   * @example
   ```tsx
   Taro.hideShareMenu()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.hideShareMenu.html
   */
  function hideShareMenu(res?: hideShareMenu.Param): Promise<any>

  namespace getShareInfo {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 包括敏感数据在内的完整转发信息的加密数据，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       *
       * **encryptedData 解密后为一个 JSON 结构，包含字段如下：**
       *
       *   字段      |  说明
       * ------------|------------------
       *   openGId   |群对当前小程序的唯一 ID
       *
       * **Tip:** 如需要展示群名称，可以使用[开放数据组件](https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html)
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
       * shareTicket
       */
      shareTicket: string
      /**
       * 超时时间，单位 ms
       */
      timeout?: number
    }
  }
  /**
   * 获取转发详细信息
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.getShareInfo.html
   */
  function getShareInfo(res: getShareInfo.Param): Promise<getShareInfo.Promised>
}

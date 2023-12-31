import Taro from '../../index'

declare module '../../index' {
  namespace openQzonePublish {
    interface Option {
      /** 传递的文字内容 */
      text: string
      /** 传递的视频/图片内容，显示顺序为元素下标顺序 */
      media: Media[]
      /** 说说小尾巴跳转到的页面路径，不填则默认跳到主页 */
      path: string
      /** 说说小尾巴显示的文案，不填则默认显示小程序的简介文案 */
      footnote: string
    }
    type Media = {
      /** 图片填"photo"，视频填"video" */
      type: MediaType
      /** 文件路径，必须为本地文件 */
      path: string
    }
    type MediaType = 'photo' | 'video'
  }

  namespace getQQRunData {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /**
       * 包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法。
       */
      encryptedData: string
      /**
       * 加密算法的初始向量，详细见加密数据解密算法
       */
      iv: string
    }
  }

  namespace setOfficialDress {
    interface Option {
      /** 方法名，设置头像填"setAvatar"，其他方法后续开放 */
      action: string
      /** openid，给自己设置头像填"self" */
      uin: string
      /** 物品id */
      item_id?: string
      /** 设置头像"setAvatar"此处不用填 */
      busi_info?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace setCustomDress {
    interface Option {
      /** 方法名，设置头像填"uploadAvatar"，其他方法后续开放 */
      action: string
      /** 素材路径，必须为本地文件，路径为 wxfile:// 的形式 */
      path: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace updateQQApp {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace addRecentColorSign {
    interface Option {
      /**
       * 做为点击最近彩签打开的小程序页面的启动参数，如 a=1&b=2
       * 默认值：当前页面的查询参数
       */
      query?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getGuildInfo {
    interface Option {
      /** 频道id */
      open_guild_id: string
      /** 子频道Id */
      channel_id?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends  TaroGeneral.CallbackResult {
      /** 加密之后的数据，需要解密 */
      encryptedData: string
      /** 对称解密算法初始向量(base64) */
      iv: string
      /** 签名(base64) */
      signature: string
    }
  }

  namespace applyAddToMyApps {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult {
      /** true 代表用户选择了同意 */
      confirm: boolean
      /** true 代表用户选择了不同意 */
      cancel: boolean
    }
  }

  namespace isAddedToMyApps {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends  TaroGeneral.CallbackResult {
      /** true 代表用户已经添加，false 则还没添加 */
      isAdded: boolean
    }
  }

  interface TaroStatic {
    /**
     * 此接口可打开手Q说说发表界面，并将文字内容和图片/视频内容传递到手Q说说发表界面。
     * @supported qq
     * @example
     * ```tsx
     * Taro.openQzonePublish({
     *   footnote: '使用同款滤镜',
     *   path: 'pages/index/index',
     *   text: '我爱中国',
     *   media: [
     *     {
     *       type: 'photo',
     *       path: 'qqfile://1.png'
     *     },
     *     {
     *       type: 'video',
     *       path: 'qqfile://2.mp4'
     *     }
     *   ]
     * })
     * ```
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/port_openQzonePublish.html
     */
    openQzonePublish(option: openQzonePublish.Option): void
    /**
     * 获取用户过去三十天QQ运动步数。需要先调用 qq.login 接口。步数信息会在用户主动进入小程序时更新。
     * @supported qq
     * @example
     * ```tsx
     * Taro.getQQRunData({
     *   success(res) {
     *     // 拿 encryptedData 到开发者后台解密开放数据
     *     const encryptedData = res.encryptedData
     *   }
     * })
     * ```
     *
     * **开放数据 JSON 结构**
     * 敏感数据有两种获取方式，一是使用 加密数据解密算法 。 获取得到的开放数据为以下 json 结构：
     *
     * ```json
     * {
     *   "stepInfoList": [
     *     {
     *       "timestamp": 1445866601,
     *       "step": 100
     *     },
     *     {
     *       "timestamp": 1445876601,
     *       "step": 120
     *     }
     *   ]
     * }
     * ```
     * * stepInfoList 中，每一项结构如下：
     *
     * | 属性 | 类型 | 说明 |
     * | --- | ---- | --- |
     * | timestamp | number | 时间戳，表示数据对应的时间 |
     * | step | number | QQ运动步数 |
     * 
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/port_sport.html
     */
    getQQRunData(option: getQQRunData.Option): void
    /**
     * QQ美化平台内测阶段，仅被邀请的商户可使用此接口。
     * @supported qq
     * @example
     * ```tsx
     * Taro.setOfficialDress({
     *   action: "setAvatar",
     *   uin: "self",
     *   item_id: "2740",
     *   success(res) {
     *     console.log("success"+res);
     *   },
     *   fail(res) {
     *     console.log("fail"+res);
     *   }
     * })
     * ```
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/personalize.html#qq-setofficialdress
     */
    setOfficialDress(option: setOfficialDress.Option): void
    /**
     * QQ美化平台内测阶段，仅被邀请的商户可使用此接口。
     * @supported qq
     * @example
     * ```tsx
     * Taro.setCustomDress({
     *   action: "uploadAvatar",
     *   path:"wxfile://images/1.png"
     *   success(res) {
     *     console.log("success"+res);
     *   },
     *   fail(res) {
     *     console.log("fail"+res);
     *   }
     * })
     * ```
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/personalize.html#qq-setcustomdress
     */
    setCustomDress(option: setCustomDress.Option): void
    /**
     * 更新 QQ 版本
     * @supported qq
     * @example
     * ```tsx
     * Taro.updateQQApp({
     *   success: function(res) {
     *     console.log('updateQQApp success',res)
     *   },
     *   fail: function(err) {
     *     console.log('updateQQApp fail',err)
     *   },
     *   complete: function(res) {
     *     console.log('updateQQApp info',res)
     *   }
     * })
     * ```
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/port_updateQQ.html#qq-updateqqapp
     */
    updateQQApp(option: updateQQApp.Option): void
    /**
     * 添加当前小程序页面到最近浏览彩签，需要授权基础库 1.20.0 开始支持。
     * 提示：在手 Q 8.9.0 前的版本，当系统未授予手 Q 悬浮穿权限时，每次调用该接口都会弹出系统授权窗口。自手 Q 8.9.0 起交互调整如下:
     *   1. 系统没有授予手 Q 悬浮窗权限时，接口执行 fail 回调函数并附带 ”No floating window permission“的错误信息，开发者可针对此信息在业务代码里弹窗提示用户手动授予手 Q 悬浮窗权限。
     *   2. 安卓系统部分机型存在获取悬浮窗权限不准确情况。
     * @supported qq
     * @example
     * ```tsx
     * Taro.addRecentColorSign({
     *   query: 'a=1&b=2',
     *   success(res) {
     *     console.log('addRecentColorSign success: ', res)
     *   },
     *   fail(err) {
     *     console.log('addRecentColorSign fail: ', err)
     *   },
     *   complete(res) {
     *     console.log('addRecentColorSign complete: ', res)
     *   }
     * })
     * ```
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/port_addColorSign.html#qq-addrecentcolorsign
     */
    addRecentColorSign(option: addRecentColorSign.Option): void
    /**
     * 获取频道信息与当前人身份（FOR 机器人服务入口）
     * @supported qq
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/port_guild.html
     */
    getGuildInfo(option: getGuildInfo.Option): void
    /**
     * 申请用户将本小程序添加到下拉页面中“我的小程序”当中，手Q8.9.13及以上版本支持
     * @supported qq
     * @example
     * ```tsx
     * Taro.applyAddToMyApps({
     *   success(res) {
     *     if (res.confirm) {
     *       // 用户同意添加
     *     }
     *     if (res.cancel) {
     *       // 用户不同意添加
     *     }
     *     // 原则上，confirm和cancel是互斥的
     *   }
     * })
     * ```
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/port_addToMyApps.html#qq-applyaddtomyapps
     */
    applyAddToMyApps(option: applyAddToMyApps.Option): void
    /**
     * 查询用户是否已经将本小程序添加到下拉页面中“我的小程序”当中，手Q8.9.13及以上版本支持，建议使用qq.applyAddToMyApps之前先调用qq.isAddedToMyApps来作前置判断
     * @supported qq
     * @example
     * ```tsx
     * Taro.isAddedToMyApps({
     *   success(res) {
     *     if (res.isAdded) {
     *       // 用户已经添加
     *     } else {
     *       // 用户还未添加
     *     }
     *   }
     * })
     * ```
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/port_addToMyApps.html#qq-isaddedtomyapps
     */
    isAddedToMyApps(option: isAddedToMyApps.Option): void
  }
}

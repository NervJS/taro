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

  interface TaroStatic {
    /**
     * 此接口可打开手Q说说发表界面，并将文字内容和图片/视频内容传递到手Q说说发表界面。
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
     * @supported qq
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/port_openQzonePublish.html
     */
    openQzonePublish(option: openQzonePublish.Option): void

    /**
     * 获取用户过去三十天QQ运动步数。需要先调用 qq.login 接口。步数信息会在用户主动进入小程序时更新。
     * ```tsx
     * Taro.getQQRunData({
     *   success(res) {
     *     // 拿 encryptedData 到开发者后台解密开放数据
     *     const encryptedData = res.encryptedData
     *   }
     * })
     * ```
     * @supported qq
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/port_sport.html
     */
    getQQRunData(option: getQQRunData.Option): void

    /**
     * QQ美化平台内测阶段，仅被邀请的商户可使用此接口。
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
     * @supported qq
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/personalize.html#qq-setofficialdress
     */
    setOfficialDress(option: setOfficialDress.Option): void

    /**
     * QQ美化平台内测阶段，仅被邀请的商户可使用此接口。
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
     * @supported qq
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/personalize.html#qq-setcustomdress
     */
    setCustomDress(option: setCustomDress.Option): void
  }
}

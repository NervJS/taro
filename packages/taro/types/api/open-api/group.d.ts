import Taro from '../../index'

declare module '../../index' {
  namespace getGroupEnterInfo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 包括敏感数据在内的完整转发信息的加密数据，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html) */
      encryptedData: string
      /** 加密算法的初始向量，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html) */
      iv: string
      /** 敏感数据对应的云 ID，开通[云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud) */
      cloudID?: string
    }
  }

  interface TaroStatic {
    /** 获取微信群聊场景下的小程序启动信息。群聊场景包括群聊小程序消息卡片、群待办、群工具。可用于获取当前群的 opengid。
     * 
     * **Tips**
     *  - 如需要展示群名称，小程序可以使用[开放数据组件](/docs/components/open/open-data)
     *  - 小游戏可以通过 `Taro.getGroupInfo` 接口获取群名称
     * @supported weapp
     * @example
     * ```tsx
     * Taro.getGroupEnterInfo({
     *   success(res) {
     *     // res
     *     {
     *       errMsg: 'getGroupEnterInfo:ok',
     *       encryptedData: '',
     *       iv: ''
     *     }
     *   },
     *   fail() { }
     * })
     * ```
     *
     * 敏感数据有两种获取方式，一是使用 [加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95) 。 获取得到的开放数据为以下 json 结构（其中 opengid 为当前群的唯一标识）：
     *
     * ```json
     * {
     *   "opengid": "OPENGID"
     * }
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/group/wx.getGroupEnterInfo.html
     */
    getGroupEnterInfo(option?: getGroupEnterInfo.Option): Promise<TaroGeneral.CallbackResult>
  }
}

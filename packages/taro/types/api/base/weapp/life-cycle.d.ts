import Taro from '../../../index'

declare module '../../../index' {
  namespace getLaunchOptionsSync {
    /** 启动参数 */
    interface LaunchOptions {
      /** 启动小程序的路径 */
      path: string
      /** 启动小程序的 query 参数 */
      query: TaroGeneral.IAnyObject
      /** 启动小程序的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) */
      scene: number
      /** shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) */
      shareTicket: string
      /** 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意) */
      referrerInfo: LaunchOptions.ReferrerInfo
      /** 打开的文件信息数组，只有从聊天素材场景打开（scene为1173）才会携带该参数 */
      forwardMaterials?: LaunchOptions.ForwardMaterial[]
      /** 从微信群聊/单聊打开小程序时，chatType 表示具体微信群聊/单聊类型 */
      chatType?: keyof LaunchOptions.ChatType
      /** API 类别 */
      apiCategory?: keyof LaunchOptions.ApiCategory
    }

    namespace LaunchOptions {
      /** 来源信息 */
      interface ReferrerInfo {
        /** 来源小程序、公众号或 App 的 appId */
        appId?: string
        /** 来源小程序传过来的数据，scene=1037或1038时支持 */
        extraData?: TaroGeneral.IAnyObject
      }
      /** ChatType 类型合法值 */
      interface ForwardMaterial {
        /** 文件的mimetype类型 */
        type: string
        /** 文件名 */
        name: string
        /** 文件路径（如果是webview则是url） */
        path: string
        /** 文件大小 */
        size: number
      }
      /** ChatType 类型合法值 */
      interface ChatType {
        /** 微信联系人单聊 */
        1
        /** 企业微信联系人单聊 */
        2
        /** 普通微信群聊 */
        3
        /** 企业微信互通群聊 */
        4
      }
      /** API 类别合法值 */
      interface ApiCategory {
        /** 默认类别 */
        default
        /** 原生功能化，视频号直播商品、商品橱窗等场景打开的小程序 */
        nativeFunctionalized
        /** 仅浏览，朋友圈快照页等场景打开的小程序 */
        browseOnly
        /** 内嵌，通过打开半屏小程序能力打开的小程序 */
        embedded
      }
    }
  }

  namespace getEnterOptionsSync {
    /** 启动参数 */
    interface EnterOptions {
      /** 启动小程序的路径 */
      path: string
      /** 启动小程序的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) */
      scene: number
      /** 启动小程序的 query 参数 */
      query: TaroGeneral.IAnyObject
      /** shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) */
      shareTicket: string
      /** 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意) */
      referrerInfo: EnterOptions.ReferrerInfo
      /** 打开的文件信息数组，只有从聊天素材场景打开（scene为1173）才会携带该参数 */
      forwardMaterials?: EnterOptions.ForwardMaterial[]
      /** 从微信群聊/单聊打开小程序时，chatType 表示具体微信群聊/单聊类型 */
      chatType?: keyof EnterOptions.ChatType
      /** API 类别 */
      apiCategory?: keyof EnterOptions.ApiCategory
    }

    namespace EnterOptions {
      /** 来源信息 */
      interface ReferrerInfo {
        /** 来源小程序、公众号或 App 的 appId */
        appId?: string
        /** 来源小程序传过来的数据，scene=1037或1038时支持 */
        extraData?: TaroGeneral.IAnyObject
      }
      /** ChatType 类型合法值 */
      interface ForwardMaterial {
        /** 文件的mimetype类型 */
        type: string
        /** 文件名 */
        name: string
        /** 文件路径（如果是webview则是url） */
        path: string
        /** 文件大小 */
        size: number
      }
      /** ChatType 类型合法值 */
      interface ChatType {
        /** 微信联系人单聊 */
        1
        /** 企业微信联系人单聊 */
        2
        /** 普通微信群聊 */
        3
        /** 企业微信互通群聊 */
        4
      }
      /** API 类别合法值 */
      interface ApiCategory {
        /** 默认类别 */
        default
        /** 原生功能化，视频号直播商品、商品橱窗等场景打开的小程序 */
        nativeFunctionalized
        /** 仅浏览，朋友圈快照页等场景打开的小程序 */
        browseOnly
        /** 内嵌，通过打开半屏小程序能力打开的小程序 */
        embedded
      }
    }
  }

  interface TaroStatic {
    /**
     * 获取小程序启动时的参数。与 [`App.onLaunch`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onlaunchobject-object) 的回调参数一致。
     *
     * **注意**
     * 部分版本在无`referrerInfo`的时候会返回 `undefined`，建议使用 `options.referrerInfo && options.referrerInfo.appId` 进行判断。
     * @supported weapp, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html
     */
    getLaunchOptionsSync(): getLaunchOptionsSync.LaunchOptions

    /**
     * 获取本次小程序启动时的参数。如果当前是冷启动，则返回值与 [`App.onLaunch`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onLaunch-Object-object) 的回调参数一致；如果当前是热启动，则返回值与 [`App.onShow`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onShow-Object-object) 一致。
     *
     * **注意**
     * 部分版本在无 `referrerInfo` 的时候会返回 `undefined`，建议使用 `options.referrerInfo && options.referrerInfo.appId` 进行判断。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getEnterOptionsSync.html
     */
    getEnterOptionsSync(): getEnterOptionsSync.EnterOptions
  }
}

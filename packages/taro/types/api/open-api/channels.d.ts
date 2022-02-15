import Taro from '../../index'

declare module '../../index' {
  namespace reserveChannelsLive {
    interface Option {
      /** 预告 id，通过 [getChannelsLiveNoticeInfo](./getChannelsLiveNoticeInfo) 接口获取 */
      noticeId: string
    }
  }

  namespace openChannelsUserProfile {
    interface Option {
      /** 视频号 id */
      finderUserName: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: TaroGeneral.CallbackResult) => void
    }
  }

  namespace openChannelsLive {
    interface Option {
      /** 视频号 id，以“sph”开头的id，可在视频号助手获取 */
      finderUserName: string
      /** 直播 feedId，通过 getChannelsLiveInfo 接口获取 */
      feedId?: string
      /** 直播 nonceId，通过 getChannelsLiveInfo 接口获取 */
      nonceId?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: TaroGeneral.CallbackResult) => void
    }
  }

  namespace openChannelsEvent {
    interface Option {
      /** 视频号 id，以“sph”开头的id，可在视频号助手获取 */
      finderUserName: string
      /** 活动 id */
      eventId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: TaroGeneral.CallbackResult) => void
    }
  }

  namespace openChannelsActivity {
    interface Option {
      /** 视频号 id，以“sph”开头的id，可在视频号助手获取 */
      finderUserName: string
      /** 视频 feedId */
      feedId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getChannelsLiveNoticeInfo {
    interface Option {
      /** 视频号 id，以“sph”开头的id，可在视频号助手获取 */
      finderUserName: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 预告 nonceId */
      nonceId: string
      /** 预告状态：0可用 1取消 2已用 */
      status: keyof Status | number
      /** 开始时间 */
      startTime: string
      /** 直播封面 */
      headUrl: string
      /** 视频号昵称 */
      nickname: string
      /** 是否可预约 */
      reservable: boolean
    }
    interface Status {
      /** 可用 */
      0
      /** 取消 */
      1
      /** 已用 */
      2
    }
  }

  namespace getChannelsLiveInfo {
    interface Option {
      /** 视频号 id，以“sph”开头的id，可在视频号助手获取 */
      finderUserName: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 直播 feedId */
      feedId: string
      /** 直播 nonceId */
      nonceId: string
      /** 直播主题 */
      description: string
      /** 直播状态，2直播中，3直播结束 */
      status: keyof Status | number
      /** 视频号头像 */
      headUrl: string
      /** 视频号昵称 */
      nickname: string
    }
    interface Status {
      /** 直播中 */
      2
      /** 直播结束 */
      3
    }
  }

  interface TaroStatic {
    /** 预约视频号直播
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/channels/wx.reserveChannelsLive.html
     */
    reserveChannelsLive(option?: reserveChannelsLive.Option): void
    /** 打开视频号主页
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/channels/wx.openChannelsUserProfile.html
     */
    openChannelsUserProfile(option?: openChannelsUserProfile.Option): Promise<TaroGeneral.CallbackResult>
    /** 打开视频号直播
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/channels/wx.openChannelsLive.html
     */
    openChannelsLive(option?: openChannelsLive.Option): Promise<TaroGeneral.CallbackResult>
    /** 打开视频号活动页
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/channels/wx.openChannelsEvent.html
     */
    openChannelsEvent(option?: openChannelsEvent.Option): Promise<TaroGeneral.CallbackResult>
    /** 打开视频号视频
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/channels/wx.openChannelsActivity.html
     */
    openChannelsActivity(option?: openChannelsActivity.Option): Promise<TaroGeneral.CallbackResult>
    /** 获取视频号直播预告信息
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/channels/wx.getChannelsLiveNoticeInfo.html
     */
    getChannelsLiveNoticeInfo(option?: getChannelsLiveNoticeInfo.Option): Promise<getChannelsLiveNoticeInfo.SuccessCallbackResult>
    /** 获取视频号直播信息
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/channels/wx.getChannelsLiveInfo.html
     */
    getChannelsLiveInfo(option?: getChannelsLiveInfo.Option): Promise<getChannelsLiveInfo.SuccessCallbackResult>
  }
}

import Taro from '../../index'

declare module '../../index' {
  namespace updateVoIPChatMuteConfig {
    interface Option {
      /** 静音设置 */
      muteConfig: MuteConfig
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    /** 静音设置 */
    interface MuteConfig {
      /** 是否静音麦克风 */
      muteMicrophone?: boolean
      /** 是否静音耳机 */
      muteEarphone?: boolean
    }
  }

  namespace subscribeVoIPVideoMembers {
    interface Option {
      /** 订阅的成员列表 */
      openIdList: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace setEnable1v1Chat {
    interface Option {
      /** 是否开启 */
      enable: boolean
      /** 窗口背景色
       * @default 0
       */
      backgroundType?: keyof ColorType
      /** 小窗样式
       * @default 1
       */
      minWindowType?: keyof ColorType
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    /** 音频通话背景以及小窗模式背景 */
    interface ColorType {
      /** #262930 */
      0
      /** #FA5151 */
      1
      /** #FA9D3B */
      2
      /** #3D7257 */
      3
      /** #1485EE */
      4
      /** #6467F0 */
      5
    }
  }

  namespace onVoIPVideoMembersChanged {
    interface Result extends TaroGeneral.CallbackResult {
      /** 开启视频的成员名单 */
      openIdList: string[]
      /** 错误码 */
      errCode: number
      /** 调用结果 */
      errMsg: string
    }
    /** 实时语音通话成员视频状态变化事件的回调函数 */
    type Callback = (res: Result) => void
  }

  namespace onVoIPChatStateChanged {
    interface Result extends TaroGeneral.CallbackResult {
      /** 事件码 */
      code: number
      /** 附加信息 */
      data: Record<any, any>
      /** 错误码 */
      errCode: number
      /** 调用结果 */
      errMsg: string
    }
    /** 房间状态变化事件的回调函数 */
    type Callback = (res: Result) => void
  }

  namespace onVoIPChatSpeakersChanged {
    interface Result extends TaroGeneral.CallbackResult {
      /** 还在实时语音通话中的成员 openId 名单 */
      openIdList: string[]
      /** 错误码 */
      errCode: number
      /** 调用结果 */
      errMsg: string
    }
    /** 房间状态变化事件的回调函数 */
    type Callback = (res: Result) => void
  }

  namespace onVoIPChatMembersChanged {
    interface Result extends TaroGeneral.CallbackResult {
      /** 还在实时语音通话中的成员 openId 名单 */
      openIdList: string[]
      /** 错误码 */
      errCode: number
      /** 调用结果 */
      errMsg: string
    }
    /** 房间状态变化事件的回调函数 */
    type Callback = (res: Result) => void
  }

  namespace onVoIPChatInterrupted {
    interface Result extends TaroGeneral.CallbackResult {
      /** 还在实时语音通话中的成员 openId 名单 */
      openIdList: string[]
      /** 错误码 */
      errCode: number
      /** 调用结果 */
      errMsg: string
    }
    /** 房间状态变化事件的回调函数 */
    type Callback = (res: Result) => void
  }

  namespace joinVoIPChat {
    type Promised = FailCallbackResult | SuccessCallbackResult
    interface Option {
      /** 房间类型
       * @default "voice"
       */
      roomType?: RoomType
      /** 签名，用于验证小游戏的身份 */
      signature: string
      /** 验证所需的随机字符串 */
      nonceStr: string
      /** 验证所需的时间戳 */
      timeStamp: number
      /** 小游戏内此房间/群聊的 ID。同一时刻传入相同 groupId 的用户会进入到同个实时语音房间。 */
      groupId: string
      /** 静音设置 */
      muteConfig?: MuteConfig
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    /** 房间类型 */
    interface RoomType {
      /** 音频房间，用于语音通话 */
      voice
      /** 视频房间，结合 [voip-room](/docs/components/media/voip-room) 组件可显示成员画面 */
      video
    }
    /** 静音设置 */
    interface MuteConfig {
      /** 是否静音麦克风 */
      muteMicrophone?: boolean
      /** 是否静音耳机 */
      muteEarphone?: boolean
    }
    interface FailCallbackResult extends TaroGeneral.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: keyof VoipErrCode
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 还在实时语音通话中的成员 openId 名单 */
      openIdList: string[]
      /** 错误码 */
      errCode: number
      /** 调用结果 */
      errMsg: string
    }
    /** Voip 错误码 */
    interface VoipErrCode {
      /** 当前已在房间内 */
      [-1]
      /** 录音设备被占用，可能是当前正在使用微信内语音通话或系统通话 */
      [-2]
      /** 加入会话期间退出（可能是用户主动退出，或者退后台、来电等原因），因此加入失败 */
      [-3]
      /** 系统错误 */
      [-1000]
    }
  }

  namespace join1v1Chat {
    interface Caller {
      /** 昵称 */
      nickname: string
      /** 头像 */
      headImage?: string
      /** 小程序内 openid */
      openid: string
    }
    interface Listener {
      /** 昵称 */
      nickname: string
      /** 头像 */
      headImage?: string
      /** 小程序内 openid */
      openid: string
    }
    interface RoomType {
      /** 语音通话 */
      voice
      /** 视频通话 */
      video
    }
    interface Option {
      /** 呼叫方信息 */
      caller: Caller
      /** 接听方信息 */
      listener: Listener
      /** 窗口背景色
       * @default 0
       */
      backgroundType?: keyof setEnable1v1Chat.ColorType
      /** 通话类型 */
      roomType?: keyof RoomType
      /** 小窗样式
       * @default 1
       */
      minWindowType?: keyof setEnable1v1Chat.ColorType
      /** 不允许切换到语音通话
       * @default false
       */
      disableSwitchVoice?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface ChatErrCode {
      /** 未开通双人通话 */
      [-20000]
      /** 当前设备不支持 */
      [-20001]
      /** 正在通话中 */
      [-20002]
      /** 其它小程序正在通话中 */
      [-20003]
      /** 内部系统错误 */
      [-30000]
      /** 微信缺失相机权限 */
      [-30001]
      /** 微信缺失录音权限  */
      [-30002]
      /** 小程序缺失录音权限 */
      [-30003]
      /** 小程序缺失相机权限 */
      [-30004]
      /** 当前已在房间内 */
      [-1]
      /** 录音设备被占用，可能是当前正在使用微信内语音通话或系统通话 */
      [-2]
      /** 加入会话期间退出（可能是用户主动退出，或者退后台、来电等原因），因此加入失败 */
      [-3]
      /** 系统错误 */
      [-1000]
    }
    interface FailCallbackResult extends TaroGeneral.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: keyof ChatErrCode
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 错误码 */
      errCode: number
      /** 调用结果 */
      errMsg: string
    }
    type Promised = FailCallbackResult | SuccessCallbackResult
  }

  namespace exitVoIPChat {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 更新实时语音静音设置
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.updateVoIPChatMuteConfig.html
     */
    updateVoIPChatMuteConfig(option: updateVoIPChatMuteConfig.Option): Promise<TaroGeneral.CallbackResult>
    /** 订阅视频画面成员
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.subscribeVoIPVideoMembers.html
     */
    subscribeVoIPVideoMembers(option: subscribeVoIPVideoMembers.Option): Promise<TaroGeneral.CallbackResult>
    /** 开启双人通话
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.setEnable1v1Chat.html
     */
    setEnable1v1Chat(option: setEnable1v1Chat.Option): Promise<TaroGeneral.CallbackResult>
    /** 监听实时语音通话成员视频状态变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.onVoIPVideoMembersChanged.html
     */
    onVoIPVideoMembersChanged(callback: onVoIPVideoMembersChanged.Callback): void
    /** 监听房间状态变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.onVoIPChatStateChanged.html
     */
    onVoIPChatStateChanged(callback: onVoIPChatStateChanged.Callback): void
    /** 监听实时语音通话成员通话状态变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.onVoIPChatSpeakersChanged.html
     */
    onVoIPChatSpeakersChanged(callback: onVoIPChatSpeakersChanged.Callback): void
    /** 监听实时语音通话成员在线状态变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.onVoIPChatMembersChanged.html
     */
    onVoIPChatMembersChanged(callback: onVoIPChatMembersChanged.Callback): void
    /** 监听被动断开实时语音通话事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.onVoIPChatInterrupted.html
     */
    onVoIPChatInterrupted(callback: onVoIPChatInterrupted.Callback): void
    /** 取消监听实时语音通话成员视频状态变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.offVoIPVideoMembersChanged.html
     */
    offVoIPVideoMembersChanged(callback: onVoIPVideoMembersChanged.Callback): void
    /** 取消监听房间状态变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.offVoIPChatStateChanged.html
     */
    offVoIPChatStateChanged(callback: onVoIPChatStateChanged.Callback): void
    /**
     * 取消监听实时语音通话成员通话状态变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.offVoIPChatSpeakersChanged.html
     */
    offVoIPChatSpeakersChanged(callback: onVoIPChatSpeakersChanged.Callback): void
    /** 取消监听实时语音通话成员在线状态变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.offVoIPChatMembersChanged.html
     */
    offVoIPChatMembersChanged(callback: onVoIPChatMembersChanged.Callback): void
    /** 取消监听被动断开实时语音通话事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.offVoIPChatInterrupted.html
     */
    offVoIPChatInterrupted(callback: onVoIPChatInterrupted.Callback): void
    /** 加入 (创建) 实时语音通话，更多信息可见 [实时语音指南](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/voip-chat.html)
     *
     * 调用前需要用户授权 `scope.record`，若房间类型为视频房间需要用户授权 `scope.camera`。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.joinVoIPChat.html
     */
    joinVoIPChat(option: joinVoIPChat.Option): Promise<joinVoIPChat.Promised>
    /**加入（创建）双人通话
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.join1v1Chat.html
     */
    join1v1Chat(option: join1v1Chat.Option): Promise<join1v1Chat.Promised>
    /** 退出（销毁）实时语音通话
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.exitVoIPChat.html
     */
    exitVoIPChat(option: exitVoIPChat.Option): Promise<TaroGeneral.CallbackResult>
  }
}

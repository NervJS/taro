declare namespace Taro {
  namespace stopBackgroundAudio {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /**
   * 停止播放音乐。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.stopBackgroundAudio()
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.stopBackgroundAudio.html
   */
  function stopBackgroundAudio(option?: stopBackgroundAudio.Option): void

  namespace seekBackgroundAudio {
    interface Option {
      /** 音乐位置，单位：秒 */
      position: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 控制音乐播放进度。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.seekBackgroundAudio({
   *   position: 30
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.seekBackgroundAudio.html
   */
  function seekBackgroundAudio(option: seekBackgroundAudio.Option): Promise<General.CallbackResult>

  namespace playBackgroundAudio {
    interface Option {
      /** 音乐链接，目前支持的格式有 m4a, aac, mp3, wav */
      dataUrl: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 封面URL */
      coverImgUrl?: string
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
      /** 音乐标题 */
      title?: string
    }
  }
  /** 使用后台播放器播放音乐，对于微信客户端来说，只能同时有一个后台音乐在播放。当用户离开小程序后，音乐将暂停播放；当用户点击“显示在聊天顶部”时，音乐不会暂停播放；当用户在其他小程序占用了音乐播放器，原有小程序内的音乐将停止播放。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.playBackgroundAudio({
   *   dataUrl: '',
   *   title: '',
   *   coverImgUrl: ''
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.playBackgroundAudio.html
   */
  function playBackgroundAudio(option: playBackgroundAudio.Option): Promise<General.CallbackResult>

  namespace pauseBackgroundAudio {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 暂停播放音乐。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.pauseBackgroundAudio()
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.pauseBackgroundAudio.html
   */
  function pauseBackgroundAudio(option?: pauseBackgroundAudio.Option): void

  /** 监听音乐停止。
   *
   * **bug & tip：**
   *
   * 1.  `bug`: `iOS` `6.3.30` Taro.seekBackgroundAudio 会有短暂延迟
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.onBackgroundAudioStop.html
   */
  function onBackgroundAudioStop(
    /** 音乐停止事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void

  /** 监听音乐播放。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.onBackgroundAudioPlay.html
   */
  function onBackgroundAudioPlay(
    /** 音乐播放事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void

  /** 监听音乐暂停。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.onBackgroundAudioPause.html
   */
  function onBackgroundAudioPause(
    /** 音乐暂停事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void

  namespace getBackgroundAudioPlayerState {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 选定音频的播放位置（单位：s），只有在音乐播放中时返回 */
      currentPosition: number
      /** 歌曲数据链接，只有在音乐播放中时返回 */
      dataUrl: string
      /** 音频的下载进度百分比，只有在音乐播放中时返回 */
      downloadPercent: number
      /** 选定音频的长度（单位：s），只有在音乐播放中时返回 */
      duration: number
      /** 播放状态 */
      status: keyof status
      /** 调用结果 */
      errMsg: string
    }
    interface status {
      /** 暂停中 */
      0
      /** 播放中 */
      1
      /** 没有音乐播放 */
      2
    }
  }
  /** 获取后台音乐播放状态。
   * **注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.getBackgroundAudioManager](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioManager.html) 接口**
   * @supported weapp
   * @example
   * ```tsx
   * Taro.getBackgroundAudioPlayerState({
   *   success: function (res) {
   *     var status = res.status
   *     var dataUrl = res.dataUrl
   *     var currentPosition = res.currentPosition
   *     var duration = res.duration
   *     var downloadPercent = res.downloadPercent
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioPlayerState.html
   */
  function getBackgroundAudioPlayerState(option?: getBackgroundAudioPlayerState.Option): Promise<getBackgroundAudioPlayerState.SuccessCallbackResult>

  /** 获取**全局唯一**的背景音频管理器。
   * 小程序切入后台，如果音频处于播放状态，可以继续播放。但是后台状态不能通过调用API操纵音频的播放状态。
   *
   * 从微信客户端6.7.2版本开始，若需要在小程序切后台后继续播放音频，需要在 [app.json](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html) 中配置 `requiredBackgroundModes` 属性。开发版和体验版上可以直接生效，正式版还需通过审核。
   * @supported weapp
   * @example
   * ```tsx
   * const backgroundAudioManager = Taro.getBackgroundAudioManager()
   * backgroundAudioManager.title = '此时此刻'
   * backgroundAudioManager.epname = '此时此刻'
   * backgroundAudioManager.singer = '许巍'
   * backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
   * backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46' // 设置了 src 之后会自动播放
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioManager.html
   */
  function getBackgroundAudioManager(): BackgroundAudioManager

  /** BackgroundAudioManager 实例，可通过 [Taro.getBackgroundAudioManager](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioManager.html) 获取。
   * @example
   * ```tsx
   * const backgroundAudioManager = Taro.getBackgroundAudioManager()
   * backgroundAudioManager.title = '此时此刻'
   * backgroundAudioManager.epname = '此时此刻'
   * backgroundAudioManager.singer = '许巍'
   * backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
   * // 设置了 src 之后会自动播放
   * backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/BackgroundAudioManager.html
   */
  interface BackgroundAudioManager {
    /** 音频已缓冲的时间，仅保证当前播放时间点到此时间点内容已缓冲。
     * @readonly
     */
    buffered: number
    /** 封面图 URL，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图。 */
    coverImgUrl: string
    /** 当前音频的播放位置（单位：s），只有在有合法 src 时返回。
     * @readonly
     */
    currentTime: number
    /** 当前音频的长度（单位：s），只有在有合法 src 时返回。
     * @readonly
     */
    duration: number
    /** 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。 */
    epname: string
    /** 当前是否暂停或停止。
     * @readonly
     */
    paused: boolean
    /** 音频协议。默认值为 'http'，设置 'hls' 可以支持播放 HLS 协议的直播音频。 */
    protocol: string
    /** 歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。 */
    singer: string
    /** 音频的数据源（[2.2.3](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 开始支持云文件ID）。默认为空字符串，**当设置了新的 src 时，会自动开始播放**，目前支持的格式有 m4a, aac, mp3, wav。 */
    src: string
    /** 音频开始播放的位置（单位：s）。 */
    startTime: number
    /** 音频标题，用于原生音频播放器音频标题（必填）。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值。 */
    title: string
    /** 页面链接，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。 */
    webUrl: string
    /** 播放 */
    play(): void
    /** 暂停 */
    pause(): void
    /** 停止 */
    stop(): void
    /** 跳转到指定位置，单位 s */
    seek(position: any): void
    /** 背景音频进入可以播放状态，但不保证后面可以流畅播放 */
    onCanplay(callback?: () => void): void
    /** 背景音频播放事件 */
    onPlay(callback?: () => void): void
    /** 背景音频暂停事件 */
    onPause(callback?: () => void): void
    /** 背景音频停止事件 */
    onStop(callback?: () => void): void
    /** 背景音频自然播放结束事件 */
    onEnded(callback?: () => void): void
    /** 背景音频播放进度更新事件 */
    onTimeUpdate(callback?: () => void): void
    /** 用户在系统音乐播放面板点击上一曲事件（iOS only） */
    onPrev(callback?: () => void): void
    /** 用户在系统音乐播放面板点击下一曲事件（iOS only） */
    onNext(callback?: () => void): void
    /** 背景音频播放错误事件 */
    onError(callback?: () => void): void
    /** 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发 */
    onWaiting(callback?: () => void): void
  }
}

import Taro from '../../index'

declare module '../../index' {
  namespace stopVoice {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace setInnerAudioOption {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 是否与其他音频混播，设置为 true 之后，不会终止其他应用或微信内的音乐 */
      mixWithOther?: boolean
      /** （仅在 iOS 生效）是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音 */
      obeyMuteSwitch?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace playVoice {
    interface Option {
      /** 需要播放的语音文件的文件路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 指定录音时长，到达指定的录音时长后会自动停止录音，单位：秒 */
      duration?: number
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace pauseVoice {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getAvailableAudioSources {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 支持的音频输入源列表，可在 [RecorderManager.start()](/docs/apis/media/recorder/RecorderManager#start)用。返回值定义参考 https://developer.android.com/reference/kotlin/android/media/MediaRecorder.AudioSource */
      audioSources: Array<keyof audioSources>
      /** 调用结果 */
      errMsg: string
    }
    /** 支持的音频输入源 */
    interface audioSources {
      /** 自动设置，默认使用手机麦克风，插上耳麦后自动切换使用耳机麦克风，所有平台适用 */
      'auto'
      /** 手机麦克风，仅限 iOS */
      'buildInMic'
      /** 耳机麦克风，仅限 iOS */
      'headsetMic'
      /** 麦克风（没插耳麦时是手机麦克风，插耳麦时是耳机麦克风），仅限 Android */
      'mic'
      /** 同 mic，适用于录制音视频内容，仅限 Android */
      'camcorder'
      /** 同 mic，适用于实时沟通，仅限 Android */
      'voice_communication'
      /** 同 mic，适用于语音识别，仅限 Android */
      'voice_recognition'
    }
  }

  /** `AudioContext` 实例，可通过 `Taro.createAudioContext` 获取。
   * `AudioContext` 通过 `id` 跟一个 `audio` 组件绑定，操作对应的 audio 组件。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.html
   */
  interface AudioContext {
    /** 暂停音频。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.pause.html
     */
    pause(): void
    /** 播放音频。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.play.html
     */
    play(): void
    /** 跳转到指定位置。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.seek.html
     */
    seek(
      /** 跳转位置，单位 s */
      position: number,
    ): void
    /** 设置音频地址
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.setSrc.html
     */
    setSrc(
      /** 音频地址 */
      src: string,
    ): void
  }
  /** InnerAudioContext 实例，可通过 Taro.createInnerAudioContext 接口获取实例。
   *
   * **支持格式**
   *
   * | 格式 | iOS  | Android |
   * | ---- | ---- | ------- |
   * | flac | x    | √       |
   * | m4a  | √    | √       |
   * | ogg  | x    | √       |
   * | ape  | x    | √       |
   * | amr  | x    | √       |
   * | wma  | x    | √       |
   * | wav  | √    | √       |
   * | mp3  | √    | √       |
   * | mp4  | x    | √       |
   * | aac  | √    | √       |
   * | aiff | √    | x       |
   * | caf  | √    | x       |
   * @example
   * ```tsx
   * const innerAudioContext = Taro.createInnerAudioContext()
   * innerAudioContext.autoplay = true
   * innerAudioContext.src = 'https://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
   * innerAudioContext.onPlay(() => {
   *   console.log('开始播放')
   * })
   * innerAudioContext.onError((res) => {
   *   console.log(res.errMsg)
   *   console.log(res.errCode)
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/InnerAudioContext.html
   */
  interface InnerAudioContext {
    /** 音频资源的地址，用于直接播放。 */
    src: string
    /** 开始播放的位置（单位：s）
     * @default 0
     */
    startTime: number
    /** 是否自动开始播放
     * @default false
     */
    autoplay: boolean
    /** 是否循环播放
     * @default false
     */
    loop: boolean
    /** 是否遵循系统静音开关。当此参数为 `false` 时，即使用户打开了静音开关，也能继续发出声音。从 2.3.0 版本开始此参数不生效，使用 [Taro.setInnerAudioOption](/docs/apis/media/audio/setInnerAudioOption) 接口统一设置。
     * @default true
     */
    obeyMuteSwitch: boolean
    /** 音量。范围 0~1。
     * @default 1
     */
    volume: number
    /** 播放速度。范围 0.5-2.0。
     * @default 1
     */
    playbackRate: number
    /** 当前音频的长度（单位 s）。只有在当前有合法的 src 时返回
     * @readonly
     */
    duration: number
    /** 当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位
     * @readonly
     */
    currentTime: number
    /** 当前是是否暂停或停止状态
     * @readonly
     */
    paused: boolean
    /** 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲
     * @readonly
     */
    buffered: number
    /** origin: 发送完整的 referrer; no-referrer: 不发送 */
    referrerPolicy?: 'origin' | 'no-referrer' | string
    /** 播放
     * @supported weapp, h5, rn
     */
    play(): void
    /** 暂停
     * @supported weapp, h5, rn
     */
    pause(): void
    /** 停止
     * @supported weapp, h5, rn
     */
    stop(): void
    /** 跳转到指定位置，单位 s
     * @supported weapp, h5, rn
     */
    seek(position: number): void
    /** 销毁当前实例
     * @supported weapp, h5
     */
    destroy(): void
    /** 音频进入可以播放状态，但不保证后面可以流畅播放
     * @supported weapp, h5, rn
     */
    onCanplay(callback?: () => void): void
    /** 音频播放事件
     * @supported weapp, h5, rn
     */
    onPlay(callback?: () => void): void
    /** 音频暂停事件
     * @supported weapp, h5, rn
     */
    onPause(callback?: () => void): void
    /** 音频停止事件
     * @supported weapp, h5, rn
     */
    onStop(callback?: () => void): void
    /** 音频自然播放结束事件
     * @supported weapp, h5, rn
     */
    onEnded(callback?: () => void): void
    /** 音频播放进度更新事件
     * @supported weapp, h5, rn
     */
    onTimeUpdate(callback?: () => void): void
    /** 音频播放错误事件
     * @supported weapp, h5, rn
     */
    onError(callback?: (res: InnerAudioContext.onErrorDetail) => void): void
    /** 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
     * @supported weapp, h5, rn
     */
    onWaiting(callback?: () => void): void
    /** 音频进行 seek 操作事件
     * @supported weapp, h5, rn
     */
    onSeeking(callback?: () => void): void
    /** 音频完成 seek 操作事件
     * @supported weapp, h5, rn
     */
    onSeeked(callback?: () => void): void
    /** 取消监听 onCanplay 事件
     * @supported weapp, h5, rn
     */
    offCanplay(callback?: () => void): void
    /** 取消监听 onPlay 事件
     * @supported weapp, h5, rn
     */
    offPlay(callback?: () => void): void
    /** 取消监听 onPause 事件
     * @supported weapp, h5, rn
     */
    offPause(callback?: () => void): void
    /** 取消监听 onStop 事件
     * @supported weapp, h5, rn
     */
    offStop(callback?: () => void): void
    /** 取消监听 onEnded 事件
     * @supported weapp, h5, rn
     */
    offEnded(callback?: () => void): void
    /** 取消监听 onTimeUpdate 事件
     * @supported weapp, h5, rn
     */
    offTimeUpdate(callback?: () => void): void
    /** 取消监听 onError 事件
     * @supported weapp, h5, rn
     */
    offError(callback?: () => void): void
    /** 取消监听 onWaiting 事件
     * @supported weapp, h5, rn
     */
    offWaiting(callback?: () => void): void
    /** 取消监听 onSeeking 事件
     * @supported weapp, h5, rn
     */
    offSeeking(callback?: () => void): void
    /** 取消监听 onSeeked 事件
     * @supported weapp, h5, rn
     */
    offSeeked(callback?: () => void): void
  }

  namespace InnerAudioContext {
    interface onErrorDetail extends TaroGeneral.CallbackResult {
      /** 错误码 */
      errCode: number
      /** 错误信息 */
      errMsg: string
    }

    interface onErrorDetailErrCode {
      /** 系统错误 */
      10001
      /** 网络错误 */
      10002
      /** 文件错误 */
      10003
      /** 格式错误 */
      10004
      /** 未知错误 */
      '-1'
    }
  }

  interface MediaAudioPlayer {}

  interface WebAudioContext {}

  interface TaroStatic {
    /** 结束播放语音。
     * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](/docs/apis/media/audio/createInnerAudioContext) 接口**
     * @supported weapp
     * @example
     * ```tsx
     * Taro.startRecord({
     *   success: function (res) {
     *     const filePath = res.tempFilePath
     *     Taro.playVoice({ filePath })
     *
     *     setTimeout(Taro.stopVoice, 5000)
     *   }
     * })
     * ```
     * @example
     * ```tsx
     * Taro.startRecord(params).then(res => {
     *   const filePath = res.tempFilePath
     *   Taro.playVoice({ filePath })
     *
     *   setTimeout(Taro.stopVoice, 5000)
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.stopVoice.html
     */
    stopVoice(option?: stopVoice.Option): void

    /** 设置 [InnerAudioContext](/docs/apis/media/audio/InnerAudioContext)项。设置之后对当前小程序全局生效。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.setInnerAudioOption.html
     */
    setInnerAudioOption(option: setInnerAudioOption.Option): Promise<TaroGeneral.CallbackResult>

    /** 开始播放语音。同时只允许一个语音文件正在播放，如果前一个语音文件还没播放完，将中断前一个语音播放。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.startRecord({
     *   success: function (res) {
     *     const tempFilePath = res.tempFilePath
     *     Taro.playVoice({
     *       filePath: tempFilePath,
     *       complete: function () { }
     *     })
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.playVoice.html
     */
    playVoice(option: playVoice.Option): Promise<TaroGeneral.CallbackResult>

    /** 暂停正在播放的语音。再次调用 [Taro.playVoice](/docs/apis/media/audio/stopVoice)。
     * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](/docs/apis/media/audio/createInnerAudioContext) 接口**
     * @supported weapp
     * @example
     * ```tsx
     * Taro.startRecord({
     *   success: function (res) {
     *     var tempFilePath = res.tempFilePath
     *       Taro.playVoice({
     *       filePath: tempFilePath
     *     })
     *     setTimeout(function() {
     *         //暂停播放
     *       Taro.pauseVoice()
     *     }, 5000)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.pauseVoice.html
     */
    pauseVoice(option?: pauseVoice.Option): void

    /** 获取当前支持的音频输入源
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.getAvailableAudioSources.html
     */
    getAvailableAudioSources(option?: getAvailableAudioSources.Option): Promise<getAvailableAudioSources.SuccessCallbackResult>

    /** 创建 WebAudio 上下文。
     * @supported weapp
     * @example
     * 一个简单的播放demo
     *
     * ```tsx
     * const audioCtx = Taro.createWebAudioContext()
     * 
     * const loadAudio = (url) => {
     *   return new Promise((resolve) => {
     *     Taro.request({
     *       url,
     *       responseType: 'arraybuffer',
     *       success: res => {
     *         console.log('res.data', res.data)
     *         audioCtx.decodeAudioData(res.data, buffer => {
     *           resolve(buffer)
     *         }, err => {
     *           console.error('decodeAudioData fail', err)
     *           reject()
     *         })
     *       },
     *       fail: res => {
     *         console.error('request fail', res)
     *         reject()
     *       }
     *     })
     *   })
     * }
     * 
     * const play = () => {
     *   loadAudio('xxx-test.mp3').then(buffer => {
     *     const source = audioCtx.createBufferSource()
     *     source.buffer = buffer
     *     source.connect(audioCtx.destination)
     *     source.start()
     *   }).catch(() => {
     *     console.log('fail')
     *   })
     * }
     * 
     * play()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createWebAudioContext.html
     */
    createWebAudioContext(): WebAudioContext

    /** 创建媒体音频播放器对象 [MediaAudioPlayer](./MediaAudioPlayer) 对象，可用于播放视频解码器 [VideoDecoder](/docs/apis/media/video-decoder/VideoDecoder) 输出的音频
     * 
     * **注意事项**
     * - iOS 7.0.15 mediaAudioPlayer 播放网络视频资源会出现音频卡顿，本地视频没有这个问题，将下一个客户端版本修复。
     * @supported weapp
     * @example
     * ```tsx
     * // 创建视频解码器，具体参数见 createVideoDecoder 文档
     * const videoDecoder = Taro.createVideoDecoder()
     * // 创建媒体音频播放器
     * const mediaAudioPlayer = Taro.createMediaAudioPlayer()
     * // 启动视频解码器
     * videoDecoder.start()
     * // 启动播放器
     * mediaAudioPlayer.start().then(() => {
     *   // 添加播放器音频来源
     *   mediaAudioPlayer.addAudioSource(videoDecoder).then(res => {
     *     videoDecoder.getFrameData() // 建议在 requestAnimationFrame 里获取每一帧视频数据
     *     console.log(res)
     *   })
     *
     *   // 移除播放器音频来源
     *   mediaAudioPlayer.removeAudioSource(videoDecoder).then()
     *   // 停止播放器
     *   mediaAudioPlayer.stop().then()
     *   // 销毁播放器
     *   mediaAudioPlayer.destroy().then()
     *   // 设置播放器音量
     *   mediaAudioPlayer.volume = 0.5
     * })
     *```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createMediaAudioPlayer.html
     */
    createMediaAudioPlayer(): MediaAudioPlayer

    /** 创建内部 audio 上下文 InnerAudioContext 对象。
     * @supported weapp, h5, rn
     * @example
     * ```tsx
     * const innerAudioContext = Taro.createInnerAudioContext()
     * innerAudioContext.autoplay = true
     * innerAudioContext.src = 'https://storage.360buyimg.com/jdrd-blog/27.mp3'
     * innerAudioContext.onPlay(() => {
     *   console.log('开始播放')
     * })
     * innerAudioContext.onError((res) => {
     *   console.log(res.errMsg)
     *   console.log(res.errCode)
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html
     */
    createInnerAudioContext(): InnerAudioContext

    /** 创建 audio 上下文 AudioContext 对象。
     * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](/docs/apis/media/audio/createInnerAudioContext) 接口**
     * @supported weapp
     * @example
     * ```tsx
     * const audioCtx = Taro.createAudioContext('myAudio')
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createAudioContext.html
     */
    createAudioContext(
      /** [audio](/docs/components/audio) 组件的 id */
      id: string,
      /** 在自定义组件下，当前组件实例的this，以操作组件内 [audio](/docs/components/audio) 组件 */
      component?: TaroGeneral.IAnyObject,
    ): AudioContext
  }
}

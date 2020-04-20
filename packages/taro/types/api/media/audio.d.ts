declare namespace Taro {
  /**
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**
   * 结束播放语音。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startRecord({
     success: function(res) {
       var tempFilePath = res.tempFilePath
       Taro.playVoice({
         filePath:tempFilePath
       })
             setTimeout(function(){
         Taro.stopVoice()
       }, 5000)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.stopVoice.html
   */
  function stopVoice(): void

  namespace setInnerAudioOption {
    type Param = {
      /**
       * 是否与其他音频混播，设置为 true 之后，不会终止其他应用或微信内的音乐
       */
      mixWithOther?: boolean
      /**
       * （仅在 iOS 生效）是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音
       */
      obeyMuteSwitch?: boolean
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * @since 2.3.0
   *
   * 设置 InnerAudioContext 的播放选项。设置之后对当前小程序全局生效。
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.setInnerAudioOption.html
   */
  function setInnerAudioOption(OBJECT: setInnerAudioOption.Param): Promise<any>

  namespace playVoice {
    type Param = {
      /**
       * 需要播放的语音文件的文件路径
       */
      filePath: string
      /**
       * 指定录音时长，到达指定的录音时长后会自动停止录音，单位：秒，默认值：60
       *
       * @since 1.6.0
       */
      duration?: number
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**
   *
   * 开始播放语音，同时只允许一个语音文件正在播放，如果前一个语音文件还没播放完，将中断前一个语音播放。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startRecord({
     success: function(res) {
       var tempFilePath = res.tempFilePath
       Taro.playVoice({
         filePath: tempFilePath,
         complete: function(){
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.playVoice.html
   */
  function playVoice(OBJECT: playVoice.Param): Promise<any>

  /**
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**
   * 暂停正在播放的语音。再次调用Taro.playVoice播放同一个文件时，会从暂停处开始播放。如果想从头开始播放，需要先调用 Taro.stopVoice。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startRecord({
     success: function(res) {
       var tempFilePath = res.tempFilePath
         Taro.playVoice({
         filePath: tempFilePath
       })
             setTimeout(function() {
           //暂停播放
         Taro.pauseVoice()
       }, 5000)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.pauseVoice.html
   */
  function pauseVoice(): void

  const enum audioSourcesTypes {
    /**
     * 自动设置，默认使用手机麦克风，插上耳麦后自动切换使用耳机麦克风，所有平台适用
     */
    auto = 'auto',
    /**
     * 手机麦克风，仅限 iOS
     */
    buildInMic = 'buildInMic',
    /**
     * 耳机麦克风，仅限 iOS
     */
    headsetMic = 'headsetMic',
    /**
     * 麦克风（没插耳麦时是手机麦克风，插耳麦时是耳机麦克风），仅限 Android
     */
    mic = 'mic',
    /**
     * 同 mic，适用于录制音视频内容，仅限 Android
     */
    camcorder = 'camcorder',
    /**
     * 同 mic，适用于实时沟通，仅限 Android
     */
    voice_communication = 'voice_communication',
    /**
     * 同 mic，适用于语音识别，仅限 Android
     */
    voice_recognition = 'voice_recognition'
  }
  namespace getAvailableAudioSources {
    type Param = {
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: Result) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any

    type Result = {
      /**
       * 支持的音频输入源列表，可在 RecorderManager.start() 接口中使用。返回值定义参考 https://developer.android.com/reference/kotlin/android/media/MediaRecorder.AudioSourc
       */
      audioSources: audioSourcesTypes[]
    }
  }
  /**
   * @since 2.1.0
   * 获取当前支持的音频输入源。
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.getAvailableAudioSources.html
   */
  function getAvailableAudioSources(OBJECT: getAvailableAudioSources.Param): Promise<any>

  /**
   * @since 1.6.0
   *
   * 创建并返回内部 audio 上下文 `innerAudioContext` 对象。_本接口是 `Taro.createAudioContext` 升级版。_
   *
   * **errCode 说明：**
   *
   *   errCode   |  说明
   * ------------|---------
   *   10001     | 系统错误
   *   10002     | 网络错误
   *   10003     | 文件错误
   *   10004     | 格式错误
   *   -1        | 未知错误
   *
   * **示例代码：**
   *
   ```javascript
   const innerAudioContext = Taro.createInnerAudioContext()
   innerAudioContext.autoplay = true
   innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
   innerAudioContext.onPlay(() => {
       console.log('开始播放')
   })
   innerAudioContext.onError((res) => {
       console.log(res.errMsg)
       console.log(res.errCode)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html
   */
  function createInnerAudioContext(): InnerAudioContext
  class InnerAudioContext {
    /**
     * 音频的数据链接，用于直接播放。
     */
    src: string
    /**
     * 开始播放的位置（单位：s），默认 0
     */
    startTime: number
    /**
     * 是否自动开始播放，默认 false
     */
    autoplay: boolean
    /**
     * 是否循环播放，默认 false
     */
    loop: boolean
    /**
     * 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音，默认值 true
     */
    obeyMuteSwitch: boolean
    /**
     * 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
     *
     * @readonly
     */
    duration: number
    /**
     * 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回，时间不取整，保留小数点后 6 位
     *
     * @readonly
     */
    currentTime: number
    /**
     * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
     *
     * @readonly
     */
    paused: boolean
    /**
     * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲。
     *
     * @readonly
     */
    buffered: number
    /**
     * 音量。范围 0~1。
     *
     * @since 1.9.90
     */
    volume: number
    /**
     * 播放
     */
    play(): void
    /**
     * 暂停
     */
    pause(): void
    /**
     * 停止
     */
    stop(): void
    /**
     * 跳转到指定位置，单位 s
     */
    seek(position: number): void
    /**
     * 销毁当前实例
     */
    destroy(): void
    /**
     * 音频进入可以播放状态，但不保证后面可以流畅播放
     */
    onCanplay(callback?: () => void): void
    /**
     * 音频播放事件
     */
    onPlay(callback?: () => void): void
    /**
     * 音频暂停事件
     */
    onPause(callback?: () => void): void
    /**
     * 音频停止事件
     */
    onStop(callback?: () => void): void
    /**
     * 音频自然播放结束事件
     */
    onEnded(callback?: () => void): void
    /**
     * 音频播放进度更新事件
     */
    onTimeUpdate(callback?: () => void): void
    /**
     * 音频播放错误事件
     */
    onError(callback?: () => void): void
    /**
     * 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
     */
    onWaiting(callback?: () => void): void
    /**
     * 音频进行 seek 操作事件
     */
    onSeeking(callback?: () => void): void
    /**
     * 音频完成 seek 操作事件
     */
    onSeeked(callback?: () => void): void
    /**
     * 取消监听 onCanplay 事件
     *
     * @since 1.9.0
     */
    offCanplay(callback?: () => void): void
    /**
     * 取消监听 onPlay 事件
     *
     * @since 1.9.0
     */
    offPlay(callback?: () => void): void
    /**
     * 取消监听 onPause 事件
     *
     * @since 1.9.0
     */
    offPause(callback?: () => void): void
    /**
     * 取消监听 onStop 事件
     *
     * @since 1.9.0
     */
    offStop(callback?: () => void): void
    /**
     * 取消监听 onEnded 事件
     *
     * @since 1.9.0
     */
    offEnded(callback?: () => void): void
    /**
     * 取消监听 onTimeUpdate 事件
     *
     * @since 1.9.0
     */
    offTimeUpdate(callback?: () => void): void
    /**
     * 取消监听 onError 事件
     *
     * @since 1.9.0
     */
    offError(callback?: () => void): void
    /**
     * 取消监听 onWaiting 事件
     *
     * @since 1.9.0
     */
    offWaiting(callback?: () => void): void
    /**
     * 取消监听 onSeeking 事件
     *
     * @since 1.9.0
     */
    offSeeking(callback?: () => void): void
    /**
     * 取消监听 onSeeked 事件
     *
     * @since 1.9.0
     */
    offSeeked(callback?: () => void): void
  }

  /**
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**
   *
   * 创建并返回 audio 上下文 `audioContext` 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 `<audio/>` 组件
   *
   * **audioContext：**
   *
   * `audioContext` 通过 audioId 跟一个 `<audio/>` 组件绑定，通过它可以操作对应的 `<audio/>` 组件。
   *
   * **示例代码：**
   *
   ```html
   <!-- audio.wxml -->
   <audio  src="{{src}}" id="myAudio" ></audio>
         <button type="primary" bindtap="audioPlay">播放</button>
   <button type="primary" bindtap="audioPause">暂停</button>
   <button type="primary" bindtap="audio14">设置当前播放时间为14秒</button>
   <button type="primary" bindtap="audioStart">回到开头</button>
   ```
   *
   * **示例代码：**
   *
   ```javascript
   // audio.js
   Page({
     onReady: function (e) {
       // 使用 Taro.createAudioContext 获取 audio 上下文 context
       this.audioCtx = Taro.createAudioContext('myAudio')
       this.audioCtx.setSrc('http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46')
       this.audioCtx.play()
     },
     data: {
       src: ''
     },
     audioPlay: function () {
       this.audioCtx.play()
     },
     audioPause: function () {
       this.audioCtx.pause()
     },
     audio14: function () {
       this.audioCtx.seek(14)
     },
     audioStart: function () {
       this.audioCtx.seek(0)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createAudioContext.html
   */
  function createAudioContext(audioId: string, instance?: any): AudioContext
  class AudioContext {
    /**
     * 音频的地址
     */
    setSrc(src: string): void
    /**
     * 播放
     */
    play(): void
    /**
     * 暂停
     */
    pause(): void
    /**
     * 跳转到指定位置，单位 s
     */
    seek(position: number): void
  }
}

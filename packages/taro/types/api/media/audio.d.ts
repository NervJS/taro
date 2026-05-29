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

  /** AudioBuffer 接口表示存在内存里的一段短小的音频资源，利用 [WebAudioContext.decodeAudioData](./WebAudioContext#decodeaudiodata) 方法从一个音频文件构建，或者利用 [AudioContext.createBuffer](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/(AudioContext.createBuffer).html) 从原始数据构建。把音频放入 AudioBuffer 后，可以传入到一个 AudioBufferSourceNode 进行播放。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioBuffer.html
   */
  interface AudioBuffer {
    /** 存储在缓存区的PCM数据的采样率（单位为sample/s) */
    sampleRate: number

    /** 返回存储在缓存区的PCM数据的采样帧率 */
    length: number

    /** 返回存储在缓存区的PCM数据的时长（单位为秒） */
    duration: number

    /** 储存在缓存区的PCM数据的通道数 */
    numberOfChannels: number

    /** 返回一个 Float32Array，包含了带有频道的PCM数据，由频道参数定义（有0代表第一个频道）
     * @supported weapp
     * @example
     * ```tsx
     * const audioCtx = Taro.createWebAudioContext()
     * const myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);
     * const nowBuffering = myArrayBuffer.getChannelData(channel);
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioBuffer.getChannelData.html
     */
    getChannelData(channel: number): Float32Array

    /** 从 AudioBuffer 的指定频道复制到数组终端。
     * @supported weapp
     * @example
     * ```tsx
     * const audioCtx = Taro.createWebAudioContext()
     * const audioBuffer = audioCtx.createFromAudioFile({
     *   filePath:'/pages/res/bgm.mp3', // 静态资源
     *   mixToMono:true,
     *   sampleRate:44100
     * });
     * const channels = audioBuffer.numberOfChannels
     * const anotherArray = new Float32Array(frameCount);
     * const rate = audioBuffer.sampleRate
     * const startOffSet = 0
     * const endOffset = rate * 3;
     * const newAudioBuffer = audioCtx.createBuffer(channels,endOffset - startOffset,rate)
     * const offset = 0
     *
     * for (let channel = 0; channel < channels; channel++) {
     *   audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
     *   newAudioBuffer.copyToChannel(anotherArray, channel, offset);
     * }
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioBuffer.copyFromChannel.html
     */
    copyFromChannel(): void

    /** 从指定数组复制样本到 audioBuffer 的特定通道
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioBuffer.copyToChannel.html
     */
    copyToChannel(
      /** 需要复制的源数组 */
      source: Float32Array,
      /** 需要复制到的目的通道号 */
      channelNumber: number,
      /** 复制偏移数据量 */
      startInChannel: number
    ): void
  }

  /** `AudioContext` 实例，可通过 `Taro.createAudioContext` 获取。
   *
   * `AudioContext` 通过 `id` 跟一个 `audio` 组件绑定，操作对应的 audio 组件。
   * @supported weapp, harmony_hybrid
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.html
   */
  interface AudioContext {
    /** 暂停音频。
     * @supported weapp, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/AudioContext.pause.html
     */
    pause(): void
    /** 播放音频。
     * @supported weapp, harmony_hybrid
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
  /** InnerAudioContext 实例，可通过 [Taro.createInnerAudioContext](./createInnerAudioContext) 接口获取实例。
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
     * @supported weapp, h5, rn, harmony_hybrid
     */
    play(): void
    /** 暂停
     * @supported weapp, h5, rn
     */
    pause(): void
    /** 停止
     * @supported weapp, h5, rn, harmony_hybrid
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
    onCanplay(callback?: InnerAudioContext.OnCanplayCallback): void
    /** 音频播放事件
     * @supported weapp, h5, rn, harmony_hybrid
     */
    onPlay(callback?: InnerAudioContext.OnPlayCallback): void
    /** 音频暂停事件
     * @supported weapp, h5, rn
     */
    onPause(callback?: InnerAudioContext.OnPauseCallback): void
    /** 音频停止事件
     * @supported weapp, h5, rn, harmony_hybrid
     */
    onStop(callback?: InnerAudioContext.OnStopCallback): void
    /** 音频自然播放结束事件
     * @supported weapp, h5, rn, harmony_hybrid
     */
    onEnded(callback?: InnerAudioContext.OnEndedCallback): void
    /** 音频播放进度更新事件
     * @supported weapp, h5, rn
     */
    onTimeUpdate(callback?: InnerAudioContext.OnTimeUpdateCallback): void
    /** 音频播放错误事件
     * @supported weapp, h5, rn, harmony_hybrid
     */
    onError(callback?: InnerAudioContext.OnErrorCallback): void
    /** 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
     * @supported weapp, h5, rn
     */
    onWaiting(callback?: InnerAudioContext.OnWaitingCallback): void
    /** 音频进行 seek 操作事件
     * @supported weapp, h5, rn
     */
    onSeeking(callback?: InnerAudioContext.OnSeekingCallback): void
    /** 音频完成 seek 操作事件
     * @supported weapp, h5, rn
     */
    onSeeked(callback?: InnerAudioContext.OnSeekedCallback): void
    /** 取消监听 canplay 事件
     * @supported weapp, h5, rn
     */
    offCanplay(callback?: InnerAudioContext.OnCanplayCallback): void
    /** 取消监听 play 事件
     * @supported weapp, h5, rn
     */
    offPlay(callback?: InnerAudioContext.OnPlayCallback): void
    /** 取消监听 pause 事件
     * @supported weapp, h5, rn
     */
    offPause(callback?: InnerAudioContext.OnPauseCallback): void
    /** 取消监听 stop 事件
     * @supported weapp, h5, rn
     */
    offStop(callback?: InnerAudioContext.OnStopCallback): void
    /** 取消监听 ended 事件
     * @supported weapp, h5, rn
     */
    offEnded(callback?: InnerAudioContext.OnEndedCallback): void
    /** 取消监听 timeUpdate 事件
     * @supported weapp, h5, rn
     */
    offTimeUpdate(callback?: InnerAudioContext.OnTimeUpdateCallback): void
    /** 取消监听 error 事件
     * @supported weapp, h5, rn
     */
    offError(callback?: InnerAudioContext.OnErrorCallback): void
    /** 取消监听 waiting 事件
     * @supported weapp, h5, rn
     */
    offWaiting(callback?: InnerAudioContext.OnWaitingCallback): void
    /** 取消监听 seeking 事件
     * @supported weapp, h5, rn
     */
    offSeeking(callback?: InnerAudioContext.OnSeekingCallback): void
    /** 取消监听 seeked 事件
     * @supported weapp, h5, rn
     */
    offSeeked(callback?: InnerAudioContext.OnSeekedCallback): void
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
    /** 音频进入可以播放状态事件的回调函数 */
    type OnCanplayCallback = (res: Partial<TaroGeneral.CallbackResult>) => void
    /** 音频播放事件的回调函数 */
    type OnPlayCallback = (res: Partial<TaroGeneral.CallbackResult>) => void
    /** 音频暂停事件的回调函数 */
    type OnPauseCallback = (res: Partial<TaroGeneral.CallbackResult>) => void
    /** 音频停止事件的回调函数 */
    type OnStopCallback = (res: Partial<TaroGeneral.CallbackResult>) => void
    /** 音频自然播放结束事件的回调函数 */
    type OnEndedCallback = (res: Partial<TaroGeneral.CallbackResult>) => void
    /** 音频播放进度更新事件的回调函数 */
    type OnTimeUpdateCallback = (res: Partial<TaroGeneral.CallbackResult>) => void
    /** 音频播放错误事件的回调函数 */
    type OnErrorCallback = (res: onErrorDetail) => void
    /** 音频加载中事件的回调函数 */
    type OnWaitingCallback = (res: Partial<TaroGeneral.CallbackResult>) => void
    /** 音频进行 seek 操作事件的回调函数 */
    type OnSeekingCallback = (res: Partial<TaroGeneral.CallbackResult>) => void
    /** 音频完成 seek 操作事件的回调函数 */
    type OnSeekedCallback = (res: Partial<TaroGeneral.CallbackResult>) => void
  }

  /** MediaAudioPlayer 实例，可通过 [Taro.createMediaAudioPlayer](./createMediaAudioPlayer) 接口获取实例。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.html
   */
  interface MediaAudioPlayer {
    /** 音量。范围 0~1
     * @default 1
     */
    volume: number

    /** 启动播放器
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.start.html
     */
    start(): Promise<void>

    /** 添加音频源
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.addAudioSource.html
     */
    addAudioSource(
      /** 视频解码器实例。作为音频源添加到音频播放器中 */
      source: VideoDecoder
    ): Promise<void>

    /** 移除音频源
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.removeAudioSource.html
     */
    removeAudioSource(
      /** 视频解码器实例 */
      source: VideoDecoder
    ): Promise<void>

    /** 停止播放器
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.stop.html
     */
    stop(): Promise<void>

    /** 销毁播放器
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/MediaAudioPlayer.destroy.html
     */
    destroy(): Promise<void>
  }

  /** WebAudioContext 实例，通过 [Taro.createWebAudioContext](./createWebAudioContext) 接口获取该实例。
   * @supported weapp
   * @example
   * 监听状态
   *
   * ```tsx
   * const audioCtx = Taro.createWebAudioContext()
   * audioCtx.onstatechange = () => {
   *   console.log(ctx.state)
   * }
   * setTimeout(audioCtx.suspend, 1000)
   * setTimeout(audioCtx.resume, 2000)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.html
   */
  interface WebAudioContext {
    /** 当前 WebAudio 上下文的状态。
     *
     * 可能的值如下：suspended（暂停）、running（正在运行）、closed（已关闭）。
     * 需要注意的是，不要在 audioContext close 后再访问 state 属性
     */
    state: string

    /** 可写属性，开发者可以对该属性设置一个监听函数，当 WebAudio 状态改变的时候，会触发开发者设置的监听函数。 */
    onstatechange: () => void

    /** 获取当前上下文的时间戳。 */
    currentTime: number

    /** 当前上下文的最终目标节点，一般是音频渲染设备。 */
    destination: WebAudioContextNode

    /** 空间音频监听器。 */
    listener: AudioListener

    /** 采样率，通常在 8000-96000 之间，通常 44100hz 的采样率最为常见。 */
    sampleRate: number

    /** 关闭WebAudioContext
     *
     * **注意事项**
     * 同步关闭对应的 WebAudio 上下文。close 后会立即释放当前上下文的资源，**不要在 close 后再次访问 state 属性**。
     * @supported weapp
     * @example
     * ```tsx
     * const audioCtx = Taro.createWebAudioContext()
     * audioCtx.close().then(() => {
     *   console.log(audioCtx.state) // bad case：不应该在close后再访问state
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.close.html
     */
    close(): Promise<void>

    /** 同步恢复已经被暂停的 WebAudioContext 上下文
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.resume.html
     */
    resume(): Promise<void>

    /** 同步暂停 WebAudioContext 上下文
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.suspend.html
     */
    suspend(): Promise<void>

    /** 创建一个 IIRFilterNode
     * @supported weapp
     * @example
     * ```tsx
     * let lowPassCoefs = [
     *   {
     *     frequency: 200,
     *     feedforward: [0.00020298, 0.0004059599, 0.00020298],
     *     feedback: [1.0126964558, -1.9991880801, 0.9873035442]
     *   },
     *   {
     *     frequency: 500,
     *     feedforward: [0.0012681742, 0.0025363483, 0.0012681742],
     *     feedback: [1.0317185917, -1.9949273033, 0.9682814083]
     *   },
     *   {
     *     frequency: 1000,
     *     feedforward: [0.0050662636, 0.0101325272, 0.0050662636],
     *     feedback: [1.0632762845, -1.9797349456, 0.9367237155]
     *   },
     *   {
     *     frequency: 5000,
     *     feedforward: [0.1215955842, 0.2431911684, 0.1215955842],
     *     feedback: [1.2912769759, -1.5136176632, 0.7087230241]
     *   }
     * ]
     *
     * const feedForward = lowPassCoefs[filterNumber].feedforward
     * const feedBack = lowPassCoefs[filterNumber].feedback
     * const iirFilter = audioContext.createIIRFilter(feedForward, feedBack)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createIIRFilter.html
     */
    createIIRFilter(
      /** 一个浮点值数组，指定IIR滤波器传递函数的前馈(分子)系数。 */
      feedforward: number[],
      /** 一个浮点值数组，指定IIR滤波器传递函数的反馈(分母)系数。 */
      feedback: number[]
    ): IIRFilterNode

    /** 创建一个 WaveShaperNode
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createWaveShaper.html
     */
    createWaveShaper(): WaveShaperNode

    /** 创建一个 ConstantSourceNode
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createConstantSource.html
     */
    createConstantSource(): ConstantSourceNode

    /** 创建一个 OscillatorNode
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createOscillator.html
     */
    createOscillator(): OscillatorNode

    /** 创建一个 GainNode
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createGain.html
     */
    createGain(): GainNode

    /** 创建一个 PeriodicWaveNode
     *
     * **注意**
     * `real` 和 `imag` 数组必须拥有一样的长度，否则抛出错误
     *
     * ```tsx
     * const real = new Float32Array(2)
     * const imag = new Float32Array(2)
     * real[0] = 0
     * imag[0] = 0
     * real[1] = 1
     * imag[1] = 0
     *
     * const waveNode = audioContext.createPeriodicWave(real, imag, {disableNormalization: true})
     * ```
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createPeriodicWave.html
     */
    createPeriodicWave(
      /** 一组余弦项(传统上是A项) */
      real: Float32Array,
      /** 一组余弦项(传统上是A项) */
      imag: Float32Array,
      /** 一个字典对象，它指定是否应该禁用规范化(默认启用规范化) */
      constraints: WebAudioContext.createPeriodicWave.Constraints
    ): PeriodicWave

    /** 创建一个BiquadFilterNode
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createBiquadFilter.html
     */
    createBiquadFilter(): BiquadFilterNode

    /** 创建一个 BufferSourceNode 实例，通过 AudioBuffer 对象来播放音频数据。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createBufferSource.html
     */
    createBufferSource(): AudioBufferSourceNode

    /** 创建一个ChannelMergerNode
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createChannelMerger.html
     */
    createChannelMerger(
      /** 输出流中需要保持的输入流的个数 */
      numberOfInputs: number
    ): ChannelMergerNode

    /** 创建一个ChannelSplitterNode
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createChannelSplitter.html
     */
    createChannelSplitter(
      /** 要分别输出的输入音频流中的通道数 */
      numberOfOutputs: number
    ): ChannelSplitterNode

    /** 创建一个DelayNode
     * @supported weapp
     * @example
     * ```tsx
     * let audioCtx = Taro.createWebAudioContext()
     * const delayNode = audioCtx.createDelay(5)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createDelay.html
     */
    createDelay(
      /** 最大延迟时间 */
      maxDelayTime: number
    ): DelayNode

    /** 创建一个DynamicsCompressorNode
     * @supported weapp
     * @example
     * ```tsx
     * let audioCtx = Taro.createWebAudioContext()
     * let compressor = audioCtx.createDynamicsCompressor()
     *
     * compressor.threshold.value = -50
     * compressor.knee.value = 40
     * compressor.ratio.value = 12
     * compressor.attack.value = 0
     * compressor.release.value = 0.25
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createDynamicsCompressor.html
     */
    createDynamicsCompressor(): DynamicsCompressorNode

    /** 创建一个ScriptProcessorNode
     * @supported weapp
     * @example
     * ```tsx
     * let audioCtx = Taro.createWebAudioContext()
     * const sampleSize = 4096
     * audioContext.createScriptProcessor(sampleSize, 1, 1)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createScriptProcessor.html
     */
    createScriptProcessor(
      /** 缓冲区大小，以样本帧为单位 */
      bufferSize: number,
      /** 用于指定输入 node 的声道的数量 */
      numberOfInputChannels: number,
      /** 用于指定输出 node 的声道的数量 */
      numberOfOutputChannels: number
    ): ScriptProcessorNode

    /** 创建一个PannerNode
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createPanner.html
     */
    createPanner(): PannerNode

    /** 创建一个AudioBuffer，代表着一段驻留在内存中的短音频
     * @supported weapp
     * @example
     * ```tsx
     * const audioCtx = Taro.createWebAudioContext()
     * const channels = 2, frameCount = audioCtx.sampleRate * 2.0
     * const myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.createBuffer.html
     */
    createBuffer(
      /** 定义了 buffer 中包含的声频通道数量的整数 */
      numOfChannels: number,
      /** 代表 buffer 中的样本帧数的整数 */
      length: number,
      /** 线性音频样本的采样率，即每一秒包含的关键帧的个数 */
      sampleRate: number
    ): AudioBuffer

    /** 异步解码一段资源为AudioBuffer。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.request({
     *   url: url, // 音频 url
     *   responseType: 'arraybuffer',
     *   success: res => {
     *     audioCtx.decodeAudioData(res.data, buffer => {
     *       console.log(buffer)
     *     }, err => {
     *       console.error('decodeAudioData fail', err)
     *     })
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContext.decodeAudioData.html
     */
    decodeAudioData(
      audioData: ArrayBuffer,
      successCallback: (buffer: AudioBuffer) => void,
      errorCallback: (error: any) => void
    ): Promise<AudioBuffer>
  }

  namespace WebAudioContext {
    namespace createPeriodicWave {
      /** 字典对象 */
      interface Constraints {
        /** 如果指定为 true 则禁用标准化
         * @default false
         */
        disableNormalization?: boolean
      }
    }
  }

  /** 一类音频处理模块，不同的Node具备不同的功能，如GainNode(音量调整)等。一个 WebAudioContextNode 可以通过上下文来创建。
   *
   * > 目前已经支持以下Node： IIRFilterNode WaveShaperNode ConstantSourceNode ChannelMergerNode OscillatorNode GainNode BiquadFilterNode PeriodicWaveNode BufferSourceNode ChannelSplitterNode ChannelMergerNode DelayNode DynamicsCompressorNode ScriptProcessorNode PannerNode
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContextNode.html
   */
  interface WebAudioContextNode {
    /** 右手笛卡尔坐标系中X轴的位置。 */
    positionX: number

    /** 右手笛卡尔坐标系中Y轴的位置。 */
    positionY: number

    /** 右手笛卡尔坐标系中Z轴的位置。 */
    positionZ: number

    /** 表示监听器的前向系统在同一笛卡尔坐标系中的水平位置，作为位置（位置x，位置和位置和位置）值。 */
    forwardX: number

    /** 表示听众的前向方向在同一笛卡尔坐标系中作为位置（位置x，位置和位置和位置）值的垂直位置。 */
    forwardY: number

    /** 表示与position (positionX、positionY和positionZ)值在同一笛卡尔坐标系下的听者前进方向的纵向(前后)位置。 */
    forwardZ: number

    /** 表示在与position (positionX、positionY和positionZ)值相同的笛卡尔坐标系中侦听器向前方向的水平位置。 */
    upX: number

    /** 表示在与position (positionX、positionY和positionZ)值相同的笛卡尔坐标系中侦听器向上方向的水平位置。 */
    upY: number

    /** 表示在与position (positionX、positionY和positionZ)值相同的笛卡尔坐标系中侦听器向后方向的水平位置。 */
    upZ: number

    /** 设置监听器的方向
     * @supported weapp
     */
    setOrientation(...args: any[]): void

    /** 设置监听器的位置
     * @supported weapp
     */
    setPosition(...args: any[]): void
  }

  namespace createInnerAudioContext {
    interface Option {
      /** 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项。
       * @supported weapp
       */
      useWebAudioImplement: boolean
    }
  }

  interface TaroStatic {
    /** 结束播放语音。
     * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](./createInnerAudioContext) 接口**
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
     * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](./createInnerAudioContext) 接口**
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
     * @supported weapp, h5, rn, tt, harmony_hybrid
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
    createInnerAudioContext(option?: createInnerAudioContext.Option): InnerAudioContext

    /** 创建 audio 上下文 AudioContext 对象。
     * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](./createInnerAudioContext) 接口**
     * @supported weapp, harmony_hybrid
     * @example
     * ```tsx
     * const audioCtx = Taro.createAudioContext('myAudio')
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createAudioContext.html
     */
    createAudioContext(
      /** [audio](/docs/components/media/audio) 组件的 id */
      id: string,
      /** 在自定义组件下，当前组件实例的this，以操作组件内 [audio](/docs/components/media/audio) 组件 */
      component?: TaroGeneral.IAnyObject,
    ): AudioContext
  }
}

declare namespace Taro {
  namespace stopRecord {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 停止录音。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.startRecord({
   *   success: function (res) {
   *     var tempFilePath = res.tempFilePath
   *   },
   *   fail: function (res) {
   *      //录音失败
   *   }
   * })
   * setTimeout(function() {
   *   //结束录音
   *   Taro.stopRecord()
   * }, 10000)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.stopRecord.html
   */
  function stopRecord(option?: stopRecord.Option): void

  namespace startRecord {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 录音文件的临时路径 */
      tempFilePath: string
      /** 调用结果 */
      errMsg: string
    }
  }
  /** 开始录音。当主动调用`Taro.stopRecord`，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。当用户离开小程序时，此接口无法调用。
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.getRecorderManager](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.getRecorderManager.html) 接口**
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.record
   * @supported weapp
   * @example
   * ```tsx
   * Taro.startRecord({
   *   success: function (res) {
   *     const tempFilePath = res.tempFilePath
   *   }
   * })
   * setTimeout(function () {
   *   Taro.stopRecord() // 结束录音
   * }, 10000)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html
   */
  function startRecord(option: startRecord.Option): Promise<startRecord.SuccessCallbackResult>

  /** 获取**全局唯一**的录音管理器 RecorderManager
   * @supported weapp
   * @example
   * ```tsx
   * const recorderManager = Taro.getRecorderManager()
   * recorderManager.onStart(() => {
   *   console.log('recorder start')
   * })
   * recorderManager.onPause(() => {
   *   console.log('recorder pause')
   * })
   * recorderManager.onStop((res) => {
   *   console.log('recorder stop', res)
   *   const { tempFilePath } = res
   * })
   * recorderManager.onFrameRecorded((res) => {
   *   const { frameBuffer } = res
   *   console.log('frameBuffer.byteLength', frameBuffer.byteLength)
   * })
   * const options = {
   *   duration: 10000,
   *   sampleRate: 44100,
   *   numberOfChannels: 1,
   *   encodeBitRate: 192000,
   *   format: 'aac',
   *   frameSize: 50
   * }
   * recorderManager.start(options)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.getRecorderManager.html
   */
  function getRecorderManager(): RecorderManager

  namespace RecorderManager {
    /** 录音错误事件的回调函数 */
    type OnErrorCallback = (
      result: OnErrorCallbackResult,
    ) => void
    interface OnErrorCallbackResult extends General.CallbackResult {
      /** 错误信息 */
      errMsg: string
    }
    /** 已录制完指定帧大小的文件事件的回调函数 */
    type OnFrameRecordedCallback = (
      result: OnFrameRecordedCallbackResult,
    ) => void
    interface OnFrameRecordedCallbackResult {
      /** 录音分片数据 */
      frameBuffer: ArrayBuffer
      /** 当前帧是否正常录音结束前的最后一帧 */
      isLastFrame: boolean
    }
    /** 录音结束事件的回调函数 */
    type OnStopCallback = (result: OnStopCallbackResult) => void
    interface OnStopCallbackResult {
      /** 录音总时长，单位：ms */
      duration: number
      /** 录音文件大小，单位：Byte */
      fileSize: number
      /** 录音文件的临时路径 */
      tempFilePath: string
    }
    interface StartOption {
      /** 指定录音的音频输入源，可通过 [wx.getAvailableAudioSources()](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.getAvailableAudioSources.html) 获取当前可用的音频源 */
      audioSource?: keyof audioSource
      /** 录音的时长，单位 ms，最大值 600000（10 分钟） */
      duration?: number
      /** 编码码率，有效值见下表格 */
      encodeBitRate?: number
      /** 音频格式 */
      format?: keyof format
      /** 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。 */
      frameSize?: number
      /** 录音通道数 */
      numberOfChannels?: keyof numberOfChannels
      /** 采样率 */
      sampleRate?: keyof sampleRate
    }
    /** 指定录音的音频输入源 */
    interface audioSource {
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
    /** 音频格式 */
    interface format {
      /** mp3 格式 */
      mp3
      /** aac 格式 */
      aac
    }
    /** 录音通道数 */
    interface numberOfChannels {
      /** 1 个通道 */
      1
      /** 2 个通道 */
      2
    }
    /** 采样率 */
    interface sampleRate {
      /** 8000 采样率
       * @codeRate 16000 ~ 48000
       */
      8000
      /** 11025 采样率
       * @codeRate 16000 ~ 48000
       */
      11025
      /** 12000 采样率
       * @codeRate 24000 ~ 64000
       */
      12000
      /** 16000 采样率
       * @codeRate 24000 ~ 96000
       */
      16000
      /** 22050 采样率
       * @codeRate 32000 ~ 128000
       */
      22050
      /** 24000 采样率
       * @codeRate 32000 ~ 128000
       */
      24000
      /** 32000 采样率
       * @codeRate 48000 ~ 192000
       */
      32000
      /** 44100 采样率
       * @codeRate 64000 ~ 320000
       */
      44100
      /** 48000 采样率
       * @codeRate 64000 ~ 320000
       */
      48000
    }
  }

  /** 全局唯一的录音管理器
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.html
   */
  interface RecorderManager {
    /** 监听录音错误事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onError.html
     */
    onError(
      /** 录音错误事件的回调函数 */
      callback: RecorderManager.OnErrorCallback,
    ): void
    /** 监听已录制完指定帧大小的文件事件。如果设置了 frameSize，则会回调此事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onFrameRecorded.html
     */
    onFrameRecorded(
      /** 已录制完指定帧大小的文件事件的回调函数 */
      callback: RecorderManager.OnFrameRecordedCallback,
    ): void
    /** 监听录音因为受到系统占用而被中断开始事件。以下场景会触发此事件：微信语音聊天、微信视频聊天。此事件触发后，录音会被暂停。pause 事件在此事件后触发
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onInterruptionBegin.html
     */
    onInterruptionBegin(
      /** 录音因为受到系统占用而被中断开始事件的回调函数 */
      callback: (res: General.CallbackResult) => void,
    ): void
    /** 监听录音中断结束事件。在收到 interruptionBegin 事件之后，小程序内所有录音会暂停，收到此事件之后才可再次录音成功。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onInterruptionEnd.html
     */
    onInterruptionEnd(
      /** 录音中断结束事件的回调函数 */
      callback: (res: General.CallbackResult) => void,
    ): void
    /** 监听录音暂停事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onPause.html
     */
    onPause(
      /** 录音暂停事件的回调函数 */
      callback: (res: General.CallbackResult) => void,
    ): void
    /** 监听录音继续事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onResume.html
     */
    onResume(
      /** 录音继续事件的回调函数 */
      callback: (res: General.CallbackResult) => void,
    ): void
    /** 监听录音开始事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onStart.html
     */
    onStart(
      /** 录音开始事件的回调函数 */
      callback: (res: General.CallbackResult) => void,
    ): void
    /** 监听录音结束事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.onStop.html
     */
    onStop(
      /** 录音结束事件的回调函数 */
      callback: RecorderManager.OnStopCallback,
    ): void
    /** 暂停录音
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.pause.html
     */
    pause(): void
    /** 继续录音
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.resume.html
     */
    resume(): void
    /** 开始录音
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.start.html
     */
    start(option: RecorderManager.StartOption): void
    /** 停止录音
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.stop.html
     */
    stop(): void
  }
}

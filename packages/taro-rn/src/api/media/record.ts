import { Audio } from 'expo-av'

console.log(Audio)

class RecorderManager {
  private static instance: Audio.Recording
  private onStartCallback
  private onStopCallback
  private onPauseCallback
  private onResumeCallback
  private onErrorCallback
  private preStatus

  private constructor () { }

  private static RecordingOptions = {
    android: {
      extension: '.m4a',
      // outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      // audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 8000,
      numberOfChannels: 2,
      bitRate: 48000
    },
    ios: {
      extension: '.caf',
      // audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      sampleRate: 8000,
      numberOfChannels: 2,
      bitRate: 48000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false
    }
  }

  static getInstance () {
    if (!RecorderManager.instance) {
      // RecorderManager.instance = new Audio.Recording()
    }
    return RecorderManager.instance
  }

  /**
   * 开始录音
   * @param {object} opts
   * @param {number} [opts.duration=60000] - 录音的时长，单位 ms，最大值 600000（10 分钟）❓
   * @param {number} [opts.sampleRate=8000] - 采样率
   * @param {number} [opts.numberOfChannels=2] - 录音通道数
   * @param {number} [opts.encodeBitRate=48000] - 编码码率，有效值见下表格
   * @param {string} [opts.format='acc'] - 音频格式 ❌
   * @param {number} [opts.frameSize] - 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。 ❌
   * @param {string} [opts.audioSource='auto'] - 指定录音的音频输入源，可通过 wx.getAvailableAudioSources() 获取当前可用的音频源 ❌
   */
  async start (opts = {}) {
    const {
      duration = 60000,
      sampleRate = 8000,
      numberOfChannels = 2,
      encodeBitRate = 48000,
      format = 'aac',
      frameSize,
      audioSource = 'auto'
    }: any = opts
    let options = {
      android: Object.assign({}, RecorderManager.RecordingOptions.android, {sampleRate, numberOfChannels, bitRate: encodeBitRate}),
      ios: Object.assign({}, RecorderManager.RecordingOptions.ios, {sampleRate, numberOfChannels, bitRate: encodeBitRate})
    }
    try {
      await RecorderManager.instance.prepareToRecordAsync(options)
      await RecorderManager.instance.startAsync()
    } catch (error) {
      this.onErrorCallback({errMsg: error.message})
    }
  }

  /**
   * 暂停录音
   */
  async pause () {
    try {
      await RecorderManager.instance.pauseAsync()
    } catch (error) {
      this.onErrorCallback({errMsg: error.message})
    }
  }

  async resume () {
    try {
      await RecorderManager.instance.pauseAsync()
    } catch (error) {
      this.onErrorCallback({errMsg: error.message})
    }
  }

  async stop () {
    try {
      await RecorderManager.instance.stopAndUnloadAsync()
    } catch (error) {
      this.onErrorCallback({errMsg: error.message})
    }
  }

  private onRecordingStatusUpdate (status) {
    console.log(status)
    // if(this.preStatus===undefined && status==='')
  }

  /**
   * 监听录音开始事件
   * @param {function} callback
   */
  onError (callback) {
    this.onErrorCallback = callback
  }

  /**
   * 监听录音开始事件
   * @param {function} callback
   */
  onStart (callback) {
    this.onStartCallback = callback
    RecorderManager.instance.setOnRecordingStatusUpdate(this.onRecordingStatusUpdate)
  }

  /**
   * 监听录音结束事件
   * @param {function} callback
   */
  onStop (callback) {
    this.onStopCallback = callback
  }

  /**
   * 监听录音暂停事件
   * @param {function} callback
   */
  onPause (callback) {
    this.onPauseCallback = callback
  }

  /**
   * 监听录音继续事件
   * @param {function} callback
   */
  onResume (callback) {
    this.onResumeCallback = callback
  }

}

/**
 * 获取全局唯一的录音管理器 RecorderManager
 * @returns {RecorderManager}
 */
function getRecorderManager () {
  return RecorderManager.getInstance()
}

export { getRecorderManager }

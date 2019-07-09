import { Audio } from 'expo-av'
import { Permissions } from 'react-native-unimodules'
import { askAsyncPermissions } from '../utils'

class RecorderManager {
  private static instance: RecorderManager
  private static recordInstance: Audio.Recording
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
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 8000,
      numberOfChannels: 2,
      bitRate: 48000
    },
    ios: {
      extension: '.caf',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
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
      RecorderManager.recordInstance = new Audio.Recording()
      RecorderManager.instance = new RecorderManager()
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

    const status = await askAsyncPermissions(Permissions.AUDIO_RECORDING)
    if (status !== 'granted') {
      const res = {errMsg: `Permissions denied!`}
      return Promise.reject(res)
    }

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
      const res = RecorderManager.recordInstance.getStatusAsync()
      console.log('res', res)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: true
      } as any)
      await RecorderManager.recordInstance.prepareToRecordAsync(options)
      const res2 = RecorderManager.recordInstance.getStatusAsync()
      console.log('res2', res2)
      await RecorderManager.recordInstance.startAsync()
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({errMsg: error.message})
    }
  }

  /**
   * 暂停录音
   */
  async pause () {
    try {
      await RecorderManager.recordInstance.pauseAsync()
      this.onPauseCallback && this.onPauseCallback()
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({errMsg: error.message})
    }
  }

  /**
   * 继续录音
   * @returns {Promise<void>}
   */
  async resume () {
    try {
      await RecorderManager.recordInstance.startAsync()
      this.onResumeCallback && this.onResumeCallback()
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({errMsg: error.message})
    }
  }

  /**
   * 停止录音
   * @returns {Promise<void>}
   */
  async stop () {
    try {
      await RecorderManager.recordInstance.stopAndUnloadAsync()
      this.onStopCallback && this.onStopCallback()
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({errMsg: error.message})
    }
  }

  private onRecordingStatusUpdate (status) {
    if (this.preStatus === undefined) {
      this.preStatus = status
      return
    }
    if (!this.preStatus.isRecording && status.isRecording) {
      console.log('start')
    }
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
    RecorderManager.recordInstance.setOnRecordingStatusUpdate(this.onRecordingStatusUpdate)
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

  /**
   * @todo
   * 监听已录制完指定帧大小的文件事件。如果设置了 frameSize，则会回调此事件。
   * @param callback
   */
  onFrameRecorded (callback) {
    console.log('not achieve')
  }

  /**
   * @todo
   * 监听录音因为受到系统占用而被中断开始事件。以下场景会触发此事件：微信语音聊天、微信视频聊天。此事件触发后，录音会被暂停。pause 事件在此事件后触发
   * @param callback
   */
  onInterruptionBegin (callback) {
    console.log('not achieve')
  }

  /**
   * @todo
   * 监听录音中断结束事件。在收到 interruptionBegin 事件之后，小程序内所有录音会暂停，收到此事件之后才可再次录音成功。
   * @param callback
   */
  onInterruptionEnd (callback) {
    console.log('not achieve')
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

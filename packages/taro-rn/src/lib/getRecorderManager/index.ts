import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'

class RecorderManager {
  private static instance: RecorderManager
  private static recordInstance?: Audio.Recording
  private onStartCallback
  private onStopCallback
  private onPauseCallback
  private onResumeCallback
  private onErrorCallback
  private preStatus

  private static RecordingOptions = {
    android: {
      extension: '.m4a',
      // @ts-ignore 兼容 12.0.2 11.2.3
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4 || Audio.AndroidOutputFormat.MPEG_4,
      // @ts-ignore 兼容 12.0.2 11.2.3
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC || Audio.AndroidAudioEncoder.AAC,
      sampleRate: 8000,
      numberOfChannels: 2,
      bitRate: 48000
    },
    ios: {
      extension: '.caf',
      // @ts-ignore 兼容 12.0.2 11.2.3
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX || Audio.IOSAudioQuality.MAX,
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
    const { granted } = await Audio.requestPermissionsAsync()
    if (!granted) {
      const res = { errMsg: 'Permissions denied!' }
      return Promise.reject(res)
    }

    const {
      // duration = 60000,
      sampleRate = 8000,
      numberOfChannels = 2,
      encodeBitRate = 48000,
      // format = 'aac',
      // frameSize,
      // audioSource = 'auto'
    }: any = opts
    const options = {
      android: Object.assign({}, RecorderManager.RecordingOptions.android, { sampleRate, numberOfChannels, bitRate: encodeBitRate }),
      ios: Object.assign({}, RecorderManager.RecordingOptions.ios, { sampleRate, numberOfChannels, bitRate: encodeBitRate }),
      web: {}
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1, //InterruptionModeAndroid.DoNotMix
        playThroughEarpieceAndroid: true
      } as any)

      if (RecorderManager.recordInstance) {
        const recordStatus = await RecorderManager.recordInstance.getStatusAsync()
        if (recordStatus.canRecord) {
          await RecorderManager.recordInstance.stopAndUnloadAsync()
        }
        RecorderManager.recordInstance.setOnRecordingStatusUpdate(null)
        RecorderManager.recordInstance = undefined
      }

      const recording = new Audio.Recording()
      RecorderManager.recordInstance = recording
      RecorderManager.recordInstance.setOnRecordingStatusUpdate(this.onRecordingStatusUpdate)
      await RecorderManager.recordInstance.prepareToRecordAsync(options)
      // const res2 = RecorderManager.recordInstance.getStatusAsync()
      // console.log('res2', res2)
      await RecorderManager.recordInstance.startAsync()
      this.onStartCallback?.()
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({ errMsg: error.message })
    }
  }

  /**
   * 暂停录音
   */
  async pause () {
    try {
      const recordInstance = RecorderManager.recordInstance
      if (recordInstance) {
        await recordInstance.pauseAsync()
        this.onPauseCallback && this.onPauseCallback()
      }
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({ errMsg: error.message })
    }
  }

  /**
   * 继续录音
   * @returns {Promise<void>}
   */
  async resume () {
    try {
      const recordInstance = RecorderManager.recordInstance
      if (recordInstance) {
        await recordInstance.startAsync()
        this.onResumeCallback && this.onResumeCallback()
      }
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({ errMsg: error.message })
    }
  }

  /**
   * 停止录音
   * @returns {Promise<void>}
   */
  async stop () {
    try {
      const recordInstance = RecorderManager.recordInstance
      if (recordInstance) {
        const recordStatus = await recordInstance.stopAndUnloadAsync()
        const uri = recordInstance.getURI() || ''
        const info = await FileSystem.getInfoAsync(uri)
        // console.log(`FILE INFO: ${JSON.stringify(info)}`)

        const result = {
          tempFilePath: uri,
          duration: recordStatus.durationMillis,
          // @ts-ignore
          fileSize: info.size
        }
        this.onStopCallback && this.onStopCallback(result)
      }
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({ errMsg: error.message })
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
  // onFrameRecorded (callback) {
  //   console.log('not achieve')
  // }

  /**
   * @todo
   * 监听录音因为受到系统占用而被中断开始事件。以下场景会触发此事件：微信语音聊天、微信视频聊天。此事件触发后，录音会被暂停。pause 事件在此事件后触发
   * @param callback
   */
  // onInterruptionBegin (callback) {
  //   console.log('not achieve')
  // }

  /**
   * @todo
   * 监听录音中断结束事件。在收到 interruptionBegin 事件之后，小程序内所有录音会暂停，收到此事件之后才可再次录音成功。
   * @param callback
   */
  // onInterruptionEnd (callback) {
  //   console.log('not achieve')
  // }
}

/**
 * 获取全局唯一的录音管理器 RecorderManager
 * @returns {RecorderManager}
 */

function getRecorderManager (): any {
  return RecorderManager.getInstance()
}

export { getRecorderManager }

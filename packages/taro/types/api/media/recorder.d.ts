declare namespace Taro {
  /**
   * ​主动调用停止录音。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startRecord({
     success: function(res) {
       var tempFilePath = res.tempFilePath
     },
     fail: function(res) {
        //录音失败
     }
   })
   setTimeout(function() {
     //结束录音
     Taro.stopRecord()
   }, 10000)
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.stopRecord.html
   */
  function stopRecord(): void

  namespace startRecord {
    type Promised = {
      /**
       * 录音文件的临时路径
       */
      tempFilePath: string
    }
    type Param = {}
  }
  /**
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.getRecorderManager](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.getRecorderManager.html) 接口**
   *
   * 开始录音。当主动调用`Taro.stopRecord`，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。当用户离开小程序时，此接口无法调用。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.record
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html
   */
  function startRecord(OBJECT?: startRecord.Param): Promise<startRecord.Promised>

  /**
   * @since 1.6.0
   *
   * 获取**全局唯一**的录音管理器 `recorderManager`。
   *
   * **其中，采样率和码率有一定要求，具体有效值如下：：**
   *
   *   采样率  |  编码码率
   * ----------|-------------------
   *   8000    |  16000 ~ 48000
   *   11025   |  16000 ~ 48000
   *   12000   |  24000 ~ 64000
   *   16000   |  24000 ~ 96000
   *   22050   |  32000 ~ 128000
   *   24000   |  32000 ~ 128000
   *   32000   |  48000 ~ 192000
   *   44100   |  64000 ~ 320000
   *   48000   |  64000 ~ 320000
   *
   * **示例代码：**
   *
   ```javascript
   const recorderManager = Taro.getRecorderManager()
         recorderManager.onStart(() => {
     console.log('recorder start')
   })
   recorderManager.onPause(() => {
     console.log('recorder pause')
   })
   recorderManager.onStop((res) => {
     console.log('recorder stop', res)
     const { tempFilePath } = res
   })
   recorderManager.onFrameRecorded((res) => {
     const { frameBuffer } = res
     console.log('frameBuffer.byteLength', frameBuffer.byteLength)
   })
         const options = {
     duration: 10000,
     sampleRate: 44100,
     numberOfChannels: 1,
     encodeBitRate: 192000,
     format: 'aac',
     frameSize: 50
   }
         recorderManager.start(options)
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.getRecorderManager.html
   */
  function getRecorderManager(): RecorderManager
  namespace RecorderManager {
    namespace start {
      type Param = {
        /**
         * 指定录音的时长，单位 ms ，如果传入了合法的 duration ，在到达指定的 duration 后会自动停止录音，最大值 600000（10 分钟）,默认值 60000（1 分钟）
         */
        duration?: number
        /**
         * 采样率，有效值 8000/16000/44100
         */
        sampleRate?: number
        /**
         * 录音通道数，有效值 1/2
         */
        numberOfChannels?: number
        /**
         * 编码码率，有效值见下表格
         */
        encodeBitRate?: number
        /**
         * 音频格式，有效值 aac/mp3
         */
        format?: string
        /**
         * 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。
         */
        frameSize?: number
      }
    }
    namespace onStop {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * 录音文件的临时路径
         */
        tempFilePath: string
      }
    }
    namespace onFrameRecorded {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * 录音分片结果数据
         */
        frameBuffer: ArrayBuffer
        /**
         * 当前帧是否正常录音结束前的最后一帧
         */
        isLastFrame: boolean
      }
    }
    namespace onError {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * 错误信息
         */
        errMsg: string
      }
    }
  }
  class RecorderManager {
    /**
     * 开始录音
     */
    start(options: RecorderManager.start.Param): void
    /**
     * 暂停录音
     */
    pause(): void
    /**
     * 继续录音
     */
    resume(): void
    /**
     * 停止录音
     */
    stop(): void
    /**
     * 录音开始事件
     */
    onStart(callback?: () => void): void
    /**
     * 录音暂停事件
     */
    onPause(callback?: () => void): void
    /**
     * 录音停止事件，会回调文件地址
     */
    onStop(callback?: RecorderManager.onStop.Param): void
    /**
     * 已录制完指定帧大小的文件，会回调录音分片结果数据。如果设置了 frameSize ，则会回调此事件
     */
    onFrameRecorded(callback?: RecorderManager.onFrameRecorded.Param): void
    /**
     * 录音错误事件, 会回调错误信息
     */
    onError(callback?: RecorderManager.onError.Param): void
  }
}

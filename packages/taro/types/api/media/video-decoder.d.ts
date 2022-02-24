import Taro from '../../index'

declare module '../../index' {
  interface VideoDecoder {
    /** 获取下一帧的解码数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.getFrameData.html
     */
    getFrameData(): Promise<VideoDecoder.getFrameData.Result>
    /** 取消监听录制事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.off.html
     */
    off(
      /** 事件名 */
      eventName: keyof VideoDecoder.on.EventName,
      /** 事件触发时执行的回调函数 */
      callback: VideoDecoder.on.Callback
    ): void
    /** 注册监听录制事件的回调函数
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.on.html
     */
    on(
      /** 事件名 */
      eventName: keyof VideoDecoder.on.EventName,
      /** 事件触发时执行的回调函数 */
      callback: VideoDecoder.on.Callback
    ): void
    /** 移除解码器
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.remove.html
     */
    remove(): Promise<void>
    /** 跳到某个时间点解码
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.seek.html
     */
    seek(
      /** 跳转的解码位置，单位 ms */
      position: number
    ): Promise<void>
    /** 开始解码
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.start.html
     */
    start(option: VideoDecoder.start.Option): Promise<void>
    /** 停止解码
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/VideoDecoder.stop.html
     */
    stop(): Promise<void>
  }

  namespace VideoDecoder {
    namespace getFrameData {
      interface Result {
        /** 帧数据宽度 */
        width: number
        /** 帧数据高度 */
        height: number
        /** 帧数据 */
        data: ArrayBuffer
        /** 帧原始 pts */
        pkPts: number
        /** 帧原始 dts */
        pkDts: number
      }
    }
    namespace on {
      /** eventName 的合法值 */
      interface EventName {
        /** 开始事件。返回 {width, height} */
        start 
        /** 结束事件。 */
        stop
        /** seek 完成事件。 */
        seek
        /** 缓冲区变化事件。 */
        bufferchange
        /** 解码结束事件。 */
        ended
      }
      /** 事件触发时执行的回调函数 */
      type Callback = (res?: {
        width: number
        height: number
      }) => void
    }
    namespace start {
      interface Option {
        /** 需要解码的视频源文件。 */
        source: string 
        /** 解码模式。0：按 pts 解码；1：以最快速度解码
         * @default 1
         */
        mode?: number
        /** 是否不需要音频轨道
         * @default false
         */
        abortAudio?: boolean
        /** 是否不需要视频轨道
         * @default false
         */
        abortVideo?: boolean
      }
    }
  }

  interface TaroStatic {
    /** 创建视频解码器，可逐帧获取解码后的数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/wx.createVideoDecoder.html
     */
    createVideoDecoder(): VideoDecoder
  }
}

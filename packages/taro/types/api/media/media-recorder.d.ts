import Taro from '../../index'

declare module '../../index' {
  interface MediaRecorder {
    /** 销毁录制器
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.destroy.html
     */
    destroy(): Promise<void>
    /** 取消监听录制事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.off.html
     */
    off(
      /** 事件名 */
      eventName: keyof MediaRecorder.on.EventName,
      /** 事件触发时执行的回调函数 */
      callback: MediaRecorder.on.Callback
    ): Promise<void>
    /** 注册监听录制事件的回调函数
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.on.html
     */
    on(
      /** 事件名 */
      eventName: keyof MediaRecorder.on.EventName,
      /** 事件触发时执行的回调函数 */
      callback: MediaRecorder.on.Callback
    ): Promise<void>
    /** 暂停录制
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.pause.html
     */
    pause(): Promise<void>
    /** 请求下一帧录制，在 callback 里完成一帧渲染后开始录制当前帧
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.requestFrame.html
     */
    requestFrame(callback: MediaRecorder.requestFrame.Callback): Promise<void>
    /** 恢复录制
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.resume.html
     */
    resume(): Promise<void>
    /** 开始录制
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.start.html
     */
    start(): Promise<void>
    /** 结束录制
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-decoder/MediaRecorder.stop.html
     */
    stop(): Promise<void>
  }

  namespace MediaRecorder {
    namespace on {
      /** eventName 的合法值 */
      interface EventName {
        /** 录制开始事件。 */
        start 
        /** 录制结束事件。返回 {tempFilePath, duration, fileSize} */
        stop
        /** 录制暂停事件。 */
        pause
        /** 录制继续事件。 */
        resume
        /** 录制时间更新事件。 */
        timeupdate
      }
      /** 事件触发时执行的回调函数 */
      type Callback = (res?: {
        tempFilePath: string
        duration: number
        fileSize: number
      }) => void
    }
    namespace requestFrame {
      /** 事件触发时执行的回调函数 */
      type Callback = () => void
    }
  }

  interface TaroStatic {
    /** 创建 WebGL 画面录制器，可逐帧录制在 WebGL 上渲染的画面并导出视频文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/media-recorder/wx.createMediaRecorder.html
     */
    createMediaRecorder(): MediaRecorder
  }
}

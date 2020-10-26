declare namespace Taro {
  /** 创建 camera 上下文 CameraContext 对象。
   * @supported weapp
   * @example
   * ```tsx
   * const cameraContext = Taro.createCameraContext()
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/wx.createCameraContext.html
   */
  function createCameraContext(): CameraContext

  /** 
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.html
   */
  interface CameraContext {
    /** 开始录像
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.startRecord.html
     */
    startRecord(option: CameraContext.StartRecordOption): void
    /** 结束录像
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.stopRecord.html
     */
    stopRecord(option?: CameraContext.StopRecordOption): void
    /** 拍摄照片
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.takePhoto.html
     */
    takePhoto(option: CameraContext.TakePhotoOption): void
    /** 获取 Camera 实时帧数据
     *
     * ****
     *
     * 注： 使用该接口需同时在 [camera](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) 组件属性中指定 frame-size。
     * @supported weapp
     * @example
     * ```tsx
     * const context = wx.createCameraContext()
     * const listener = context.onCameraFrame((frame) => {
     *   console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height)
     * })
     * listener.start()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.onCameraFrame.html
     */
    onCameraFrame(
      /** 回调函数 */
      callback: CameraContext.OnCameraFrameCallback,
    ): CameraFrameListener
  }

  namespace CameraContext {
    interface StartRecordOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
      /** 超过30s或页面 `onHide` 时会结束录像 */
      timeoutCallback?: StartRecordTimeoutCallback
    }
    /** 超过30s或页面 `onHide` 时会结束录像 */
    type StartRecordTimeoutCallback = (
      result: StartRecordTimeoutCallbackResult,
    ) => void
    interface StartRecordTimeoutCallbackResult {
      /** 封面图片文件的临时路径 */
      tempThumbPath: string
      /** 视频的文件的临时路径 */
      tempVideoPath: string
    }
    interface StopRecordOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: StopRecordSuccessCallbackResult) => void
    }
    interface StopRecordSuccessCallbackResult extends General.CallbackResult {
      /** 封面图片文件的临时路径 */
      tempThumbPath: string
      /** 视频的文件的临时路径 */
      tempVideoPath: string
      /** 调用结果 */
      errMsg: string
    }
    interface TakePhotoOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 成像质量 */
      quality?: keyof quality
      /** 接口调用成功的回调函数 */
      success?: (result: TakePhotoSuccessCallbackResult) => void
    }
    interface TakePhotoSuccessCallbackResult extends General.CallbackResult {
      /** 照片文件的临时路径，安卓是jpg图片格式，ios是png */
      tempImagePath: string
      /** 调用结果 */
      errMsg: string
    }
    /** 回调函数 */
    type OnCameraFrameCallback = (result: OnCameraFrameCallbackResult) => void
    interface OnCameraFrameCallbackResult {
      /** 图像像素点数据，一维数组，每四项表示一个像素点的 rgba */
      data: ArrayBuffer
      /** 图像数据矩形的高度 */
      height: number
      /** 图像数据矩形的宽度 */
      width: number
    }
    interface quality {
      /** 高质量 */
      high
      /** 普通质量 */
      normal
      /** 低质量 */
      low
    }
  }

  /** CameraContext.onCameraFrame() 返回的监听器。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraFrameListener.html
   */
  interface CameraFrameListener {
    /** 开始监听帧数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraFrameListener.start.html
     */
    start(option?: CameraFrameListener.StartOption): void
    /** 停止监听帧数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraFrameListener.stop.html
     */
    stop(option?: CameraFrameListener.StopOption): void
  }

  namespace CameraFrameListener {
    interface StartOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface StopOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
}

import Taro from '../../index'

declare module '../../index' {
  /**
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.html
   */
  interface CameraContext {
    /** 获取 Camera 实时帧数据
     *
     * ****
     *
     * 注： 使用该接口需同时在 [camera](/docs/components/media/camera) 组件属性中指定 frame-size。
     * @supported weapp, tt, alipay
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
    /** 设置缩放级别
     * @supported weapp, tt, alipay
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.setZoom.html
     */
    setZoom(option: CameraContext.SetZoomOption): void
    /** 开始录像
     * @supported weapp, rn, tt, alipay
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.startRecord.html
     */
    startRecord(option: CameraContext.StartRecordOption): void
    /** 结束录像
     * @supported weapp, rn, tt, alipay
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.stopRecord.html
     */
    stopRecord(option?: CameraContext.StopRecordOption): void
    /** 拍摄照片
     * @supported weapp, rn, tt, alipay
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.takePhoto.html
     */
    takePhoto(option: CameraContext.TakePhotoOption): void
  }

  namespace CameraContext {
    interface SetZoomOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: StartRecordSuccessCallbackResult) => void
      /** 缩放级别，范围[1, maxZoom]。zoom 可取小数，精确到小数后一位。maxZoom 可在 bindinitdone 返回值中获取。 */
      zoom: number
    }
    interface StartRecordSuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 实际设置的缩放级别。由于系统限制，某些机型可能无法设置成指定值，会改用最接近的可设值。 */
      zoom: number
      /**
       * @supported alipay
       * @alipay on android
       */
      setZoom:number
    }
    interface StartRecordOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
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
      /** 视频文件的高度。
       * @supported alipay
       */
      height: string
      /** 视频文件的宽度。
       * @supported alipay
       */
      width: string
      /** 视频文件的尺寸。
       * @supported alipay
       */
      size: string
      /** 录制的持续时间。
       * @supported alipay
       */
      duration: string
    }
    interface StopRecordOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: StopRecordSuccessCallbackResult) => void
    }
    interface StopRecordSuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 封面图片文件的临时路径 */
      tempThumbPath: string
      /** 视频的文件的临时路径 */
      tempVideoPath: string
      /** 调用结果 */
      errMsg: string
    }
    interface TakePhotoOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 成像质量 */
      quality?: keyof Quality
      /** 接口调用成功的回调函数 */
      success?: (result: TakePhotoSuccessCallbackResult) => void
    }
    interface TakePhotoSuccessCallbackResult extends TaroGeneral.CallbackResult {
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
    interface Quality {
      /** 高质量 */
      high
      /** 普通质量 */
      normal
      /** 低质量 */
      low
      /** 原图 */
      original
    }
  }

  /** CameraContext.onCameraFrame() 返回的监听器。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraFrameListener.html
   */
  interface CameraFrameListener {
    /** 开始监听帧数据
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraFrameListener.start.html
     */
    start(option?: CameraFrameListener.StartOption): void
    /** 停止监听帧数据
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraFrameListener.stop.html
     */
    stop(option?: CameraFrameListener.StopOption): void
  }

  namespace CameraFrameListener {
    interface StartOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface StopOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 创建 camera 上下文 CameraContext 对象。
     *
     * ****
     *
     * 注：支付宝小程序需指定 camera 组件中的 id 属性
     * @supported weapp, rn, tt, alipay
     * @example
     * ```tsx
     * const cameraContext = Taro.createCameraContext()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/wx.createCameraContext.html
     */
    createCameraContext(id?: string): CameraContext
  }
}

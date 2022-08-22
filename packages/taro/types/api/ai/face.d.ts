import Taro from '../../index'

declare module '../../index' {
  namespace stopFaceDetect {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace initFaceDetect {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace faceDetect {
    interface Option {
      /** 图像像素点数据，每四项表示一个像素点的 RGBA */
      frameBuffer: ArrayBuffer
      /** 图像宽度 */
      width: number
      /** 图像高度 */
      height: number
      /** 是否返回当前图像的人脸（106 个点）
       * @default false
       */
      enablePoint?: boolean
      /** 是否返回当前图像的人脸的置信度（可表示器官遮挡情况）
       * @default false
       */
      enableConf?: boolean
      /** 是否返回当前图像的人脸角度信息
       * @default false
       */
      enableAngle?: boolean
      /** 是否返回多张人脸的信息
       * @default false
       */
      enableMultiFace?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackOption) => void
    }

    interface SuccessCallbackOption extends face {
      /** 多人模式（enableMultiFace）下的人脸信息，每个对象包含上述其它属性 */
      faceInfo?: face
    }

    interface face {
      /** 脸部正方框数值，对象包含 height, weight, originX, originY 四个属性 */
      detectRect: detectRect
      /** 脸部中心点横坐标，检测不到人脸则为 -1 */
      x: number
      /** 脸部中心点纵坐标，检测不到人脸则为 -1 */
      y: number
      /** 人脸 106 个点位置数组，数组每个对象包含 x 和 y */
      pointArray: point[]
      /** 人脸置信度，取值范围 [0, 1]，数值越大置信度越高（遮挡越少） */
      confArray: conf[]
      /** 人脸角度信息，取值范围 [-1, 1]，数值越接近 0 表示越正对摄像头 */
      angleArray: angle[]
    }

    /** 脸部正方框数值 */
    interface detectRect {
      height: number
      weight: number
      originX: number
      originY: number
    }

    interface point {
      x: number
      y: number
    }

    interface conf {
      /** 整体可信度 */
      global: number
      /** 左眼可信度 */
      leftEye: number
      /** 右眼可信度 */
      rightEye: number
      /** 嘴巴可信度 */
      mouth: number
      /** 鼻子可信度 */
      nose: number
    }

    interface angle {
      /** 仰俯角（点头） */
      pitch: number
      /** 偏航角（摇头） */
      yaw: number
      /** 翻滚角（左右倾） */
      roll: number
    }
  }

  interface TaroStatic {
    /** 停止人脸识别
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/face/wx.stopFaceDetect.html
     */
    stopFaceDetect (option: stopFaceDetect.Option): Promise<TaroGeneral.CallbackResult>

    /** 初始化人脸识别
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/face/wx.initFaceDetect.html
     */
    initFaceDetect (option: initFaceDetect.Option): Promise<TaroGeneral.CallbackResult>

    /** 人脸识别，使用前需要通过 Taro.initFaceDetect 进行一次初始化，推荐使用相机接口返回的帧数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/face/wx.faceDetect.html
     */
    faceDetect (option: faceDetect.Option): Promise<TaroGeneral.CallbackResult>
  }
}

import Taro from '../../index'

declare module '../../index' {
  namespace isVKSupport {
    /** vision kit 版本 */
    interface Version {
      /** 旧版本 */
      v1
      /** v2 版本，目前只有 iOS 基础库 2.22.0 以上支持 */
      v2
    }
  }
  namespace createVKSession {
    /** vision kit 版本 */
    interface Version {
      /** 旧版本 */
      v1
      /** v2 版本，目前只有 iOS 基础库 2.22.0 以上支持 */
      v2
    }
    /** 跟踪配置 */
    interface Track {
      /** 平面跟踪配置 */
      plane: Plane
    }
    /** 平面跟踪配置 */
    interface Plane {
      /** 平面跟踪配置模式 */
      mode: keyof PlaneMode
    }
    /** 平面跟踪配置模式合法值 */
    interface PlaneMode {
      /** 检测横向平面 */
      1
      /** 检测纵向平面，只有 v2 版本支持 */
      2
      /** 检测横向和纵向平面，只有 v2 版本支持 */
      3
    }
  }

  /** anchor 对象，只有 v2 版本支持
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKAnchor.html
   */
  interface VKAnchor {
    /** 唯一标识 */
    id: number
    /** 类型 */
    type: keyof VKAnchor.Type
    /** 包含位置、旋转、放缩信息的矩阵，以列为主序 */
    transform: Float32Array
    /** 尺寸，只有平面 anchor 支持 */
    size: VKAnchor.Size
    /** 方向，只有平面 anchor 支持 */
    alignment: number
  }
  namespace VKAnchor {
    /** anchor 对象类型合法值 */
    interface Type {
      /** 平面 */
      0
    }
    /** anchor 对象类型合法值 */
    interface Size {
      /** 宽度 */
      width: number
      /** 高度 */
      height: number
    }
  }

  interface Origin {
    /** 横坐标 */
    x: number
    /** 纵坐标 */
    y: number
  }
  interface Size {
    /** 宽度 */
    width: number
    /** 高度 */
    height: number
  }
  interface Point {
    /** 横坐标 */
    x: number
    /** 纵坐标 */
    y: number
  }

  /** 人体 anchor
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKBodyAnchor.html
   */
  interface VKBodyAnchor {
    /** 唯一标识 */
    id: number
    /** 类型 */
    type: keyof VKBodyAnchor.Type
    /** 识别序号 */
    detectId: number
    /** 相对视窗的尺寸，取值范围为 [0, 1]，0 为左/上边缘，1 为右/下边缘 */
    size: Size
    /** 相对视窗的位置信息，取值范围为 [0, 1]，0 为左/上边缘，1 为右/下边缘 */
    origin: Origin
    /** 关键点的置信度 */
    confidence: number[]
    /** 关键点 */
    points: Point[]
    /** 总体置信值 */
    score: number
  }
  namespace VKBodyAnchor {
    interface Type {
      /** 人体 */
      5
    }
  }
  
  /** depth anchor
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKDepthAnchor.html
   */
  interface VKDepthAnchor {
    /** 唯一标识 */
    id: number
    /** 类型 */
    type: keyof VKDepthAnchor.Type
    /** 相对视窗的尺寸，取值范围为 [0, 1]，0 为左/上边缘，1 为右/下边缘 */
    size: Size
    /** 包含深度信息的数组 */
    depthArray: number[]
  }
  namespace VKDepthAnchor {
    interface Type {
      /** DEPTH */
      8
    }
  }

  /** 人脸 anchor
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFaceAnchor.html
   */
  interface VKFaceAnchor {
    /** 唯一标识 */
    id: number
    /** 类型 */
    type: keyof VKFaceAnchor.Type
    /** 识别序号 */
    detectId: number
    /** 相对视窗的位置信息，取值范围为 [0, 1]，0 为左/上边缘，1 为右/下边缘 */
    origin: Origin
    /** 相对视窗的尺寸，取值范围为 [0, 1]，0 为左/上边缘，1 为右/下边缘 */
    size: Size
    /** 人脸 106 个关键点的坐标 */
    points: Point[]
    /** 人脸角度信息 */
    angle: number[]
    /** 关键点的置信度 */
    confidence: number
  }
  namespace VKFaceAnchor {
    interface Type {
      /** 人脸 */
      3
    }
  }
  
  /** 手势 anchor
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKHandAnchor.html
   */
  interface VKHandAnchor {
    /** 唯一标识 */
    id: number
    /** 类型 */
    type: keyof VKHandAnchor.Type
    /** 识别序号 */
    detectId: number
    /** 相对视窗的尺寸，取值范围为 [0, 1]，0 为左/上边缘，1 为右/下边缘 */
    size: Size
    /** 相对视窗的位置信息，取值范围为 [0, 1]，0 为左/上边缘，1 为右/下边缘 */
    origin: Origin
    /** 关键点的置信度 */
    confidence: number[]
    /** 关键点 */
    points: Point[]
    /** 总体置信值 */
    score: number
    /** 手势分类, 返回整数-1到18, -1表示无效手势 */
    gesture: VKHandAnchor.Gesture
  }
  namespace VKHandAnchor {
    interface Type {
      /** 手势 */
      7
    }
    enum Gesture {
      /** 无效手势 */
      INVALID = -1,
      /**单手比心 */
      0,
      /** 布（数字5）*/
      1,
      /** 剪刀（数字2） */
      2,
      /** 握拳 */
      3,
      /** 数字1 */
      4,
      /** 热爱 */
      5,
      /** 点赞 */
      6,
      /** 数字3 */
      7,
      /** 摇滚 */
      8,
      /** 数字6 */
      9,
      /** 数字8 */
      10,
      /** 双手抱拳（恭喜发财） */
      11,
      /** 数字4 */
      12,
      /** 比ok */
      13,
      /** 不喜欢（踩） */
      14,
      /** 双手比心 */
      15,
      /** 祈祷（双手合十） */
      16,
      /** 双手抱拳 */
      17,
      /** 无手势动作 */
      18,
    }
  }

  /** marker anchor
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKMarkerAnchor.html
   */
  interface VKMarkerAnchor {
    /** 唯一标识 */
    id: number
    /** 类型 */
    type: keyof VKMarkerAnchor.Type
    /** 包含位置、旋转、放缩信息的矩阵，以列为主序 */
    transform: Float32Array
    /** marker id */
    markerId: number
    /** 图片路径 */
    path: string
  }
  namespace VKMarkerAnchor {
    interface Type {
      /** marker */
      1
    }
  }

  /** OCR anchor
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKOCRAnchor.html
   */
  interface VKOCRAnchor {
    /** 唯一标识 */
    id: number
    /** 类型 */
    type: keyof VKOCRAnchor.Type
    /** 识别的文字结果 */
    text: string
  }
  namespace VKOCRAnchor {
    interface Type {
      /** OCR */
      6
    }
  }

  /** OSD anchor
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKOSDAnchor.html
   */
  interface VKOSDAnchor {
    /** 唯一标识 */
    id: number
    /** 类型 */
    type: keyof VKOSDAnchor.Type
    /** marker id */
    markerId: number
    /** 相对视窗的尺寸，取值范围为 [0, 1]，0 为左/上边缘，1 为右/下边缘*/
    size: Size
    /** 图片路径 */
    path: string
    /** 相对视窗的位置信息，取值范围为 [0, 1]，0 为左/上边缘，1 为右/下边缘 */
    origin: Origin
  }
  namespace VKOSDAnchor {
    interface Type {
      /** OSD */
      2
    }
  }

  /** 平面 anchor，只有 v2 版本支持
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKPlaneAnchor.html
   */
  interface VKPlaneAnchor {
    /** 唯一标识 */
    id: number
    /** 类型 */
    type: keyof VKPlaneAnchor.Type
    /** 包含位置、旋转、放缩信息的矩阵，以列为主序 */
    transform: Float32Array
    /** 尺寸 */
    size: Size
    /** 方向 */
    alignment: number
  }

  namespace VKPlaneAnchor {
    interface Type {
      /** 平面 */
      0
    }
  }

  /** 相机对象
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKCamera.html
   */
  interface VKCamera {
    /** 视图矩阵 */
    viewMatrix: Float32Array
    /** 相机内参，只有 v2 版本支持 */
    intrinsics: Float32Array
    /** 获取投影矩阵
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKCamera.getProjectionMatrix.html
     */
    getProjectionMatrix (
      /** 近视点 */
      near: number,
      /** 远视点 */
      far: number
    ): Float32Array
  }

  /** vision kit 会话对象
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFrame.html
   */
  interface VKFrame {
    /** 生成时间 */
    timestamp: number
    /** 相机对象 */
    camera: VKCamera
    /** 获取当前帧纹理，目前只支持 YUV 纹理
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFrame.getCameraTexture.html
     */
    getCameraTexture(ctx: WebGLRenderingContext): VKFrame.getCameraTextureResult
    /** 获取当前帧 rgba buffer。iOS 端微信在 v8.0.20 开始支持，安卓端微信在 v8.0.30 开始支持。
     *  按 aspect-fill 规则裁剪，此接口要求在创建 VKSession 对象时必须传入 gl 参数。
     *  此接口仅建议拿来做帧分析使用，上屏请使用 getCameraTexture 来代替。
     *  @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFrame.getCameraBuffer.html
     */
    getCameraBuffer(widht: number, height: number): ArrayBuffer
    /** 获取纹理调整矩阵。默认获取到的纹理是未经裁剪调整的纹理，此矩阵可用于在着色器中根据帧对象尺寸对纹理进行裁剪
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFrame.getDisplayTransform.html
     */
    getDisplayTransform(): Float32Array
  }

  namespace VKFrame {
    /** 帧纹理对象 */
    interface getCameraTextureResult {
      /** Y 分量纹理 */
      yTexture: WebGLTexture
      /** UV 分量纹理 */
      uvTexture: WebGLTexture
    }
  }

  /** vision kit 会话对象
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.html
   */
  interface VKSession {
    /** 会话状态 */
    state: keyof VKSession.State
    /** 会话配置 */
    config: VKSession.Config
    /** 相机尺寸 */
    cameraSize: VKSession.Size
    /** 添加一个 marker，要求调 Taro.createVKSession 时传入的 track.marker 为 true
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.addMarker.html
     */
    addMarker(
      /** 图片路径，目前只支持本地用户图片 */
      path: string
    ): number
    /** 添加一个 OSD marker（one-shot detection marker），要求调 Taro.createVKSession 时传入的 track.OSD 为 true
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.addOSDMarker.html
     */
    addOSDMarker(
      /** 图片路径，目前只支持本地用户图片 */
      path: string
    ): number
    /** 取消由 requestAnimationFrame 添加到计划中的动画帧请求
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.cancelAnimationFrame.html
     */
    cancelAnimationFrame(requestID: number): void
    /** 销毁会话
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.destroy.html
     */
    destroy(): void
    /** 静态图像人体关键点检测。当 Taro.createVKSession 参数传入 {track: {body: {mode: 2} } } 时可用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.detectBody.html
     */
    detectBody(option: VKSession.DetectBodyOption): void
    /** 深度识别。当 Taro.createVKSession 参数传入 {track: {depth: {mode: 2} } } 时可用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.detectDepth.html
     */
    detectDepth(option: VKSession.DetectDepthOption): void
    /** 静态图像人脸关键点检测。当 Taro.createVKSession 参数传入 {track: {face: {mode: 2} } } 时可用。安卓微信8.0.25开始支持，iOS微信8.0.24开始支持。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.detectFace.html
     */
    detectFace(option: VKSession.DetectFaceOption): void
    /** 静态图像手势关键点检测。当 Taro.createVKSession 参数传入 {track: {hand: {mode: 2} } } 时可用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.detectHand.html
     */
    detectHand(option: VKSession.DetectHandOption): void
    /** 获取所有 marker，要求调 Taro.createVKSession 时传入的 track.marker 为 true
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.getAllMarker.html
     */
    getAllMarker(): VKSession.IMarker[]
    /** 获取所有 OSD marker，要求调 Taro.createVKSession 时传入的 track.OSD 为 true
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.getAllOSDMarker.html
     */
    getAllOSDMarker(): VKSession.IOSDMarker[]
    /** 获取帧对象，每调用一次都会触发一次帧分析过程
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.getVKFrame.html
     */
    getVKFrame(
     /** 宽度 */
     width: number,
     /** 高度 */
     height: number
    ): VKFrame
    /** 触摸检测，v1 版本只支持单平面（即 hitTest 生成一次平面后，后续 hitTest 均不会再生成平面，而是以之前生成的平面为基础进行检测）。
     *
     * 如果需要重新识别其他平面，可以在调用此方法时将 reset 参数置为 true。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.hitTest.html
     */
    hitTest(
     /** 相对视窗的横坐标，取值范围为 [0, 1]，0 为左边缘，1 为右边缘 */
     x: number,
     /** 相对视窗的纵坐标，取值范围为 [0, 1]，0 为上边缘，1 为下边缘 */
     y: number,
     /** 是否需要重新识别其他平面，v2 版本不再需要此参数 */
     reset?: boolean
    ): VKSession.hitTestResult[]
    /** 取消监听会话事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.off.html
     */
    off(
     /** 事件名称 */
     eventName: string,
     /** 事件监听函数 */
     fn: TaroGeneral.EventCallback
    ): void
    /** 监听会话事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.on.html
     */
    on(
     /** 事件名称 */
     eventName: string,
     /** 事件监听函数 */
     fn: TaroGeneral.EventCallback
    ): void
    /** 删除一个 marker，要求调 Taro.createVKSession 时传入的 track.marker 为 true
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.removeMarker.html
     */
    removeMarker(markerId: number): number
    /** 删除一个 OSD marker，要求调 Taro.createVKSession 时传入的 track.OSD 为 true
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.removeOSDMarker.html
     */
    removeOSDMarker(markerId: number): number
    /** 在下次进行重绘时执行。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.requestAnimationFrame.html
     */
    requestAnimationFrame(
     /** 执行函数 */
     callback: TaroGeneral.TFunc
    ): number
    /** 静态图像 OCR 检测。当 Taro.createVKSession 参数传入 {track: {OCR: {mode: 2} } } 时可用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.runOCR.html
     */
    runOCR(): void
    /** 开启会话。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.start.html
     */
    start(
     /** 开启会话回调 */
     callback: (status: keyof VKSession.StartStatus) => void
    ): void
    /** 停止会话。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.stop.html
     */
    stop(): void
    /** 开启 3D 模式
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.update3DMode.html
     */
    update3DMode(open3d: boolean): void
    /** 更新 OSD 识别精确度，要求调 Taro.createVKSession 时传入的 track.OSD 为 true
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.updateOSDThreshold.html
     */
    updateOSDThreshold(threshold: number): void
  }
  namespace VKSession {
    /** state 的合法值 */
    interface State {
      /** 不可用 */
      0
      /** 运行中 */
      1
      /** 暂停中 */
      2
      /** 初始化中 */
      3
    }
    /** 会话配置 */
    interface Config {
      /** 不可用 */
      version: keyof version
      /** 运行中 */
      track: track
      /** marker 跟踪配置，基础库(3.0.0)开始允许同时支持v2的水平面检测能力 */
      marker: boolean
      /** OSD 跟踪配置 */
      OSD: boolean
      /** 深度识别配置 */
      depth: IDepth
      /** 人脸检测配置。安卓微信8.0.25开始支持，iOS微信8.0.24开始支持。 */
      face: IFace
      /** OCR 检测配置。 */
      OCR: IOCR
      /** 人体检测配置。 */
      body: IBody
      /** 手势检测配置。 */
      hand: IHand
      /** 提供基础AR功能，输出相机旋转的3个自由度的位姿，利用手机陀螺仪传感器，实现快速稳定的AR定位能力，适用于简单AR场景。 */
      threeDof: boolean
      /** 绑定的 WebGLRenderingContext 对象 */
      gl: WebGLRenderingContext
    }
    /** vision kit 版本 */
    interface version {
      /** 旧版本 */
      v1
      /** v2 版本，目前只有 iOS 基础库 2.22.0 以上支持 */
      v2
    }
    /** 跟踪配置 */
    interface track {
      /** 平面跟踪配置 */
      plane: plane
    }
    /** 平面跟踪配置 */
    interface plane {
      /** 平面跟踪配置模式 */
      mode: keyof PlaneMode
    }
    /** 平面跟踪配置模式合法值 */
    interface PlaneMode {
      /** 检测横向平面 */
      1
      /** 检测纵向平面，只有 v2 版本支持 */
      2
      /** 检测横向和纵向平面，只有 v2 版本支持 */
      3
    }
    /** 深度识别配置 */
    interface IDepth {
      mode: keyof DepthMode
    }
    interface DepthMode {
      /** 通过摄像头实时检测 */
      1
      /** 静态图片检测 */
      2
    }
    /** 人脸检测模式 */
    interface IFace {
      mode: keyof FaceMode
    }
    interface FaceMode {
      /** 通过摄像头实时检测 */
      1
      /** 静态图片检测 */
      2
    }
    /** OCR 检测配置 */
    interface IOCR {
      mode: keyof OCRMode
    }
    interface OCRMode {
      /** 通过摄像头实时检测 */
      1
      /** 静态图片检测 */
      2
    }
    /** 人体检测模式 */
    interface IBody {
      mode: keyof BodyMode
    }
    interface BodyMode {
      /** 通过摄像头实时检测 */
      1
      /** 静态图片检测 */
      2
    }
    /** 手势检测配置 */
    interface IHand {
      mode: keyof HandMode
    }
    interface HandMode {
      /** 通过摄像头实时检测 */
      1
      /** 静态图片检测 */
      2
    }
    /** 相机尺寸 */
    interface Size {
      /** 宽度 */
      width: number
      /** 高度 */
      height: number
    }
    interface DetectBodyOption {
      /** 人脸图像像素点数据，每四项表示一个像素点的 RGBA */
      frameBuffer: ArrayBuffer
      /** 图像宽度 */
      width: number
      /** 图像高度 */
      height: number
      /** 评分阈值。正常情况传入 0.8 即可。默认值 0.8 */
      scoreThreshold?: number
      /** 图像源类型。正常情况传入 1 即可。当输入的图片是来自一个连续视频的每一帧图像时，sourceType 传入 0 会得到更优的效果。默认值1 */
      sourceType?: keyof ISourceType
    }
    /** 图像源类型。 */
    interface ISourceType {
      /** 表示输入的图片是随机的图片 */
      1
      /** 表示输入的图片是来自一个连续视频的每一帧图像 */
      0
    }
    interface DetectDepthOption {
      /** 人需要识别深度的图像像素点数据，每四项表示一个像素点的 RGBA */
      frameBuffer: ArrayBuffer
      /** 图像宽度 */
      width: number
      /** 图像高度 */
      height: number
    }
    interface DetectFaceOption {
      /** 人脸图像像素点数据，每四项表示一个像素点的 RGBA */
      frameBuffer: ArrayBuffer
      /** 图像宽度 */
      width: number
      /** 图像高度 */
      height: number
      /** 评分阈值。正常情况传入 0.8 即可。默认值 0.8 */
      scoreThreshold?: number
      /** 图像源类型。正常情况传入 1 即可。当输入的图片是来自一个连续视频的每一帧图像时，sourceType 传入 0 会得到更优的效果。默认值1 */
      sourceType?: keyof ISourceType
      /** 算法模型类型。正常情况传入 1 即可。0、1、2 分别表示小、中、大模型，模型越大识别准确率越高，但资源占用也越高。建议根据用户设备性能进行选择。 */
      modelModel?: keyof IModelModel
    }
    interface IModelModel {
      /** 小模型 */
      0
      /** 中模型 */
      1
      /** 大模型 */
      2
    }
    interface DetectHandOption {
      /** 人脸图像像素点数据，每四项表示一个像素点的 RGBA */
      frameBuffer: ArrayBuffer
      /** 图像宽度 */
      width: number
      /** 图像高度 */
      height: number
      /** 评分阈值。正常情况传入 0.8 即可。默认值0.8 */
      scoreThreshold?: number
      /** 算法检测模式 */
      algoMode?: keyof IAlgoMode
    }
    interface IAlgoMode {
      /** 检测模式，输出框和点 */
      0
      /** 手势模式，输出框和手势分类 */
      1
      /** 结合0和1模式，输出框、点、手势分类 */
      2
    }
    interface IMarker {
      /** marker id */
      markerId: number
      /** 图片路径 */
      path: string
    }
    interface IOSDMarker {
      /** marker id */
      markerId: number
      /** 图片路径 */
      path: string
    }
    interface IRunOCROption {
      /** 待识别图像的像素点数据，每四项表示一个像素点的 RGBA */
      frameBuffer: ArrayBuffer
      /** 图像宽度 */
      width: number
      /** 图像高度 */
      height: number
    }
    /** hitTest 检测结果 */
    interface hitTestResult {
      /** 包含位置、旋转、放缩信息的矩阵，以列为主序 */
      transform: Float32Array
    }

    /** start status 的合法值 */
    interface StartStatus {
      /** 成功 */
      0
      /** 系统错误 */
      2000000
      /** 参数错误 */
      2000001
      /** 设备不支持 */
      2000002
      /** 系统不支持 */
      2000003
      /** 会话不可用 */
      2003000
      /** 未开启系统相机权限 */
      2003001
      /** 未开启小程序相机权限 */
      2003002
    }
  }

  interface TaroStatic {
    /** 判断支持版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/wx.isVKSupport.html
     */
     isVKSupport (version: keyof isVKSupport.Version): boolean /** 是否支持对应版本的 vision kit */

    /** 创建 vision kit 会话对象
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/wx.createVKSession.html
     */
    createVKSession (version: keyof createVKSession.Version): VKSession /** vision kit 会话对象 */
  }
}

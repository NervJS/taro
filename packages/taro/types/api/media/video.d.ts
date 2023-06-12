import Taro from '../../index'

declare module '../../index' {
  namespace saveVideoToPhotosAlbum {
    interface Option {
      /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace openVideoEditor {
    interface Option {
      /** 视频源的路径，只支持本地路径 */
      filePath: string
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 剪辑后生成的视频文件的时长，单位毫秒（ms） */
      duration: number
      /** 剪辑后生成的视频文件大小，单位字节数（byte） */
      size: number
      /** 编辑后生成的视频文件的临时路径 */
      tempFilePath: string
      /** 编辑后生成的缩略图文件的临时路径 */
      tempThumbPath: string
    }
  }

  namespace getVideoInfo {
    interface Option {
      /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 */
      src: string
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 画面方向 */
      orientation: keyof Orientation
      /** 视频格式 */
      type: string
      /** 视频长度 */
      duration: number
      /** 视频大小，单位 kB */
      size: number
      /** 视频的长，单位 px */
      height: number
      /** 视频的宽，单位 px */
      width: number
      /** 视频帧率 */
      fps: number
      /** 视频码率，单位 kbps */
      bitrate: number
    }
    interface Orientation {
      /** 默认 */
      up
      /** 180 度旋转 */
      down
      /** 逆时针旋转 90 度 */
      left
      /** 顺时针旋转 90 度 */
      right
      /** 同 up，但水平翻转 */
      'up-mirrored'
      /** 同 down，但水平翻转 */
      'down-mirrored'
      /** 同 left，但垂直翻转 */
      'left-mirrored'
      /** 同 right，但垂直翻转 */
      'right-mirrored'
    }
  }

  /** VideoContext 实例，可通过 [Taro.createVideoContext](./createVideoContext) 获取。
   *
   * VideoContext 通过 id 跟一个 video 组件绑定，操作对应的 video 组件。
   * @supported weapp, h5, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.html
   */
  interface VideoContext {
    /** 退出后台音频播放模式。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.exitBackgroundPlayback.html
     */
    exitBackgroundPlayback(): void
    /** 退出全屏
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.exitFullScreen.html
     */
    exitFullScreen(): void
    /** 退出小窗，该方法可在任意页面调用
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.exitPictureInPicture.html
     */
    exitPictureInPicture(option: VideoContext.ExitPictureInPictureOption): void
    /** 隐藏状态栏，仅在iOS全屏下有效
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.hideStatusBar.html
     */
    hideStatusBar(): void
    /** 暂停视频
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.pause.html
     */
    pause(): void
    /** 播放视频
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.play.html
     */
    play(): void
    /** 设置倍速播放
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.playbackRate.html
     */
    playbackRate(
      /** 倍率，支持 0.5/0.8/1.0/1.25/1.5，2.6.3 起支持 2.0 倍速 */
      rate: number,
    ): void
    /** 进入后台音频播放模式。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.requestBackgroundPlayback.html
     */
    requestBackgroundPlayback(): void
    /** 进入全屏
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.requestFullScreen.html
     */
    requestFullScreen(option: VideoContext.RequestFullScreenOption): void
    /** 跳转到指定位置
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.seek.html
     */
    seek(
      /** 跳转到的位置，单位 s */
      position: number,
    ): void
    /** 发送弹幕
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.sendDanmu.html
     */
    sendDanmu(
      /** 弹幕内容 */
      data: VideoContext.Danmu,
    ): void
    /** 显示状态栏，仅在iOS全屏下有效
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.showStatusBar.html
     */
    showStatusBar(): void
    /** 停止视频
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.stop.html
     */
    stop(): void
  }

  namespace VideoContext {
    interface ExitPictureInPictureOption {
      /** 接口调用成功的回调函数 */
      success?: (result: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
    interface RequestFullScreenOption {
      /** 设置全屏时视频的方向，不指定则根据宽高比自动判断。
       *
       * 可选值：
       * - 0: 正常竖向;
       * - 90: 屏幕逆时针90度;
       * - -90: 屏幕顺时针90度; */
      direction?: 0 | 90 | -90
    }
    /** 弹幕内容 */
    interface Danmu {
      /** 弹幕文字 */
      text: string
      /** 弹幕颜色 */
      color?: string
    }
  }

  namespace compressVideo {
    interface Option {
      /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 */
      src: string
      /** 压缩质量 */
      quality: keyof Quality
      /** 码率，单位 kbps */
      bitrate: number
      /** 帧率 */
      fps: number
      /** 相对于原视频的分辨率比例，取值范围(0, 1] */
      resolution: number
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 压缩后的临时文件地址 */
      tempFilePath: string
      /** 压缩后的大小，单位 kB */
      size: number
    }
    interface Quality {
      /** 低 */
      low
      /** 中 */
      medium
      /** 高 */
      high
    }
  }

  namespace chooseVideo {
    interface Option {
      /** 默认拉起的是前置或者后置摄像头。部分 Android 手机下由于系统 ROM 不支持无法生效
       * @default "back"
       * @supported weapp, h5
       */
      camera?: keyof Camera
      /** 是否压缩所选择的视频文件
       * @default true
       * @supported weapp
       */
      compressed?: boolean
      /** 拍摄视频最长拍摄时间，单位秒
       * @default 60
       * @supported weapp
       */
      maxDuration?: number
      /** 视频选择的来源
       * @default ['album', 'camera']
       * @supported weapp, h5
       */
      sourceType?: Array<keyof sourceType>
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 选定视频的临时文件路径 */
      tempFilePath: string
      /** 选定视频的时间长度 */
      duration: number
      /** 选定视频的数据量大小 */
      size: number
      /** 返回选定视频的高度 */
      height: number
      /** 返回选定视频的宽度 */
      width: number
      /** 调用结果 */
      errMsg: string
    }
    interface Camera {
      /** 默认拉起后置摄像头 */
      back
      /** 默认拉起前置摄像头 */
      front
    }
    interface sourceType {
      /** 从相册选择视频 */
      album
      /** 使用相机拍摄视频 */
      camera
    }
  }

  namespace chooseMedia {
    interface Option {
      /** 最多可以选择的文件个数
       * @default 9
       * @supported weapp, h5
       */
      count?: number
      /** 文件类型
       * @default ['image', 'video']
       * @supported weapp, h5
       */
      mediaType?: Array<keyof mediaType>
      /** 图片和视频选择的来源
       * @default ['album', 'camera']
       * @supported weapp, h5
       */
      sourceType?: Array<keyof sourceType>
      /** 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 60s 之间
       * @default 10
       * @supported weapp
       */
      maxDuration?: number
      /** 是否压缩所选文件
       * @default ['original', 'compressed']
       * @supported weapp
       */
      sizeType?: Array<'original' | 'compressed'>
      /** 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头
       * @default "back"
       * @supported weapp, h5
       */
      camera?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 用来上传的input元素ID
       * @supported h5
       */
      mediaId?: string
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 本地临时文件列表 */
      tempFiles: ChooseMedia[]
      /** 文件类型，有效值有 image 、video、mix */
      type: string
    }
    /** 本地临时文件列表 */
    interface ChooseMedia {
      /** 本地临时文件路径 (本地路径) */
      tempFilePath: string
      /** 本地临时文件大小，单位 B */
      size: number
      /** 视频的时间长度 */
      duration: number
      /** 视频的高度 */
      height: number
      /** 视频的宽度 */
      width: number
      /** 视频缩略图临时文件路径 */
      thumbTempFilePath: string
      /** 选择的文件的类型 */
      fileType: string
      /** 原始的浏览器 File 对象
       * @supported h5
       */
      originalFileObj?: File
    }
    interface mediaType {
      /** 只能拍摄视频或从相册选择视频 */
      video
      /** 只能拍摄图片或从相册选择图片 */
      image
      /** 可同时选择图片和视频 */
      mix
    }
    interface sourceType {
      /** 从相册选择 */
      album
      /** 使用相机拍摄 */
      camera
    }
    interface camera {
      /** 使用后置摄像头 */
      back
      /** 使用前置摄像头 */
      front
    }
  }

  interface TaroStatic {
    /**
     * 保存视频到系统相册。支持mp4视频格式。需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.writePhotosAlbum
     *
     * **Bug & Tip：**
     *
     * 1.  `tip`: camera 参数在部分 Android 手机下由于系统 ROM 不支持无法生效
     * @supported weapp, h5, rn
     * @example
     ```tsx
     * Taro.saveVideoToPhotosAlbum({
     *   filePath: 'file://xxx',
     *   success: function (res) {
     *     console.log(res.errMsg)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html
     */
    saveVideoToPhotosAlbum(option: saveVideoToPhotosAlbum.Option): Promise<TaroGeneral.CallbackResult>

    /** 打开视频编辑器
     * @supported weapp
     * @example
     * ```tsx
     * Taro.openVideoEditor({
     *  filePath: ''
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.openVideoEditor.html
     */
    openVideoEditor(option: openVideoEditor.Option): Promise<openVideoEditor.SuccessCallbackResult>

    /** 获取视频详细信息
     * @supported weapp
     * @example
     * ```tsx
     * Taro.downloadFile({
     *   url: 'https://mock.taro.org/mock_video.mp4',
     *   success(res) {
     *     Taro.getVideoInfo({
     *       src: res.tempFilePath,
     *       success (res) {
     *         console.log('获取文件地址成功')
     *         console.log(res)
     *       },
     *       fail (res) {
     *         console.log('获取文件地址失败')
     *         console.log(res)
     *       },
     *       complete (res) {
     *         console.log('获取文件地址')
     *       }
     *     })
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.getVideoInfo.html
     */
    getVideoInfo(option: getVideoInfo.Option): Promise<getVideoInfo.SuccessCallbackResult>

    /** 创建 video 上下文 VideoContext 对象。
     * @supported weapp, h5, rn
     * @example
     * ```tsx
     * videoContext = Taro.createVideoContext('myVideo')
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.createVideoContext.html
     */
    createVideoContext(
      /** video 组件的 id */
      id: string,
      /** 在自定义组件下，当前组件实例的this，以操作组件内 video 组件 */
      component?: TaroGeneral.IAnyObject,
    ): VideoContext

    /** 压缩视频接口。
     * 开发者可指定压缩质量 `quality` 进行压缩。当需要更精细的控制时，可指定 `bitrate`、`fps`、和 `resolution`，当 `quality` 传入时，这三个参数将被忽略。原视频的相关信息可通过 [getVideoInfo](/docs/apis/media/video/getVideoInfo) 获取。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.chooseVideo({
     *   sourceType: ['album', 'camera'],
     *   maxDuration: 60,
     *   camera: 'back',
     *   compressed: false,
     *   success (res) {
     *     Taro.compressVideo({
     *       src: res.tempFilePath,
     *       quality: quality,
     *       bitrate: 1032,
     *       fps: 24,
     *       resolution:0.5,
     *       success (res) {
     *         console.log("压缩成功")
     *       },
     *       fail (err) {
     *         console.log("压缩失败")
     *       }
     *     })
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.compressVideo.html
     */
    compressVideo(option: compressVideo.Option): Promise<compressVideo.SuccessCallbackResult>

    /** 拍摄视频或从手机相册中选视频。
     * @supported weapp, h5, rn
     * @example
     * ```tsx
     * Taro.chooseVideo({
     *   sourceType: ['album','camera'],
     *   maxDuration: 60,
     *   camera: 'back',
     *   success: function (res) {
     *     console.log(res.tempFilePath)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseVideo.html
     */
    chooseVideo(option: chooseVideo.Option): Promise<chooseVideo.SuccessCallbackResult>

    /** 拍摄或从手机相册中选择图片或视频。
     * @supported weapp, h5
     * @example
     * ```tsx
     * Taro.chooseMedia({
     *   count: 9,
     *   mediaType: ['image','video'],
     *   sourceType: ['album', 'camera'],
     *   maxDuration: 30,
     *   camera: 'back',
     *   success: (res) => {
     *     console.log(res.tempFiles)
     *     console.log(res.type)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html
     */
    chooseMedia(option: chooseMedia.Option): Promise<chooseMedia.SuccessCallbackResult>
  }
}

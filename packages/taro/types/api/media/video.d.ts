declare namespace Taro {
  namespace saveVideoToPhotosAlbum {
    interface Option {
      /** 视频文件路径，可以是临时文件路径也可以是永久文件路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /**
   * 保存视频到系统相册。支持mp4视频格式。需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.writePhotosAlbum
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: camera 参数在部分 Android 手机下由于系统 ROM 不支持无法生效
   * @supported weapp, rn
   * @example
   ```tsx
   * Taro.saveVideoToPhotosAlbum({
   *   filePath: 'wxfile://xxx'
   *   success: function (res) {
   *     console.log(res.errMsg)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html
   */
  function saveVideoToPhotosAlbum(option: saveVideoToPhotosAlbum.Option): Promise<General.CallbackResult>

  /** 创建 video 上下文 VideoContext 对象。
   * @supported weapp, h5
   * @example
   * ```tsx
   * videoContext = Taro.createVideoContext('myVideo')
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.createVideoContext.html
   */
  function createVideoContext(
    /** video 组件的 id */
    id: string,
    /** 在自定义组件下，当前组件实例的this，以操作组件内 video 组件 */
    component?: General.IAnyObject,
  ): VideoContext

  /** 拍摄视频或从手机相册中选视频。
   * @supported weapp, rn
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
  function chooseVideo(option: chooseVideo.Option): Promise<void>

  namespace chooseVideo {
    interface Option {
      /** 默认拉起的是前置或者后置摄像头。部分 Android 手机下由于系统 ROM 不支持无法生效 */
      camera?: keyof camera
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 是否压缩所选择的视频文件 */
      compressed?: boolean
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 拍摄视频最长拍摄时间，单位秒 */
      maxDuration?: number
      /** 视频选择的来源 */
      sourceType?: Array<keyof sourceType>
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 选定视频的时间长度 */
      duration: number
      /** 返回选定视频的高度 */
      height: number
      /** 选定视频的数据量大小 */
      size: number
      /** 选定视频的临时文件路径 */
      tempFilePath: string
      /** 返回选定视频的宽度 */
      width: number
      /** 调用结果 */
      errMsg: string
    }
    interface camera {
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

  interface VideoContext {
    /** 退出全屏
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.exitFullScreen.html
     */
    exitFullScreen(): void
    /** 隐藏状态栏，仅在iOS全屏下有效
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.hideStatusBar.html
     */
    hideStatusBar(): void
    /** 暂停视频
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.pause.html
     */
    pause(): void
    /** 播放视频
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.play.html
     */
    play(): void
    /** 设置倍速播放
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.playbackRate.html
     */
    playbackRate(
      /** 倍率，支持 0.5/0.8/1.0/1.25/1.5，2.6.3 起支持 2.0 倍速 */
      rate: number,
    ): void
    /** 进入全屏
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.requestFullScreen.html
     */
    requestFullScreen(option: VideoContext.RequestFullScreenOption): void
    /** 跳转到指定位置
     * @supported weapp
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
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.stop.html
     */
    stop(): void
  }

  namespace VideoContext {
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
}

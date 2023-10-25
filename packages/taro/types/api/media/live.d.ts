import Taro from '../../index'

declare module '../../index' {
  namespace LivePusherContext {
    interface PauseOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface PauseBGMOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface PlayBGMOption {
      /** 加入背景混音的资源地址 */
      url: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface ResumeOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface ResumeBGMOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SendMessageOption {
      /** SEI消息 */
      msg: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SetBGMVolumeOption {
      /** 音量大小，范围是 0-1 */
      volume: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SetMICVolumeOption {
      /** 音量大小，范围是 0-1 */
      volume: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SnapshotOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface StartOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface StartPreviewOption {
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
    interface StopBGMOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface StopPreviewOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SwitchCameraOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface ToggleTorchOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }
  /** `LivePusherContext` 实例，可通过 `Taro.createLivePusherContext` 获取。
   * `LivePusherContext` 与页面内唯一的 `live-pusher` 组件绑定，操作对应的 `live-pusher` 组件。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.html
   */
  interface LivePusherContext {
    /** 暂停推流
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.pause.html
     */
    pause(option?: LivePusherContext.PauseOption): void
    /** 暂停背景音
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.pauseBGM.html
     */
    pauseBGM(option?: LivePusherContext.PauseBGMOption): void
    /** 播放背景音
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.playBGM.html
     */
    playBGM(option: LivePusherContext.PlayBGMOption): void
    /** 恢复推流
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.resume.html
     */
    resume(option?: LivePusherContext.ResumeOption): void
    /** 恢复背景音
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.resumeBGM.html
     */
    resumeBGM(option?: LivePusherContext.ResumeBGMOption): void
    /** 发送SEI消息
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.sendMessage.html
     */
    sendMessage(option?: LivePusherContext.SendMessageOption): void
    /** 设置背景音音量
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.setBGMVolume.html
     */
    setBGMVolume(option: LivePusherContext.SetBGMVolumeOption): void
    /** 设置麦克风音量
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.setMICVolume.html
     */
    setMICVolume(option: LivePusherContext.SetMICVolumeOption): void
    /** 快照
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.snapshot.html
     */
    snapshot(option?: LivePusherContext.SnapshotOption): void
    /** 开始推流，同时开启摄像头预览
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.start.html
     */
    start(option?: LivePusherContext.StartOption): void
    /** 开启摄像头预览
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.startPreview.html
     */
    startPreview(option?: LivePusherContext.StartPreviewOption): void
    /** 停止推流，同时停止摄像头预览
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.stop.html
     */
    stop(option?: LivePusherContext.StopOption): void
    /** 停止背景音
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.stopBGM.html
     */
    stopBGM(option?: LivePusherContext.StopBGMOption): void
    /** 关闭摄像头预览
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.stopPreview.html
     */
    stopPreview(option?: LivePusherContext.StopPreviewOption): void
    /** 切换前后摄像头
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.switchCamera.html
     */
    switchCamera(option?: LivePusherContext.SwitchCameraOption): void
    /** 切换手电筒
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.toggleTorch.html
     */
    toggleTorch(option?: LivePusherContext.ToggleTorchOption): void
  }
  namespace LivePlayerContext {
    interface ExitCastingOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface ExitFullScreenOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface ExitPictureInPictureOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface MuteOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface PauseOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface PlayOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface ReconnectCastingOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void      
    }
    interface RequestFullScreenOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 设置全屏时的方向
       *
       * 可选值：
       * - 0: 正常竖向;
       * - 90: 屏幕逆时针90度;
       * - -90: 屏幕顺时针90度; */
      direction?: 0 | 90 | -90
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface RequestPictureInPictureOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface ResumeOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SnapshotOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SnapshotSuccessCallbackResult) => void
    }
    interface SnapshotSuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 图片的高度 */
      height: string
      /** 图片文件的临时路径 */
      tempImagePath: string
      /** 图片的宽度 */
      width: string
      /** 调用结果 */
      errMsg: string
    }
    interface StartCastingOption {
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
    interface SwitchCastingOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  /** `LivePlayerContext` 实例，可通过 `Taro.createLivePlayerContext` 获取。
   * `LivePlayerContext` 通过 `id` 跟一个 `live-player` 组件绑定，操作对应的 `live-player` 组件。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.html
   */
  interface LivePlayerContext {
    /** 退出投屏。仅支持在 tap 事件回调内调用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.exitCasting.html
     */
    exitCasting(option?: LivePlayerContext.ExitCastingOption): void
    /** 退出全屏
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.exitFullScreen.html
     */
    exitFullScreen(option?: LivePlayerContext.ExitFullScreenOption): void
    /** 退出小窗，该方法可在任意页面调用
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.exitPictureInPicture.html
     */
    exitPictureInPicture(option?: LivePlayerContext.ExitPictureInPictureOption): void
    /** 静音
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.mute.html
     */
    mute(option?: LivePlayerContext.MuteOption): void
    /** 暂停
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.pause.html
     */
    pause(option?: LivePlayerContext.PauseOption): void
    /** 播放
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.play.html
     */
    play(option?: LivePlayerContext.PlayOption): void
    /** 重连投屏设备。仅支持在 tap 事件回调内调用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.reconnectCasting.html
     */
    reconnectCasting(option?: LivePlayerContext.ReconnectCastingOption): void
    /** 进入全屏
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.requestFullScreen.html
     */
    requestFullScreen(
      option: LivePlayerContext.RequestFullScreenOption,
    ): void
    /** 进入全屏
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.requestPictureInPicture.html
     */
    requestPictureInPicture(
      option: LivePlayerContext.RequestPictureInPictureOption,
    ): void
    /** 恢复
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.resume.html
     */
    resume(option?: LivePlayerContext.ResumeOption): void
    /** 截图
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.snapshot.html
     */
    snapshot(option?: LivePlayerContext.SnapshotOption): void
    /** 开始投屏, 拉起半屏搜索设备。仅支持在 tap 事件回调内调用
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.startCasting.html
     */
    startCasting(option?: LivePlayerContext.StartCastingOption): void
    /** 停止
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.stop.html
     */
    stop(option?: LivePlayerContext.StopOption): void
    /** 切换投屏设备。仅支持在 tap 事件回调内调用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.switchCasting.html
     */
    switchCasting(option?: LivePlayerContext.SwitchCastingOption): void
  }

  interface TaroStatic {
    /** 创建 [live-pusher](/docs/components/media/live-pusher) 上下文 [LivePusherContext](/docs/apis/media/live/LivePusherContext) 对象。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/wx.createLivePusherContext.html
     */
    createLivePusherContext(): LivePusherContext

    /** 创建 [live-player](/docs/components/media/live-player) 上下文 [LivePlayerContext](/docs/apis/media/live/LivePlayerContext) 对象。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/wx.createLivePlayerContext.html
     */
    createLivePlayerContext(
      /** [live-player](/docs/components/media/live-player) 组件的 id */
      id: string,
      /** 在自定义组件下，当前组件实例的this，以操作组件内 [live-player](/docs/components/media/live-player) 组件 */
      component?: TaroGeneral.IAnyObject,
    ): LivePlayerContext
  }
}

declare namespace Taro {
  namespace saveVideoToPhotosAlbum {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 视频文件路径，可以是临时文件路径也可以是永久文件路径
       */
      filePath: string
    }
  }
  /**
   * @since 1.2.0
   *
   * 保存视频到系统相册。需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.writePhotosAlbum
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: camera 参数在部分 Android 手机下由于系统 ROM 不支持无法生效
   *
   * **示例代码：**
   *
   ```javascript
   Taro.saveVideoToPhotosAlbum({
     filePath: 'wxfile://xxx'
     success(res) {
       console.log(res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html
   */
  function saveVideoToPhotosAlbum(OBJECT: saveVideoToPhotosAlbum.Param): Promise<saveVideoToPhotosAlbum.Promised>

  class VideoContext {
    /**
     * 播放
     */
    play(): void
    /**
     * 暂停
     */
    pause(): void
    /**
     * 停止
     *
     * @since 1.7.0
     */
    stop(): void
    /**
     * 跳转到指定位置，单位 s
     */
    seek(position: number): void
    /**
     * 发送弹幕，danmu 包含两个属性 text, color。
     */
    sendDanmu(danmu: { text: string; color: string }): void
    /**
     * 设置倍速播放，支持的倍率有 0.5/0.8/1.0/1.25/1.5
     *
     * @since 1.4.0
     */
    playbackRate(rate: number): void
    /**
     * 进入全屏，可传入{direction}参数（1.7.0起支持），详见video组件文档
     *
     * @since 1.4.0
     */
    requestFullScreen(param: { direction: 0 | 90 | -90 }): void
    /**
     * 退出全屏
     *
     * @since 1.4.0
     */
    exitFullScreen(): void
    /**
     * 显示状态栏，仅在iOS全屏下有效
     *
     * @since 2.1.0
     */
    showStatusBar(): void
    /**
     * 隐藏状态栏，仅在iOS全屏下有效
     *
     * @since 2.1.0
     */
    hideStatusBar(): void
  }
  /**
   * 创建并返回 video 上下文 `videoContext` 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 `<video/>` 组件
   *
   * **videoContext：**
   *
   * `videoContext` 通过 videoId 跟一个 video 组件绑定，通过它可以操作一个 video 组件。
   *
   * **示例代码：**
   *
   ```html
   <view class="section tc">
     <video id="myVideo" src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"   enable-danmu danmu-btn controls></video>
     <view class="btn-area">
       <input bindblur="bindInputBlur"/>
       <button bindtap="bindSendDanmu">发送弹幕</button>
     </view>
   </view>
   ```
   *
   * **示例代码：**
   *
   ```javascript
   function getRandomColor () {
     let rgb = []
     for (let i = 0 ; i < 3; ++i){
       let color = Math.floor(Math.random()   256).toString(16)
       color = color.length == 1 ? '0' + color : color
       rgb.push(color)
     }
     return '#' + rgb.join('')
   }
         Page({
     onReady: function (res) {
       this.videoContext = Taro.createVideoContext('myVideo')
     },
     inputValue: '',
     bindInputBlur: function(e) {
       this.inputValue = e.detail.value
     },
     bindSendDanmu: function () {
       this.videoContext.sendDanmu({
         text: this.inputValue,
         color: getRandomColor()
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.createVideoContext.html
   */
  function createVideoContext(videoId: any, instance?: any): VideoContext

  namespace chooseVideo {
    type Promised = {
      /**
       * 选定视频的临时文件路径
       */
      tempFilePath: string
      /**
       * 选定视频的时间长度
       */
      duration: number
      /**
       * 选定视频的数据量大小
       */
      size: number
      /**
       * 返回选定视频的长
       */
      height: number
      /**
       * 返回选定视频的宽
       */
      width: number
    }
    type Param = {
      /**
       * album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
       */
      sourceType?: string[]
      /**
       * 是否压缩所选的视频源文件，默认值为true，需要压缩
       *
       * @since 1.6.0
       */
      compressed?: boolean
      /**
       * 拍摄视频最长拍摄时间，单位秒。最长支持 60 秒
       */
      maxDuration?: number
    }
  }
  /**
   * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
   *
   * **示例代码：**
   *
   ```html
   <view class="container">
       <video src="{{src}}"></video>
       <button bindtap="bindButtonTap">获取视频</button>
   </view>
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Page({
       bindButtonTap: function() {
           var that = this
           Taro.chooseVideo({
               sourceType: ['album','camera'],
               maxDuration: 60,
         camera: 'back',
               success: function(res) {
                   that.setData({
                       src: res.tempFilePath
                   })
               }
           })
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseVideo.html
   */
  function chooseVideo(OBJECT?: chooseVideo.Param): Promise<chooseVideo.Promised>
}

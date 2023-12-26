import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
  State,
} from '@stencil/core'
import Taro from '@tarojs/taro'
import flvjs from 'flv.js'

import { scene, screenFn } from './utils'
import classNames from 'classnames'

@Component({
  tag: 'taro-live-player-core',
  styleUrl: './style/live-player.scss',
})
export class LivePlayer implements ComponentInterface {
  private player: any
  private type = 'flv'
  private speakerID: string
  private earID: string
  private livePlayerRef: HTMLVideoElement
  private controlsRef: HTMLTaroVideoControlElement
  private videoElement: any
  // 状态枚举
  ONSTATECHANGECODEMSSAGE = {
    // 视频源加载成功
    READY: {
      code: 200,
      message: 'Ready to play',
    },
    // 播放器创建成功
    CREATED: {
      code: 210,
      message: 'Created successfully',
    },
    // 视频已开始播放
    RENDERING: {
      code: 300,
      message: 'Rendering video',
    },
    // 视频正在播放
    PLAYING: {
      code: 310,
      message: 'Playing video',
    },
    // 视频暂停
    PAUSED: {
      code: 320,
      message: 'Paused',
    },
    // 播放出错
    ERROR: {
      code: 400,
      message: 'Error occurred',
    },
    // 播放结束
    ENDED: {
      code: 500,
      message: 'Playback ended',
    },
  }

  // 错误枚举
  ONERRORCODEMSSAGE = {
    DISCONNECTION: {
      code: -2305,
      message: '视频下载过程中网络断开或连接超时',
    },
    NOTGET: {
      code: -2301,
      message: '网络错误，请稍后再试',
    },
    DECODE: {
      code: -2302,
      message: '解码错误或格式错误，请稍后再试',
    },
    INTERIOR: {
      code: -2308,
      message: '播放器内部错误，请稍后再试',
    }
  }

  @Element() el: Element

  /**
   * 要播放的资源地址
   */
  @Prop() src: string
  /**
   * 要播放的视频模式
   */
  @Prop() mode = 'live'
  /**
   * 是否自动播放
   */
  @Prop() autoplay = false
  /**
   * 是否静音播放
   */
  @Prop() muted = false
  /**
   * 画面方向默认竖直
   */
  @Prop() orientation = 'default'
  /**
   * 画面方向默认竖直
   */
  @Prop() soundMode = 'speaker'
  /**
   * 设置小窗模式字符串或者数组
   */
  @Prop() pictureInPictureMode: any = ''
  /**
   * 当跳转到本小程序的其他页面时，是否自动暂停本页面的实时音视频播放
   */
  @Prop() autoPauseIfNavigate = true
  /**
   * 填充模式
   */
  @Prop() objectFit = 'contain'
  /**
   * 最小缓冲区
   */
  @Prop() minCache = 1
  /**
   * 最大缓冲区
   */
  @Prop() maxCache = 3
  /**
   * id
   */
  @Prop() id = ''
  /**
   * 缓冲
   */
  @Prop() iscache = false
  // 全屏状态时间戳
  @State() fullScreenTimestamp = new Date().getTime()
  // 播放状态
  @State() isPlaying = false
  // 次数状态
  @State() isFirst = true
  // 静音状态
  @State() isMute = false
  // 播放按钮
  @State() showCenterPlayBtn = true
  // 全屏按钮
  @State() showFullscreenBtn = true
  // 静音按钮
  @State() showMuteBtn = true
  // 全屏状态
  @State() isFullScreen = false
  // 停止状态
  @State() isStop = false
  // 隐藏缓存
  @State() enableStashBuffer = true
  // 跳帧状态
  @State() isdelta = false
  // 跳帧状态
  @State() cache = 0
  @Event({
    eventName: 'onStateChange',
  })
    onStateChange: EventEmitter

  @Event({
    eventName: 'fullscreenchange',
  })
    onFullScreenChange: EventEmitter

  @Event({
    eventName: 'onAudioVolumeNotify',
  })
    onAudioVolumeNotify: EventEmitter

  @Event({
    eventName: 'onNetStatus',
  })
    onNetStatus: EventEmitter

  @Event({
    eventName: 'onError',
  })
    onError: EventEmitter

  @Event({
    eventName: 'onEnterPictureInPicture',
  })
    onEnterPictureInPicture: EventEmitter

  @Event({
    eventName: 'onLeavePictureInPicture',
  })
    onLeavePictureInPicture: EventEmitter

  async componentDidLoad () {
    if (document.addEventListener) {
      document.addEventListener(screenFn.fullscreenchange, this.handleFullScreenChange)
    }
    if (this.videoElement && scene === 'iOS') {
      // NOTE: iOS 场景下 fullscreenchange 并不会在退出全屏状态下触发，仅 webkitpresentationmodechanged 与 webkitendfullscreen 可替代
      this.videoElement.addEventListener('webkitendfullscreen', this.handleFullScreenChange)
    }
    if (flvjs.isSupported()) {
      this.videoElement = this.el.querySelector('video')
      this.livePlayerRef.addEventListener('volumechange', () => {
        this.onAudioVolumeNotify.emit({})
      })
      // 监听播放器播放结束
      this.livePlayerRef.addEventListener('ended', () => {
        this.onStateChange.emit(this.ONSTATECHANGECODEMSSAGE.ENDED)
      })
      // 静音属性
      if (this.muted && this.videoElement) {
        this.livePlayerRef.muted = this.muted
        this.isMute = true
      }
      // 画面方向
      if (this.orientation === 'vertical' && this.videoElement) {
        this.videoElement.style.transform = 'rotate(90deg)'
        this.videoElement.style.height = 'hidden'
      } else if (this.orientation === 'horizontal' && this.videoElement) {
        this.videoElement.style.width = '100%'
      } else if (this.orientation === 'default' && this.videoElement) {
        this.videoElement.style.width = '100%'
      } else {
        console.error('画面方向设置失败')
      }
      // 画面填充方式
      if (this.objectFit === 'contain' && this.videoElement) {
        this.objectFit = 'contain'
      } else if (this.objectFit === 'fillCrop' && this.videoElement) {
        this.objectFit = 'cover'
      } else {
        console.error('画面填充方式设置失败')
      }
      // 创建播放器
      this.createPlayers()
      this.videoElement.addEventListener('fullscreenchange', (event) => {
        event.stopPropagation()
        const fullScreenTimestamp = new Date().getTime()
        if (fullScreenTimestamp - this.fullScreenTimestamp < 100) {
          return
        }
        this.isFullScreen = !this.isFullScreen
        if (this.isFullScreen) {
          this.onFullScreenChange.emit({
            fullScreen: this.isFullScreen,
            direction: 0,
          })
        } else {
          Taro.eventCenter.trigger('__taroExitFullScreen', {})
          this.onFullScreenChange.emit({
            fullScreen: this.isFullScreen,
            direction: 0,
          })
        }
      })
    }
  }

  // 创建播放器
  createPlayers () {
    const config = {
      enableStashBuffer: this.enableStashBuffer,
      stashInitialSize: this.minCache,
      lazyLoad: true,
      lazyLoadMaxDuration: this.maxCache,
      lazyLoadRecoverDuration: 1,
    }
    const MediaDataSource = {
      type: this.type,
      url: this.src,
      isLive: true,
      cors: true,
    }
    this.player = flvjs.createPlayer(MediaDataSource,config)
    // 创建异常监听
    this.player.on(flvjs.ErrorDetails.NETWORK_EXCEPTION, (type, message, data) => {
      this.onStateChange.emit(this.ONSTATECHANGECODEMSSAGE.ERROR)
      // 处理网络异常的逻辑
      if (type === flvjs.Events.ERROR && data === flvjs.ErrorDetails.NETWORK_EXCEPTION) {
        this.onNetStatus.emit({
          message: message,
          info: data,
          ts: new Date().getTime(),
        })
        this.onError.emit(this.ONERRORCODEMSSAGE.DISCONNECTION)
      } else {
        // 处理其他错误的逻辑
        this.onError.emit(this.ONERRORCODEMSSAGE.INTERIOR)
      }
    })
    this.player.attachMediaElement(this.videoElement)
    this.onStateChange.emit(this.ONSTATECHANGECODEMSSAGE.CREATED)
    this.player.load()
    this.onStateChange.emit(this.ONSTATECHANGECODEMSSAGE.READY)
    if (this.autoplay) {
      this.onStateChange.emit(this.ONSTATECHANGECODEMSSAGE.RENDERING)
      this.onStateChange.emit(this.ONSTATECHANGECODEMSSAGE.PLAYING)
    }
    // 创建错误监听
    this.player.on(flvjs.Events.ERROR, (message) => {
      if (message.type === flvjs.ErrorTypes.NETWORK_ERROR) {
        this.onError.emit({
          detail: this.ONERRORCODEMSSAGE.NOTGET,
          message: message
        })
      } else if (message.type === flvjs.ErrorTypes.MEDIA_ERROR) {
        this.onError.emit({
          detail: this.ONERRORCODEMSSAGE.DECODE,
          message: message
        })
      } else {
        this.onError.emit({
          detail: this.ONERRORCODEMSSAGE.INTERIOR,
          message: message
        })
      }
    })
  }

  // 切换到扬声器
  switchToSpeaker () {
    const speakerDeviceId = this.speakerID // 将此处替换为实际的扬声器设备ID
    if (typeof this.videoElement.setSinkId !== 'undefined') {
      this.videoElement
        .setSinkId(speakerDeviceId)
        .then(function () {
          console.log('已切换到扬声器')
        })
        .catch(function (error) {
          console.error('切换到扬声器失败: ', error)
        })
    } else {
      console.warn('该浏览器不支持 HTMLMediaElement 元素的 setSinkId 方法')
    }
  }

  // 切换到听筒
  switchToHeadphones () {
    const headphonesDeviceId = this.earID // 将此处替换为实际的听筒设备ID
    if (typeof this.videoElement.setSinkId !== 'undefined') {
      this.videoElement
        .setSinkId(headphonesDeviceId)
        .then(function () {
          console.log('已切换到听筒')
        })
        .catch(function (error) {
          console.error('切换到听筒失败: ', error)
        })
    } else {
      console.warn('该浏览器不支持 HTMLMediaElement 元素的 setSinkId 方法')
    }
  }

  // 捕获全屏事件
  handleFullScreenChange = (e) => {
    // 全屏后，"退出"走的是浏览器事件，在此同步状态
    const timestamp = new Date().getTime()
    if (
      !e.detail &&
      this.isFullScreen &&
      !document[screenFn.fullscreenElement] &&
      timestamp - this.fullScreenTimestamp > 100
    ) {
      this.toggleFullScreen(false)
    }
  }

  /** 静音视频 */
  _mute = () => {
    try {
      this.livePlayerRef.muted = true
      this.isMute = true
      return { errMsg: `mute:ok` }
    } catch (e) {
      return { errMsg: `mute:${e}` }
    }
  }

  /** 暂停视频 */
  _pause = () => {
    try {
      this.player.pause()
      this.handlePause()
      this.videoElement.pause()
      this.onStateChange.emit(this.ONSTATECHANGECODEMSSAGE.PAUSED)
      return { errMsg: `pause:ok` }
    } catch (e) {
      return { errMsg: `pause:${e}` }
    }
  }

  /** 播放视频 */
  _play = () => {
    try {
      this.player.play()
      this.handlePlay()
      this.videoElement.play()
      this.onStateChange.emit(this.ONSTATECHANGECODEMSSAGE.PLAYING)
      return { errMsg: `play:ok` }
    } catch (e) {
      return { errMsg: `play:${e}` }
    }
  }
  /** 停止视频 */

  _stop = () => {
    try {
      this.player.pause()
      this.player.unload()
      this.player.detachMediaElement()
      this.player.destroy()
      this.isStop = true
      this.onStateChange.emit(this.ONSTATECHANGECODEMSSAGE.ENDED)
      return { errMsg: `stop:ok` }
    } catch (e) {
      return { errMsg: `stop:${e}` }
    }
  }

  /** 恢复视频 */
  _resume = () => {
    try {
      if (!this.isStop) {
        this.player.unload()
        this.player.detachMediaElement()
        this.player.destroy()
      }
      this.createPlayers()
      this.isStop = false
      this._pause()
      if (this.autoplay) {
        this._play() 
      }
      this.onStateChange.emit(this.ONSTATECHANGECODEMSSAGE.ENDED)
      return { errMsg: `resume:ok` }
    } catch (e) {
      return { errMsg: `resume:${e}` }
    }
  }

  onClickFullScreenBtn = (e: MouseEvent) => {
    e.stopPropagation()
    this.toggleFullScreen()
  }

  /** 全屏事件 */
  toggleFullScreen = (isFullScreen = !this.isFullScreen) => {
    this.isFullScreen = isFullScreen
    this.fullScreenTimestamp = new Date().getTime()
    this.onFullScreenChange.emit({
      fullScreen: this.isFullScreen,
      direction: 0,
    })
    if (this.isFullScreen) {
      Taro.eventCenter.trigger('__taroEnterFullScreen', {})
    } else {
      Taro.eventCenter.trigger('__taroExitFullScreen', {})
    }
    if (this.isFullScreen && !document[screenFn.fullscreenElement]) {
      try {
        setTimeout(() => {
          this.livePlayerRef[screenFn.requestFullscreen]({ navigationUI: 'auto' })
        }, 0)
        return { errMsg: `requestFullScreen:ok` }
      } catch (e) {
        return { errMsg: `requestFullScreen:${e}` }
      }
    } else {
      try {
        document[screenFn.exitFullscreen]()
        return { errMsg: `exitFullScreen:ok` }
      } catch (e) {
        return { errMsg: `exitFullScreen:${e}` }
      }
    }
  }

  /** 截屏 */
  _snapshot (data) {
    return new Promise((resolve, reject) => {
      const canvasElement = document.createElement('canvas')
      let imgwidth
      let imgheight
      // 原图
      if (data.quality === 'raw') {
        imgwidth = this.livePlayerRef.videoWidth
        imgheight = this.livePlayerRef.videoHeight
      }
      // 压缩图
      if (data.quality === 'compressed') {
        imgwidth = this.livePlayerRef.videoWidth * 0.5
        imgheight = this.livePlayerRef.videoHeight * 0.5
      }
      canvasElement.width = imgwidth
      canvasElement.height = imgheight
      const context = canvasElement.getContext('2d')
      context?.drawImage(this.livePlayerRef, 0, 0, imgwidth, imgheight)
      try {
        const dataURL = canvasElement.toDataURL(`image/${'png'}`, 1)
        const result = {
          tempImagePath: dataURL,
          width: imgwidth,
          height: imgheight,
        }
        resolve(result)
      } catch (error) {
        const mssage = { errMSg: 'snapshot:fail. Description Failed to generate Blob' }
        reject(mssage)
      }
    })
  }

  // 转化成Bolb
  dataURLtoBlob (dataurl) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  // 画中画
  async _enterPictureInPicture () {
    return new Promise((resolve, reject) => {
      if (this.livePlayerRef && typeof this.livePlayerRef.requestPictureInPicture === 'function') {
        this.livePlayerRef
          .requestPictureInPicture()
          .then((res) => {
            // 进入画中画成功
            this.onEnterPictureInPicture.emit({
              detail: res,
            })
            resolve({ errMsg: `requestPictureInPicture:ok` })
          })
          .catch((error) => {
            // 进入画中画失败
            this.onEnterPictureInPicture.emit({
              detail: error,
            })
            reject({ errMsg: `requestPictureInPicture:${error}` })
          })
      } else {
        // 浏览器不支持画中画或无法找到视频元素
        reject({ errMsg: `requestPictureInPicture:该设备不支持小窗` })
      }
    })
  }

  // 退出画中画
  _exitPictureInPicture () {
    return new Promise((resolve, reject) => {
      if (document.pictureInPictureEnabled && document.pictureInPictureElement) {
        document
          .exitPictureInPicture()
          .then((res) => {
            // 进入画中画成功
            this.onLeavePictureInPicture.emit({
              detail: res,
            })
            resolve({ errMsg: `exitPictureInPicture:ok` })
          })
          .catch((error) => {
            // 进入画中画失败
            this.onLeavePictureInPicture.emit({
              detail: error,
            })
            reject({ errMsg: `exitPictureInPicture:${error}` })
          })
      } else {
        // 浏览器不支持画中画或无法找到视频元素
        reject({ errMsg: `exitPictureInPicture:该设备不支持小窗或者没有正在打开的小窗` })
      }
    })
  }

  // 处理横屏状态
  handleOrientationChange () {
    if (window.screen.orientation.angle === 90 || window.screen.orientation.angle === -90) {
      // 横屏状态
      this.toggleFullScreen(true)
    } else {
      // 竖屏状态
      this.toggleFullScreen(false)
    }
  }
  
  handlePlay = () => {
    this.isPlaying = true
    this.isFirst = false
    this.controlsRef.toggleVisibility(true)
  }

  handlePause = () => {
    this.isPlaying = false
    this.controlsRef.toggleVisibility(true)
  }

  handleEnded = () => {
    this.isFirst = true
    this._pause()
    this.controlsRef.toggleVisibility()
  }

  toggleMute = (e: MouseEvent) => {
    e.stopPropagation()
    this.livePlayerRef.muted = !this.isMute
    this.controlsRef.toggleVisibility(true)
    this.isMute = !this.isMute
  }

  handleProgress = () => {
    if (this.mode === 'RTC') {
      this.maxCache = 0.8
      this.minCache = 0.2
    }
    if (this.minCache <= 0 ) {
      this.minCache = 1
    }
    if (this.maxCache <= 0) {
      this.maxCache = 3
    }
    if (this.maxCache < this.minCache) {
      this.minCache = 1
      this.maxCache = 3
    }
    if (this.mode === 'RTC') {
      this.minCache = 0.2
      this.maxCache = 0.8
    }
    try {
      if (!this.isdelta) { 
        const end = this.player.buffered.end(0) // 获取当前buffered值(缓冲区末尾)
        const delta = end - this.player.currentTime // 获取buffered与当前播放位置的差值
        if (delta >= this.minCache ) {
          if (this.autoplay){
            this._play()
          }
          this.isdelta = true
          return
        } else {
          return
        } 
      }
      const end = this.player.buffered.end(0) // 获取当前buffered值(缓冲区末尾)
      const delta = end - this.player.currentTime // 获取buffered与当前播放位置的差值
      this.cache = delta
      if (delta > this.maxCache || delta < 0) {
        if (this.isPlaying) {
          const deltaNum = delta - this.maxCache
          // 如果缓冲误差小于1秒时
          if (deltaNum <= 1) {
          // 如果缓冲误差小于1秒同时大于0.2秒时
            if ( deltaNum > 0.2 ) {
              this.videoElement.playbackRate = 1.1
            } else {
              this.videoElement.playbackRate = 1
            }
          } else {
            this.player.currentTime = this.player.buffered.end(0) - this.maxCache
          }
         
        }
        return
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 监听横屏
  @Listen('orientationchange', { target: 'window' })
  orientationchangeHandler () {
    this.handleOrientationChange()
  }
  
  onClickContainer = () => {
    this.controlsRef.toggleVisibility()
  }

  loadings = (event) => {
    event.stopPropagation()
  }

  componentDidHide () {
    if (this.player) {
      this._stop()
      this.videoElement.remove()
    }
    if (document.removeEventListener) {
      document.removeEventListener(screenFn.fullscreenchange, this.handleFullScreenChange)
    }
    if (this.livePlayerRef && scene === 'iOS') {
      this.livePlayerRef.removeEventListener('webkitendfullscreen', this.handleFullScreenChange)
    }
  }

  disconnectedCallback () {
    if (this.player) {
      this._stop()
      this.videoElement.remove()
    }
    if (document.removeEventListener) {
      document.removeEventListener(screenFn.fullscreenchange, this.handleFullScreenChange)
    }
    if (this.livePlayerRef && scene === 'iOS') {
      this.livePlayerRef.removeEventListener('webkitendfullscreen', this.handleFullScreenChange)
    }
  }

  render () {
    const {
      cache,
      muted,
      objectFit,
      isFirst,
      isMute,
      isFullScreen,
      showCenterPlayBtn,
      isPlaying,
      showMuteBtn,
      showFullscreenBtn,
      isdelta,
      iscache
    } = this
    return (
      <Host
        class={classNames('taro-live-player-container', {
          'taro-video-type-fullscreen': isFullScreen
        })}
        onClick={this.onClickContainer}>
        <video
          id={this.id}
          class="taro-live-player"
          style={{
            'object-fit': objectFit
          }}
          ref={(dom) => {
            if (dom) {
              this.livePlayerRef = dom as HTMLVideoElement
            }
          }}
          muted={muted}
          playsinline
          webkit-playsinline
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onEnded={this.handleEnded}
          onProgress={this.handleProgress}
        ></video>
        {isFirst && showCenterPlayBtn && !isPlaying && isdelta && (
          <div class='taro-video-cover'>
            <div class='taro-video-cover-play-button' onClick={() => this._play()} />
          </div>
        )}
        {!isdelta && (
          <div class='taro-video-cover' onClick={this.loadings}>
            <div class='taro-video-loader'  />
          </div>
        )}
       
        <taro-video-control
          ref={dom => {
            if (dom) {
              this.controlsRef = dom
            }
          }}
          controls={true}
          isPlaying={this.isPlaying}
          pauseFunc={this._pause}
          playFunc={this._play}
          showPlayBtn={true}
        >
          {showMuteBtn && (
            <div
              class={classNames('taro-video-mute', {
                'taro-video-type-mute': isMute
              })}
              onClick={this.toggleMute}
            />
          )}
          {showFullscreenBtn && (
            <div
              class={classNames('taro-video-fullscreen', {
                'taro-video-type-fullscreen': isFullScreen
              })}
              onClick={this.onClickFullScreenBtn}
            />
          )}
        </taro-video-control>
        {iscache && (
          <div class='caches'>当前缓冲秒数：{ cache } </div>
        )}  
      </Host>
    )
  }
}
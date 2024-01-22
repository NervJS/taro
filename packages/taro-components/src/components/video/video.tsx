import { Component, h, ComponentInterface, Prop, State, Event, EventEmitter, Host, Watch, Listen, Element, Method } from '@stencil/core'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { throttle } from '../../utils'
import {
  formatTime,
  calcDist,
  normalizeNumber,
  screenFn,
  isHls,
  scene
} from './utils'

import type HLS from 'hls.js'

@Component({
  tag: 'taro-video-core',
  styleUrl: './style/index.scss'
})
export class Video implements ComponentInterface {
  private videoRef: HTMLVideoElement
  private controlsRef: HTMLTaroVideoControlElement
  private danmuRef: HTMLTaroVideoDanmuElement
  private toastProgressRef: HTMLDivElement
  private toastProgressTitleRef: HTMLDivElement
  private toastVolumeRef: HTMLDivElement
  private toastVolumeBarRef: HTMLDivElement
  private currentTime = 0
  private lastClickedTime: number
  private lastTouchScreenX: number | undefined
  private lastTouchScreenY: number | undefined
  private isDraggingProgress = false
  private lastVolume: number
  private lastPercentage: number
  private nextPercentage: number
  private gestureType = 'none'
  private HLS: typeof HLS
  private hls: HLS

  @Element() el: HTMLTaroVideoCoreElement

  /**
   * 要播放视频的资源地址
   */
  @Prop() src: string

  /**
   * 指定视频时长
   */
  @Prop() duration: number

  /**
   * 是否显示默认播放控件（播放/暂停按钮、播放进度、时间）
   */
  @Prop() controls = true

  /**
   * 是否自动播放
   */
  @Prop() autoplay = false

  /**
   * 是否循环播放
   */
  @Prop() loop = false

  /**
   * 是否静音播放
   */
  @Prop() muted = false

  /**
   * 指定视频初始播放位置
   */
  @Prop() initialTime = 0

  /**
   * 视频封面的图片网络资源地址或云文件ID（2.3.0）。若 controls 属性值为 false 则设置 poster 无效
   */
  @Prop() poster: string

  /**
   * 当视频大小与 video 容器大小不一致时，视频的表现形式
   */
  @Prop() objectFit: 'contain' | 'fill' | 'cover' = 'contain'

  /**
   * 若不设置，宽度大于 240 时才会显示
   */
  @Prop() showProgress = true

  /**
   * 是否显示全屏按钮
   */
  @Prop() showFullscreenBtn = true

  /**
   * 是否显示视频底部控制栏的播放按钮
   */
  @Prop() showPlayBtn = true

  /**
   * 是否显示视频中间的播放按钮
   */
  @Prop() showCenterPlayBtn = true

  /**
   * 是否显示静音按钮
   */
  @Prop() showMuteBtn = false

  /**
   * 弹幕列表
   */
  @Prop() danmuList: []

  /**
   * 是否显示弹幕按钮
   */
  @Prop() danmuBtn = false

  /**
   * 是否展示弹幕
   */
  @Prop() enableDanmu = false

  /**
   * 是否开启播放手势，即双击切换播放/暂停
   */
  @Prop() enablePlayGesture = false

  /**
   * 是否开启控制进度的手势
   */
  @Prop() enableProgressGesture = true

  /**
   * 在非全屏模式下，是否开启亮度与音量调节手势
   */
  @Prop() vslideGesture = false

  /**
   * 在全屏模式下，是否开启亮度与音量调节手势
   */
  @Prop() vslideGestureInFullscreen = true

  @Prop() nativeProps = {}

  @State() _duration: number
  @State() _enableDanmu = false
  @State() isPlaying = false
  @State() isFirst = true
  @State() isFullScreen = false
  @State() fullScreenTimestamp = new Date().getTime()
  @State() isMute = false

  @Event({
    eventName: 'play'
  }) onPlay: EventEmitter

  @Event({
    eventName: 'pause'
  }) onPause: EventEmitter

  @Event({
    eventName: 'ended'
  }) onEnded: EventEmitter

  @Event({
    eventName: 'timeupdate'
  }) onTimeUpdate: EventEmitter

  @Event({
    eventName: 'error'
  }) onError: EventEmitter

  @Event({
    eventName: 'fullscreenchange'
  }) onFullScreenChange: EventEmitter

  @Event({
    eventName: 'progress'
  }) onProgress: EventEmitter

  @Event({
    eventName: 'loadedmetadata'
  }) onLoadedMetaData: EventEmitter

  componentWillLoad () {
    this._enableDanmu = this.enableDanmu
  }

  componentDidLoad () {
    this.init()
    if (this.initialTime) {
      this.videoRef.currentTime = this.initialTime
    }
    // 目前只支持 danmuList 初始化弹幕列表，还未支持更新弹幕列表
    this.danmuRef.sendDanmu?.(this.danmuList)

    if (document.addEventListener) {
      document.addEventListener(screenFn.fullscreenchange, this.handleFullScreenChange)
    }
    if (this.videoRef && scene === 'iOS') {
      // NOTE: iOS 场景下 fullscreenchange 并不会在退出全屏状态下触发，仅 webkitpresentationmodechanged 与 webkitendfullscreen 可替代
      this.videoRef.addEventListener('webkitendfullscreen', this.handleFullScreenChange)
    }
  }

  componentDidRender () {
  }

  disconnectedCallback () {
    if (document.removeEventListener) {
      document.removeEventListener(screenFn.fullscreenchange, this.handleFullScreenChange)
    }
    if (this.videoRef && scene === 'iOS') {
      this.videoRef.removeEventListener('webkitendfullscreen', this.handleFullScreenChange)
    }
  }

  @Watch('enableDanmu')
  watchEnableDanmu (newVal) {
    this._enableDanmu = newVal
  }

  @Watch('src')
  watchSrc () {
    this.init()
  }

  analyzeGesture = (e: TouchEvent) => {
    const obj: {
      type: string
      dataX?: number
      dataY?: number
    } = {
      type: 'none'
    }
    const nowX = e.touches[0].screenX
    const nowY = e.touches[0].screenY
    const distX = nowX - (this.lastTouchScreenX as number)
    const distY = nowY - (this.lastTouchScreenY as number)
    const enableVslideGesture = this.isFullScreen ? this.vslideGestureInFullscreen : this.vslideGesture

    if (this.gestureType === 'none') {
      // 两点间距离
      const dist = calcDist(distX, distY)

      // 没有移动
      if (dist < 10) return obj

      if (Math.abs(distY) >= Math.abs(distX)) {
        // 垂直方向移动：调整音量
        if (enableVslideGesture) {
          this.gestureType = 'adjustVolume'
          this.lastVolume = this.videoRef.volume
        } else {
          return obj
        }
      } else if (Math.abs(distY) < Math.abs(distX)) {
        // 水平方向移动：调整进度
        if (this.enableProgressGesture) {
          this.gestureType = 'adjustProgress'
          this.lastPercentage = this.currentTime / (this.duration ?? this._duration)
        } else {
          return obj
        }
      }
    }
    obj.type = this.gestureType
    obj.dataX = normalizeNumber(distX / 200)
    obj.dataY = normalizeNumber(distY / 200)
    return obj
  }

  @Listen('touchmove', {
    target: 'document'
  })
  async onDocumentTouchMove (e: TouchEvent) {
    if (this.lastTouchScreenX === undefined || this.lastTouchScreenY === undefined) return
    if (await this.controlsRef.getIsDraggingProgressBall()) return

    const gestureObj = this.analyzeGesture(e)
    if (gestureObj.type === 'adjustVolume') {
      this.toastVolumeRef.style.visibility = 'visible'
      const nextVolume = Math.max(Math.min(this.lastVolume - gestureObj.dataY!, 1), 0)
      this.videoRef.volume = nextVolume
      this.toastVolumeBarRef.style.width = `${nextVolume * 100}%`
    } else if (gestureObj.type === 'adjustProgress') {
      this.isDraggingProgress = true
      this.nextPercentage = Math.max(Math.min(this.lastPercentage + (gestureObj.dataX || 0), 1), 0)
      if (this.controls && this.showProgress) {
        this.controlsRef.setProgressBall(this.nextPercentage)
        this.controlsRef.toggleVisibility(true)
      }
      const duration = this.duration || this._duration
      this.toastProgressTitleRef.innerHTML = `${formatTime(this.nextPercentage * duration)} / ${formatTime(duration)}`
      this.toastProgressRef.style.visibility = 'visible'
    }
  }

  @Listen('touchend', {
    target: 'document'
  })
  @Listen('touchcancel', {
    target: 'document'
  })
  onDocumentTouchEnd () {
    if (this.gestureType === 'adjustVolume') {
      this.toastVolumeRef.style.visibility = 'hidden'
    } else if (this.gestureType === 'adjustProgress') {
      this.toastProgressRef.style.visibility = 'hidden'
    }

    if (this.isDraggingProgress) {
      this.isDraggingProgress = false
      this.seek(this.nextPercentage * (this.duration ?? this._duration))
    }

    this.gestureType = 'none'
    this.lastTouchScreenX = undefined
    this.lastTouchScreenY = undefined
  }

  loadNativePlayer = () => {
    if (this.videoRef) {
      this.videoRef.src = this.src
      this.videoRef.load?.()
    }
  }

  init = () => {
    const { src, videoRef } = this

    if (isHls(src)) {
      import(
        /* webpackExports: ["default"] */
        'hls.js'
      ).then(e => {
        const Hls = e.default
        this.HLS = Hls
        if (Hls.isSupported()) {
          if (this.hls) {
            this.hls.destroy()
          }
          this.hls = new Hls()
          this.hls.loadSource(src)
          this.hls.attachMedia(videoRef)
          this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
            this.autoplay && this.play()
          })
          this.hls.on(Hls.Events.ERROR, (_, data) => {
            this.handleError(data)
          })
        } else if (videoRef.canPlayType('application/vnd.apple.mpegurl')) {
          this.loadNativePlayer()
        } else {
          console.error('该浏览器不支持 HLS 播放')
        }
      })
    } else {
      this.loadNativePlayer()
    }
  }

  handlePlay = () => {
    this.isPlaying = true
    this.isFirst = false
    this.controlsRef.toggleVisibility(true)
    this.onPlay.emit()
  }

  handlePause = () => {
    this.isPlaying = false
    this.controlsRef.toggleVisibility(true)
    this.onPause.emit()
  }

  handleEnded = () => {
    this.isFirst = true
    this.pause()
    this.controlsRef.toggleVisibility()
    this.onEnded.emit()
  }

  handleTimeUpdate = throttle(async e => {
    this.currentTime = this.videoRef.currentTime
    const duration = this.duration || this._duration

    const isControlDragging = await this.controlsRef.getIsDraggingProgressBall()
    if (this.controls && this.showProgress) {
      if (!isControlDragging && !this.isDraggingProgress) {
        this.controlsRef.setProgressBall(this.currentTime / duration)
        this.controlsRef.setCurrentTime(this.currentTime)
      }
    }

    this.danmuRef.tick(this.currentTime)

    this.onTimeUpdate.emit({
      duration: e.target?.duration,
      currentTime: e.target?.currentTime
    })

    if (this.duration) {
      if (this.currentTime >= this.duration) {
        this.seek(0)
        this.handleEnded()
      }
    }
  }, 250)

  handleError = e => {
    if (this.hls) {
      switch (e.type) {
        case this.HLS.ErrorTypes.NETWORK_ERROR:
          // try to recover network error
          this.onError.emit({ errMsg: e.response })
          this.hls.startLoad()
          break
        case this.HLS.ErrorTypes.MEDIA_ERROR:
          this.onError.emit({ errMsg: e.reason || '媒体错误,请重试' })
          this.hls.recoverMediaError()
          break
        default:
          break
      }
    } else {
      this.onError.emit({
        errMsg: e.target?.error?.message,
      })
    }
  }

  handleDurationChange = () => {
    this._duration = this.videoRef.duration
  }

  handleProgress = () => {
    this.onProgress.emit()
  }

  handleLoadedMetaData = (e: Event) => {
    const target = e.target as HTMLVideoElement
    this.onLoadedMetaData.emit({
      width: target.videoWidth,
      height: target.videoHeight,
      duration: target.duration
    })
  }

  @Method()
  async getHlsObject () {
    // Note: H5 端专属方法，获取 HLS 实例 fix #11894
    return this.hls
  }

  /** 播放视频 */
  @Method()
  async play () {
    this._play()
  }

  _play = () => this.videoRef.play()

  /** 暂停视频 */
  @Method()
  async pause () {
    this._pause()
  }

  _pause = () => this.videoRef.pause()

  /** 停止视频 */
  @Method()
  async stop () {
    this._stop()
  }

  _stop = () => {
    this.videoRef.pause()
    this._seek(0)
  }

  /** 跳转到指定位置 */
  @Method()
  async seek (position: number) {
    this._seek(position)
  }

  _seek = (position: number) => {
    this.videoRef.currentTime = position
  }

  /** 进入全屏。若有自定义内容需在全屏时展示，需将内容节点放置到 video 节点内。 */
  @Method()
  async requestFullScreen () {
    this.toggleFullScreen(true)
  }

  /** 退出全屏 */
  @Method()
  async exitFullScreen () {
    this.toggleFullScreen(false)
  }

  onTouchStartContainer = (e: TouchEvent) => {
    this.lastTouchScreenX = e.touches[0].screenX
    this.lastTouchScreenY = e.touches[0].screenY
  }

  onClickContainer = () => {
    if (this.enablePlayGesture) {
      const now = Date.now()
      if (now - this.lastClickedTime < 300) {
        // 双击
        this.isPlaying ? this.pause() : this.play()
      }
      this.lastClickedTime = now
    }
    this.controlsRef.toggleVisibility()
  }

  onClickFullScreenBtn = (e: MouseEvent) => {
    e.stopPropagation()
    this.toggleFullScreen()
  }

  handleFullScreenChange = e => {
    // 全屏后，"退出"走的是浏览器事件，在此同步状态
    const timestamp = new Date().getTime()
    if (!e.detail && this.isFullScreen && !document[screenFn.fullscreenElement] && timestamp - this.fullScreenTimestamp > 100) {
      this.toggleFullScreen(false, true)
    }
  }

  toggleFullScreen = (isFullScreen = !this.isFullScreen, fromBrowser = false) => {
    this.isFullScreen = isFullScreen // this.videoRef?.['webkitDisplayingFullscreen']
    this.controlsRef.toggleVisibility(true)
    this.fullScreenTimestamp = new Date().getTime()
    this.onFullScreenChange.emit({
      fullScreen: this.isFullScreen,
      direction: 'vertical'
    })
    if (this.isFullScreen && !document[screenFn.fullscreenElement]) {
      setTimeout(() => {
        this.videoRef[screenFn.requestFullscreen]({ navigationUI: 'auto' })
        Taro.eventCenter.trigger('__taroEnterFullScreen', {})
      }, 0)
    } else {
      if (!fromBrowser) {
        document[screenFn.exitFullscreen]()
      }
      Taro.eventCenter.trigger('__taroExitFullScreen', {})
    }
    // 全屏后，"退出全屏"是浏览器按钮是浏览器内部按钮，非html按钮，点击"退出全屏"按钮是浏览器内部实现功能。此时再次调用exitFullscreen反而会报错，因此不再调用
  }

  toggleMute = (e: MouseEvent) => {
    e.stopPropagation()
    this.videoRef.muted = !this.isMute
    this.controlsRef.toggleVisibility(true)
    this.isMute = !this.isMute
  }

  toggleDanmu = (e: MouseEvent) => {
    e.stopPropagation()
    this.controlsRef.toggleVisibility(true)
    this._enableDanmu = !this._enableDanmu
  }

  render () {
    const {
      controls,
      autoplay,
      loop,
      muted,
      poster,
      objectFit,
      isFirst,
      isMute,
      isFullScreen,
      showCenterPlayBtn,
      isPlaying,
      _enableDanmu,
      showMuteBtn,
      danmuBtn,
      showFullscreenBtn,
      nativeProps
    } = this
    const duration = this.duration || this._duration
    const durationTime = formatTime(duration)

    return (
      <Host
        class={classNames('taro-video-container', {
          'taro-video-type-fullscreen': isFullScreen
        })}
        onTouchStart={this.onTouchStartContainer}
        onClick={this.onClickContainer}
      >
        <video
          class='taro-video-video'
          style={{
            'object-fit': objectFit
          }}
          ref={dom => {
            if (dom) {
              this.videoRef = dom as HTMLVideoElement
            }
          }}
          autoplay={autoplay}
          loop={loop}
          muted={muted}
          poster={controls ? poster : undefined}
          playsinline
          webkit-playsinline
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onEnded={this.handleEnded}
          onTimeUpdate={this.handleTimeUpdate}
          onError={this.handleError}
          onDurationChange={this.handleDurationChange}
          onProgress={this.handleProgress}
          onLoadedMetaData={this.handleLoadedMetaData}
          {...nativeProps}
        >
          暂时不支持播放该视频
        </video>

        <taro-video-danmu
          ref={dom => {
            if (dom) {
              this.danmuRef = dom as HTMLTaroVideoDanmuElement
            }
          }}
          enable={_enableDanmu}
        />

        {isFirst && showCenterPlayBtn && !isPlaying && (
          <div class='taro-video-cover'>
            <div class='taro-video-cover-play-button' onClick={() => this.play()} />
            <p class='taro-video-cover-duration'>{durationTime}</p>
          </div>
        )}

        <taro-video-control
          ref={dom => {
            if (dom) {
              this.controlsRef = dom
            }
          }}
          controls={controls}
          currentTime={this.currentTime}
          duration={duration}
          isPlaying={this.isPlaying}
          pauseFunc={this._pause}
          playFunc={this._play}
          seekFunc={this._seek}
          showPlayBtn={this.showPlayBtn}
          showProgress={this.showProgress}
        >
          {showMuteBtn && (
            <div
              class={classNames('taro-video-mute', {
                'taro-video-type-mute': isMute
              })}
              onClick={this.toggleMute}
            />
          )}
          {danmuBtn && (
            <div
              class={classNames('taro-video-danmu-button', {
                'taro-video-danmu-button-active': _enableDanmu
              })}
              onClick={this.toggleDanmu}>
              弹幕
            </div>
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

        <div class='taro-video-toast taro-video-toast-volume' ref={dom => {
          if (dom) {
            this.toastVolumeRef = dom
          }
        }}>
          <div class='taro-video-toast-title'>音量</div>
          <div class='taro-video-toast-icon' />
          <div class='taro-video-toast-value'>
            <div class='taro-video-toast-value-content' ref={dom => {
              if (dom) {
                this.toastVolumeBarRef = dom
              }
            }}>
              <div class='taro-video-toast-volume-grids'>
                {Array(10).fill(1).map(() => (
                  <div class='taro-video-toast-volume-grids-item' />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div class='taro-video-toast taro-video-toast-progress' ref={dom => {
          if (dom) {
            this.toastProgressRef = dom
          }
        }}>
          <div class='taro-video-toast-title' ref={dom => {
            if (dom) {
              this.toastProgressTitleRef = dom
            }
          }} />
        </div>
      </Host>
    )
  }
}

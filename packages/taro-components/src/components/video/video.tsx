// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, State, Event, EventEmitter, Host, Watch, Listen, Element } from '@stencil/core'
import classNames from 'classnames'
import {
  formatTime,
  calcDist,
  normalizeNumber,
  throttle
} from './utils'

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
  private lastPercentage
  private nextPercentage
  private gestureType = 'none'
  private wrapperElement: HTMLElement

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

  @State() _duration: number
  @State() _enableDanmu = false
  @State() isPlaying = false
  @State() isFirst = true
  @State() isFullScreen = false
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
    if (this.initialTime) {
      this.videoRef.currentTime = this.initialTime
    }
    // 目前只支持 danmuList 初始化弹幕列表，还未支持更新弹幕列表
    this.danmuRef.sendDanmu(this.danmuList)
  }

  componentDidRender () {
    const parentElement = this.el.parentElement as HTMLElement
    const parentTagName = parentElement.tagName
    if (this.isFullScreen) {
      if (parentTagName !== 'BODY') {
        parentElement.removeChild(this.el)
        document.body.appendChild(this.el)
      }
    } else {
      if (parentTagName !== 'DIV' || !parentElement.className.includes('taro-video')) {
        if (!this.wrapperElement) {
          const container = document.createElement('div')
          container.className = 'taro-video'
          parentElement.removeChild(this.el)
          container.appendChild(this.el)
          parentElement.appendChild(container)
          this.wrapperElement = container
        } else {
          parentElement.removeChild(this.el)
          this.wrapperElement.appendChild(this.el)
        }
      }
    }
  }

  @Watch('enableDanmu')
  watchEnableDanmu (newVal) {
    this._enableDanmu = newVal
  }

  analyseGesture = (e: TouchEvent) => {
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

    const gestureObj = this.analyseGesture(e)
    if (gestureObj.type === 'adjustVolume') {
      this.toastVolumeRef.style.visibility = 'visible'
      const nextVolume = Math.max(Math.min(this.lastVolume - gestureObj.dataY!, 1), 0)
      this.videoRef.volume = nextVolume
      this.toastVolumeBarRef.style.width = `${nextVolume * 100}%`
    } else if (gestureObj.type === 'adjustProgress') {
      this.isDraggingProgress = true
      this.nextPercentage = Math.max(Math.min(this.lastPercentage + gestureObj.dataX, 1), 0)
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
    this.onError.emit({
      errMsg: e.target?.error?.message
    })
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

  play = () => {
    this.videoRef.play()
  }

  pause = () => {
    this.videoRef.pause()
  }

  stop = () => {
    this.videoRef.pause()
    this.seek(0)
  }

  seek = (position: number) => {
    this.videoRef.currentTime = position
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

  toggleFullScreen = (nextFullScreenState?) => {
    const isFullScreen = nextFullScreenState === undefined ? !this.isFullScreen : nextFullScreenState
    this.isFullScreen = isFullScreen
    this.controlsRef.toggleVisibility(true)
    this.onFullScreenChange.emit({
      fullScreen: isFullScreen,
      direction: 'vertical'
    })
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
      src,
      controls,
      autoplay,
      loop,
      muted,
      poster,
      objectFit,
      isFirst,
      isMute,
      isFullScreen,
      duration,
      _duration,
      showCenterPlayBtn,
      isPlaying,
      _enableDanmu,
      showMuteBtn,
      danmuBtn,
      showFullscreenBtn
    } = this
    const durationTime = formatTime(duration || _duration || null)

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
          ref={dom => (this.videoRef = dom as HTMLVideoElement)}
          src={src}
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
        >
          暂时不支持播放该视频
        </video>

        <taro-video-control
          ref={dom => {
            if (dom) {
              this.controlsRef = dom
            }
          }}
          controls={controls}
          currentTime={this.currentTime}
          duration={this.duration || this._duration || undefined}
          isPlaying={this.isPlaying}
          pauseFunc={this.pause}
          playFunc={this.play}
          seekFunc={this.seek}
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
            <div class='taro-video-cover-play-button' onClick={this.play} />
            <p class='taro-video-cover-duration'>{durationTime}</p>
          </div>
        )}

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

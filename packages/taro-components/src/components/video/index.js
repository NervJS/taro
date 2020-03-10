/**
 * Video组件的样式参考了[uni-app](https://github.com/dcloudio/uni-app/tree/master/packages/uni-h5)的实现
 */

import Taro from '@tarojs/taro-h5'
import Nerv, { Component, createPortal } from 'nervjs'
import classnames from 'classnames'
import Danmu from './danmu'
import Controls from './controls'
import { formatTime, calcDist, normalizeNumber } from './utils'

import './style/index.scss'
import 'weui'

/**
 * @typedef {Object} Danmu
 * @property {string} text 弹幕文字
 * @property {string} color 弹幕颜色
 * @property {number} [time] 弹幕时间
 */

/**
 * Video组件参数
 * @typedef {Object} VideoProps
 * @property {string} src 要播放视频的资源地址
 * @property {boolean} [autoPauseIfNavigate=true] 当跳转到其它小程序页面时，是否自动暂停本页面的视频
 * @property {boolean} [autoPauseIfOpenNative=true] 当跳转到其它微信原生页面时，是否自动暂停本页面的视频
 * @property {boolean} [autoplay=false] 是否自动播放
 * @property {boolean} [controls=true] 是否显示默认播放控件（播放/暂停按钮、播放进度、时间）
 * @property {boolean} [danmuBtn=false] 是否显示弹幕按钮，只在初始化时有效，不能动态变更
 * @property {Array.<Danmu>} [danmuList=[]] 弹幕列表
 * @property {boolean} [enableDanmu=false] 是否展示弹幕，只在初始化时有效，不能动态变更
 * @property {boolean} [enablePlayGesture=false] 是否开启播放手势，即双击切换播放/暂停
 * @property {boolean} [enableProgressGesture=true] 是否开启控制进度的手势
 * @property {number} [initialTime=0] 指定视频初始播放位置
 * @property {boolean} [loop=false] 是否循环播放
 * @property {boolean} [muted=false] 是否静音播放
 * @property {string} [objectFit=contain] 当视频大小与 video 容器大小不一致时，视频的表现形式
 * @property {string} [playBtnPosition=bottom] 播放按钮的位置
 * @property {boolean} [showCenterPlayBtn=true] 是否显示视频中间的播放按钮
 * @property {boolean} [showFullscreenBtn=true] 是否显示全屏按钮
 * @property {boolean} [showMuteBtn=false] 是否显示静音按钮
 * @property {boolean} [showPlayBtn=true] 是否显示视频底部控制栏的播放按钮
 * @property {boolean} [showProgress=true] 若不设置，宽度大于240时才会显示
 * @property {boolean} [vslideGesture=false] 在非全屏模式下，是否开启亮度与音量调节手势（同 pageGesture）
 * @property {boolean} [vslideGestureInFullscreen=true] 在全屏模式下，是否开启亮度与音量调节手势
 * @property {number} [direction]  设置全屏时视频的方向，不指定则根据宽高比自动判断
 * @property {number} [duration]  指定视频时长
 * @property {string} [poster]  视频封面的图片网络资源地址。若 controls 属性值为 false 则设置 poster 无效
 * @property {string} [title]  视频的标题，全屏时在顶部展示
 * @property {Function} [onPlay] 当开始/继续播放时触发play事件
 * @property {Function} [onPause] 当暂停播放时触发 pause 事件
 * @property {Function} [onEnded] 当播放到末尾时触发 ended 事件
 * @property {Function} [onTimeUpdate] 播放进度变化时触发，event.detail = {currentTime, duration} 。触发频率 250ms 一次
 * @property {Function} [onFullscreenChange] 视频进入和退出全屏时触发，event.detail = {fullScreen, direction}，direction 有效值为 vertical 或 horizontal
 * @property {Function} [onWaiting] 视频出现缓冲时触发
 * @property {Function} [onError] 视频播放出错时触发
 * @property {Function} [onProgress] 加载进度变化时触发，只支持一段加载。event.detail = {buffered}，百分比
 */

class Video extends Component {
  /** @type {VideoProps} */
  static defaultProps = {
    autoPauseIfNavigate: true,
    autoPauseIfOpenNative: true,
    autoplay: false,
    controls: true,
    danmuBtn: false,
    danmuList: [],
    enableDanmu: false,
    enablePlayGesture: false,
    enableProgressGesture: true,
    initialTime: 0,
    loop: false,
    muted: false,
    objectFit: 'contain',
    playBtnPosition: 'bottom',
    showCenterPlayBtn: true,
    showFullscreenBtn: true,
    showMuteBtn: false,
    showPlayBtn: true,
    showProgress: true,
    vslideGesture: false,
    vslideGestureInFullscreen: true
  }

  /** @type {HTMLVideoElement} */
  videoRef

  /** @type {Contorls} */
  controlsRef

  /** @type {HTMLDivElement} */
  currentTimeRef

  /** @type {HTMLDivElement} */
  danmuRef

  /** @type {number} */
  currentTime = 0

  /** @type {number} */
  lastClickedTime

  /** @type {number} */
  lastTouchScreenX

  /** @type {number} */
  lastTouchScreenY

  progressDimentions = {
    left: 0,
    right: 0,
    width: 0
  }

  constructor (props, context) {
    super(props, context)
    const stateObj = this.getInitialState(this.props)
    this.state = Object.assign(
      {
        duration: null,
        isPlaying: false,
        isFirst: true,
        enableDanmu: false,
        isFullScreen: false,
        isMute: false
      },
      stateObj
    )
  }

  onTimeUpdate = e => {
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      value: {
        duration: e.srcElement.duration,
        currentTime: e.srcElement.currentTime
      }
    })
    this.currentTime = this.videoRef.currentTime
    const duration = this.state.duration
    if (!this.controlsRef.isDraggingProgressBall && !this.isDraggingProgress) {
      this.controlsRef.setProgressBall(this.currentTime / duration)
    }
    this.controlsRef.setCurrentTime(this.currentTime)

    this.danmuRef.tick(this.currentTime)
    this.props.onTimeUpdate && this.props.onTimeUpdate(e)
  }

  onEnded = e => {
    this.setState({
      isFirst: true
    })
    this.pause()
    this.controlsRef.toggleVisibility()
    this.props.onEnded && this.props.onEnded(e)
  }

  onPlay = e => {
    this.props.onPlay && this.props.onPlay(e)
    this.controlsRef.toggleVisibility(true)
    if (!this.state.isPlaying) {
      this.setState({
        isPlaying: true
      })
    }
  }

  onPause = e => {
    this.props.onPause && this.props.onPause(e)
    this.controlsRef.toggleVisibility(true)
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false
      })
    }
  }

  onError = e => {
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      value: { errMsg: e.srcElement.error.code }
    })
    this.props.onError && this.props.onError(e)
  }

  onClickContainer = e => {
    if (this.props.enablePlayGesture) {
      const now = Date.now()
      if (now - this.lastClickedTime < 300) {
        // 双击
        if (this.state.isPlaying) {
          this.pause()
        } else {
          this.play()
        }
      }
      this.lastClickedTime = now
    }
    this.controlsRef.toggleVisibility()
  }

  onClickFullScreenBtn = e => {
    e.stopPropagation()
    this.toggleFullScreen()
  }

  onLoadedMetadata = e => {
    this.setState({
      duration: this.videoRef.duration
    })
    this.duration = this.videoRef.duration
    if (this.props.poster) return
    if (this.state.isFirst) {
      this.seek(this.props.initialTime)
    }
  }

  toggleDanmu = e => {
    e.stopPropagation()
    this.controlsRef.toggleVisibility(true)
    this.setState({
      enableDanmu: !this.state.enableDanmu
    })
  }

  toggleFullScreen = nextFullScreenState => {
    const isFullScreen = nextFullScreenState === undefined ? !this.state.isFullScreen : nextFullScreenState
    const currentTime = this.currentTime
    const danmuList = this.danmuRef.danmuList
    this.setState({ isFullScreen }, () => {
      const evt = new Event('fullscreenChange', {
        fullScreen: this.state.isFullScreen,
        direction: 'vertical'
      })
      this.props.onFullscreenChange && this.props.onFullscreenChange(evt)
      this.danmuRef.danmuList = danmuList
      this.seek(currentTime)
      this.state.isPlaying && this.play()
      this.controlsRef.toggleVisibility(true)
    })
  }

  toggleMute = e => {
    e.stopPropagation()
    this.setState(() => {
      const nextMuteState = !this.state.isMute
      this.videoRef.muted = nextMuteState
      this.controlsRef.toggleVisibility(true)
      return { isMute: nextMuteState }
    })
  }

  play = () => {
    this.videoRef.play()
    this.setState({
      isPlaying: true,
      isFirst: false
    })
  }

  pause = () => {
    this.videoRef.pause()
    this.setState({
      isPlaying: false
    })
  }

  stop = () => {
    this.videoRef.pause()
    this.seek(0)
    this.setState({
      isPlaying: false
    })
  }

  seek = position => {
    this.videoRef.currentTime = position
  }

  showStatusBar = () => {
    console.error('暂不支持 videoContext.showStatusBar')
  }

  hideStatusBar = () => {
    console.error('暂不支持 videoContext.hideStatusBar')
  }

  requestFullScreen = () => {
    this.toggleFullScreen(true)
  }

  exitFullScreen = () => {
    this.toggleFullScreen(false)
  }

  sendDanmu (danmu) {
    this.danmuRef.sendDanmu(danmu)
  }

  playbackRate = rate => {
    this.videoRef.playbackRate = rate
  }

  getInitialState (props) {
    const stateObj = {
      enableDanmu: props.enableDanmu
    }
    return stateObj
  }

  onTouchStartContainer = e => {
    this.lastTouchScreenX = e.touches[0].screenX
    this.lastTouchScreenY = e.touches[0].screenY
  }

  bindTouchEvents = () => {
    let lastVolume
    let lastPercentage
    let nextPercentage
    let gestureType = 'none'

    const analyseGesture = e => {
      const obj = {}
      const nowX = e.touches[0].screenX
      const nowY = e.touches[0].screenY
      const distX = nowX - this.lastTouchScreenX
      const distY = nowY - this.lastTouchScreenY
      if (gestureType === 'none') {
        const dist = calcDist(distX, distY)
        if (dist < 10) {
          obj.type = 'none'
          return obj
        }
        if (distX === 0 || Math.abs(distY / distX) > 1) {
          let enableVslideGesture = this.state.isFullScreen ? this.props.vslideGestureInFullscreen : this.props.vslideGesture
          if (enableVslideGesture) {
            gestureType = 'adjustVolume'
            lastVolume = this.videoRef.volume
          }
        } else if (this.props.enableProgressGesture && Math.abs(distY / distX) <= 1) {
          gestureType = 'adjustProgress'
          lastPercentage = this.currentTime / this.state.duration
        }
      }
      obj.type = gestureType
      obj.dataX = normalizeNumber(distX / window.screen.width)
      obj.dataY = normalizeNumber(distY / window.screen.height)
      return obj
    }
    const touchMove = e => {
      if (this.controlsRef.isDraggingProgressBall) return

      const gestureObj = analyseGesture(e)
      if (gestureObj.type === 'adjustVolume') {
        this.toastVolumeRef.style.visibility = 'visible'
        const nextVolume = Math.max(Math.min(lastVolume - gestureObj.dataY, 1), 0)
        this.videoRef.volume = nextVolume
        this.toastVolumeBarRef.style.width = `${nextVolume * 100}%`
      } else if (gestureObj.type === 'adjustProgress') {
        this.isDraggingProgress = true
        nextPercentage = Math.max(Math.min(lastPercentage + gestureObj.dataX, 1), 0)
        this.controlsRef.setProgressBall(nextPercentage)
        this.controlsRef.toggleVisibility(true)
        this.toastProgressTitleRef.innerHTML = `${formatTime(nextPercentage * this.duration)} / ${formatTime(this.duration)}`
        this.toastProgressRef.style.visibility = 'visible'
      }
    }
    const touchEnd = e => {
      if (gestureType === 'adjustVolume') {
        this.toastVolumeRef.style.visibility = 'hidden'
      } else if (gestureType === 'adjustProgress') {
        this.toastProgressRef.style.visibility = 'hidden'
      }
      gestureType = 'none'
      if (this.isDraggingProgress) {
        this.isDraggingProgress = false
        this.seek(nextPercentage * this.videoRef.duration)
      }
    }

    document.body.addEventListener('touchmove', touchMove)
    document.body.addEventListener('touchend', touchEnd)
    document.body.addEventListener('touchcancel', touchEnd)
    return () => {
      document.body.removeEventListener('touchmove', touchMove)
      document.body.removeEventListener('touchend', touchEnd)
      document.body.removeEventListener('touchcancel', touchEnd)
    }
  }

  componentWillMount () {
    const getRef = refName => {
      return ref => {
        if (!ref) return
        this[refName] = ref
      }
    }
    this.getVideoRef = getRef('videoRef')
    this.getControlsRef = getRef('controlsRef')
    this.getDanmuRef = getRef('danmuRef')
    this.getToastProgressRef = getRef('toastProgressRef')
    this.getToastProgressTitleRef = getRef('toastProgressTitleRef')
    this.getToastVolumeRef = getRef('toastVolumeRef')
    this.getToastVolumeBarRef = getRef('toastVolumeBarRef')
  }

  componentDidMount () {
    this.unbindTouchEvents = this.bindTouchEvents()
    this.sendDanmu(this.props.danmuList)

    Taro.eventCenter.on('__taroRouterChange', () => {
      if (this.state.isPlaying) {
        this.stop()
      }
    })
  }

  componentWillReceiveProps (nProps) {
    const nState = this.getInitialState(nProps)
    this.setState(nState)
  }

  componentWillUnmount () {
    this.unbindTouchEvents()
  }

  render () {
    const {
      src,
      autoplay,
      className,
      style,
      id,
      initialTime,
      loop,
      muted,
      objectFit,
      poster,

      controls,
      showFullscreenBtn,
      showMuteBtn,
      showPlayBtn,
      showProgress,
      showCenterPlayBtn,
      danmuBtn
    } = this.props
    const { enableDanmu, isFirst, isMute, isFullScreen } = this.state
    const duration = formatTime(this.props.duration || this.state.duration || null)

    const videoProps = {
      id,
      src,
      autoplay,
      poster: controls ? poster : null,
      loop,
      muted,
      start: initialTime,
      className: classnames('taro-video-video', className),
      style: Object.assign({ objectFit }, style),
      ref: this.getVideoRef,
      playsinline: true,
      'webkit-playsinline': true,
      'object-fit': objectFit,

      controls: false,
      onTimeUpdate: this.onTimeUpdate,
      onEnded: this.onEnded,
      onPlay: this.onPlay,
      onPause: this.onPause,
      onError: this.onError,
      onDurationChange: this.onLoadedMetadata
    }
    const videoNode = (
      <div
        className={classnames('taro-video-container', {
          'taro-video-type-fullscreen': isFullScreen,
          'taro-video-type-mute': isMute
        })}
        onTouchStart={this.onTouchStartContainer}
        onClick={this.onClickContainer}>
        <video {...videoProps}>暂时不支持播放该视频</video>
        <Controls
          controls={controls}
          currentTime={this.currentTime}
          duration={this.props.duration || this.state.duration || null}
          isPlaying={this.state.isPlaying}
          pauseFunc={this.pause}
          playFunc={this.play}
          seekFunc={this.seek}
          showPlayBtn={showPlayBtn}
          showProgress={showProgress}
          ref={this.getControlsRef}
        >
          {showMuteBtn && (
            <div
              className={classnames('taro-video-mute', {
                'taro-video-type-mute': isMute
              })}
              onClick={this.toggleMute}
            />
          )}
          {danmuBtn && (
            <div
              className={classnames('taro-video-danmu-button', {
                'taro-video-danmu-button-active': enableDanmu
              })}
              onClick={this.toggleDanmu}>
              弹幕
            </div>
          )}
          {showFullscreenBtn && (
            <div
              className={classnames('taro-video-fullscreen', {
                'taro-video-type-fullscreen': isFullScreen
              })}
              onClick={this.onClickFullScreenBtn}
            />
          )}
        </Controls>
        <Danmu ref={this.getDanmuRef} enable={enableDanmu} />
        {isFirst && showCenterPlayBtn && !this.state.isPlaying && (
          <div class='taro-video-cover'>
            <div class='taro-video-cover-play-button' onClick={this.play} />
            <p class='taro-video-cover-duration'>{duration}</p>
          </div>
        )}
        <div class='taro-video-toast taro-video-toast-volume' ref={this.getToastVolumeRef}>
          <div class='taro-video-toast-title'>音量</div>
          <div className='taro-video-toast-icon' />
          <div class='taro-video-toast-value'>
            <div class='taro-video-toast-value-content' ref={this.getToastVolumeBarRef}>
              <div class='taro-video-toast-volume-grids'>
                {new Array(10).fill().map(v => (
                  <div class='taro-video-toast-volume-grids-item' />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='taro-video-toast taro-video-toast-progress' ref={this.getToastProgressRef}>
          <div className='taro-video-toast-title' ref={this.getToastProgressTitleRef} />
        </div>
      </div>
    )
    return this.state.isFullScreen ? createPortal(videoNode, document.body) : <div className='taro-video' style={this.props.style}>{videoNode}</div>
  }
}

export default Video

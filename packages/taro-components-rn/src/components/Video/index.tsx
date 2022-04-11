/**
 * Video组件的样式参考了[uni-app](https://github.com/dcloudio/uni-app/tree/master/packages/uni-h5)的实现
 */

import React, { Component } from 'react'
// import Danmu from './danmu'
// import Controls from './controls'
import { formatTime } from './utils'
import { VideoProps } from '@tarojs/components/types/Video'
import {
  AVPlaybackStatus,
  Video,
  VideoFullscreenUpdateEvent,
  VideoReadyForDisplayEvent,
} from 'expo-av'
import Styles from './style'
import View from '../View'
import Text from '../Text'
import Image from '../Image'
import { onFullscreenChangeEventDetail } from './PropsType'
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

const ObjectFit = {
  contain: Video.RESIZE_MODE_CONTAIN,
  fill: Video.RESIZE_MODE_STRETCH,
  cover: Video.RESIZE_MODE_COVER,
}

declare const global: any

global._taroVideoMap = {}

interface Props extends VideoProps {
  onLoad: () => void;
}

class _Video extends Component<Props, any> {
  /** @type {VideoProps} */
  static defaultProps: Props = {
    id: '',
    src: '',
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
    vslideGestureInFullscreen: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onLoad: () => {},
  }

  /** @type {HTMLVideoElement} */
  videoRef: Video

  /** @type {number} */
  currentTime = 0

  progressDimentions = {
    left: 0,
    right: 0,
    width: 0,
  }

  getVideoRef: (ref: any) => void
  isDraggingProgress: any
  duration: any
  toastVolumeRef: any
  toastVolumeBarRef: any
  toastProgressTitleRef: any
  toastProgressRef: any
  getControlsRef: (ref: any) => void
  getDanmuRef: (ref: any) => void
  getToastProgressRef: (ref: any) => void
  getToastProgressTitleRef: (ref: any) => void
  getToastVolumeRef: (ref: any) => void
  getToastVolumeBarRef: (ref: any) => void
  unbindTouchEvents: () => void

  constructor({ props, context }: { props: Props; context: any }) {
    super(props, context)
    const stateObj = this.props
    this.videoRef = (React.createRef() as unknown) as Video
    this.state = Object.assign(
      {
        duration: null,
        isPlaying: false,
        isFirst: true,
        enableDanmu: false,
        isFullScreen: false,
        isMute: false,
      },
      stateObj
    )
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onEnded = (e: any): void => {
    this.setState({
      // isFirst: true,
      isEnded: true,
    })
    if (!this.props.loop) this.pause()
    this.props.onEnded && this.props.onEnded(e)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onPlay = (e: any): void => {
    this.props.onPlay && this.props.onPlay(e)
    if (!this.state.isPlaying) {
      this.play()
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onPause = (e: any): void => {
    this.props.onPause && this.props.onPause(e)
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false,
      })
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onError = (e: string): void => {
    if (this.props.onError) {
      const error: any = Object.defineProperty({}, 'detail', {
        enumerable: true,
        value: { errMsg: e },
      })
      this.props.onError(error)
    }
  }

  onLoad = (status: AVPlaybackStatus): void => {
    const { durationMillis = 0 }: any = status
    this.setState({
      duration: durationMillis,
    })
    this.props.onLoad && this.props.onLoad()
  }

  clickPlayBtn = ():void => {
    const { isEnded } = this.state
    isEnded && this.seek(0)
    this.videoRef && this.videoRef.playAsync()
    this.setState({
      shouldPlay: true,
      isFirst: false,
    })
  }

  play = (): void => {
    const { isEnded } = this.state
    isEnded && this.seek(0)
    this.videoRef.playAsync()
    this.setState({
      shouldPlay: true,
      isPlaying: true,
      isFirst: false,
    })
  }

  pause = (): void => {
    this.setState({
      isPlaying: false,
      shouldPlay: false,
    })
  }

  stop = (): void => {
    this.pause()
    this.seek(0)
    this.setState({
      isPlaying: false,
    })
  }

  seek = (position: number): void => {
    this.videoRef.setStatusAsync({
      positionMillis: position,
    })
  }

  showStatusBar = (): void => {
    console.error('暂不支持 videoContext.showStatusBar')
  }

  hideStatusBar = (): void => {
    console.error('暂不支持 videoContext.hideStatusBar')
  }

  requestFullScreen = (): void => {
    this.videoRef.presentFullscreenPlayer()
  }

  exitFullScreen = (): void => {
    this.videoRef.dismissFullscreenPlayer()
  }

  componentDidMount(): void {
    const getRef = (refName: string) => {
      const { id } = this.props
      return (ref: any) => {
        if (!ref) return
        this[refName] = ref
        id && (global._taroVideoMap[id] = ref)
      }
    }
    this.getVideoRef = getRef('videoRef')
  }

  static getDerivedStateFromProps(nProps: VideoProps): VideoProps {
    return nProps
  }

  onLoadedMetaData = (event: VideoReadyForDisplayEvent): void => {
    const { naturalSize, status } = event
    // @ts-ignore
    status.duration = status.durationMillis
    // @ts-ignore
    this.props.onLoadedMetaData && this.props.onLoadedMetaData({ detail: { ...naturalSize, ...status } })
  }

  onFullscreenChange = (event: VideoFullscreenUpdateEvent): void => {
    const { fullscreenUpdate, status } = event
    const fullScreen: boolean = fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT || fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
    const detail: onFullscreenChangeEventDetail = {
      fullScreen: fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT || fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT,
      fullscreenUpdate,
      direction: 1,
      ...status,
    }
    if (this.state.isFullScreen !== fullScreen) {
      this.setState({
        isFullScreen: fullScreen,
      }, () => {
        // @ts-ignore
        this.props.onFullscreenChange && this.props.onFullscreenChange({ detail })
      })
    }
  }

  onPlaybackStatusUpdate = (event: AVPlaybackStatus): void => {
    // @ts-ignore
    this.props.onTimeUpdate && this.props.onTimeUpdate(event)
    // @ts-ignore
    const { didJustFinish, isPlaying } = event
    if (didJustFinish) {
      this.onEnded(event)
    }

    if (isPlaying !== this.state.isPlaying) {
      this.setState(
        {
          isPlaying,
          isFirst: isPlaying ? false : this.state.isFirst
        },
        () => {
          isPlaying && this.onPlay(event)
          !isPlaying && !this.state.isFirst && this.onPause(event)
        }
      )
    }
  }

  render(): JSX.Element {
    const {
      src,
      autoplay,
      style,
      initialTime,
      loop,
      muted,
      objectFit = 'contain',
      poster,
      controls,
      showCenterPlayBtn,
    } = this.props
    const { isFullScreen, shouldPlay } = this.state
    const duration = formatTime(
      this.props.duration || this.state.duration || null
    )
    const videoProps = {
      source: { uri: src },
      shouldPlay: shouldPlay || autoplay,
      posterSource: controls ? { uri: poster } : undefined,
      usePoster: !!controls,
      isLooping: loop,
      isMuted: muted,
      positionMillis: initialTime,
      style: Object.assign({ width: '100%', height: '100%' }, style as Record<string, unknown>),
      ref: this.getVideoRef,
      resizeMode: ObjectFit[objectFit],
      useNativeControls: controls,
      onError: this.onError,
      onLoad: this.onLoad,
      onReadyForDisplay: this.onLoadedMetaData,
      onFullscreenUpdate: this.onFullscreenChange,
      onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
    }

    // 第一次不显示又无法自动播放
    const showPlayBtn = this.state.isFirst ? true : showCenterPlayBtn

    const videoNode = (
      <View
        style={[
          Styles['taro-video-container'],
          isFullScreen && Styles['taro-video-type-fullscreen'],
        ]}
      >
        <Video {...videoProps} />
        {showPlayBtn && !this.state.isPlaying && (
          <View style={Styles['taro-video-cover']}>
            <Image
              src={require('../../assets/video/play.png')}
              style={Styles['taro-video-cover-play-button']}
              onClick={this.clickPlayBtn}
            />
            <Text style={Styles['taro-video-cover-duration']}>{duration}</Text>
          </View>
        )}
        {this.props.children}
      </View>
    )
    return (
      <View style={[Styles['taro-video'], this.props.style as Record<string, unknown>]}>
        {videoNode}
      </View>
    )
  }
}

export default _Video

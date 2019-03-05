/**
 * ✔ src
 * ✔ initialTime
 * ✘ duration
 * ✔ controls
 * ✘ danmuList
 * ✘ danmuBtn
 * ✘ enableDanmu
 * ✔ autoplay
 * ✔ loop
 * ✔ muted
 * ✘ pageGesture
 * ✘ direction
 * ✔ showProgress
 * ✔ showFullscreenBtn
 * ✔ showPlayBtn
 * ✔ showCenterPlayBtn
 * ✘ enableProgressGesture
 * ✔ objectFit
 * ✔ poster
 * ✔ onPlay
 * ✔ onPause
 * ✔ onEnded
 * ✔ onTimeupdate
 * ✔ onFullscreenchange
 * ✔ onWaiting
 * ✔ onError
 * ✘ onProgress
 *
 * @flow
 */

import * as React from 'react'
import { Dimensions } from 'react-native'
import { Video, ScreenOrientation } from 'expo'
import Player from './player'
import utils from '../../utils'

const resizeModeMap = {
  contain: Video.RESIZE_MODE_CONTAIN,
  fill: Video.RESIZE_MODE_STRETCH,
  cover: Video.RESIZE_MODE_COVER
}

type Props = {
  src: string,
  initialTime?: number,
  controls?: boolean,
  autoplay?: boolean,
  loop?: boolean,
  muted?: boolean,
  showProgress?: boolean,
  showFullscreenBtn?: boolean,
  showPlayBtn?: boolean,
  showCenterPlayBtn?: boolean,
  objectFit?: 'contain' | 'fill' | 'cover',
  poster?: string,
  onPlay?: Function,
  onPause?: Function,
  onEnded?: Function,
  onTimeupdate?: Function,
  onFullscreenchange?: Function,
  onWaiting?: Function,
  onError?: Function
}

type State = {
  isPortrait: boolean
}

class _Video extends React.Component<Props, State> {
  props: Props
  state: State = {
    isPortrait: true
  }

  static defaultProps = {
    initialTime: 0,
    controls: true,
    showProgress: true,
    showFullscreenBtn: true,
    showPlayBtn: true,
    objectFit: 'contain',
    onPlay: utils.noop,
    onPause: utils.noop,
    onEnded: utils.noop,
    onTimeupdate: utils.noop,
    onFullscreenchange: utils.noop,
    onWaiting: utils.noop,
    onError: utils.noop
  }

  _onPlaybackStatusUpdate = (playbackStatus) => {
    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        this.props.onError(playbackStatus.error)
      }
      return
    }

    this.props.onTimeupdate(playbackStatus.positionMillis)

    if (playbackStatus.isPlaying) {
      this.props.onPlay()
    } else {
      this.props.onPause()
    }

    if (playbackStatus.isBuffering) {
      this.props.onWaiting()
    }

    if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
      this.props.onEnded()
    }
  }

  // _handleVideoRef = (component) => {
  //   const playbackObject = component
  //   playbackObject.loadAsync({ uri: this.props.src }, {
  //     // parseInt
  //     positionMillis: this.props.initialTime,
  //     shouldPlay: this.props.autoplay,
  //     isLooping: this.props.loop,
  //     isMuted: this.props.isMuted
  //   })
  //   playbackObject.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
  // }

  componentDidMount () {
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL)
    Dimensions.addEventListener(
      'change',
      this.orientationChangeHandler.bind(this)
    )
  }

  componentWillUnmount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT)
    Dimensions.removeEventListener('change', this.orientationChangeHandler)
  }

  orientationChangeHandler(dims) {
    const { width, height } = dims.window
    const isLandscape = width > height
    this.setState({ isPortrait: !isLandscape })
    this.props.onFullscreenchange({ detail: { fullScreen: !!isLandscape, direction: isLandscape ? 'horizontal' : 'vertical' } })
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL)
  }

  switchToLandscape = () => {
    ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE)
  }

  switchToPortrait = () => {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT)
  }

  render () {
    const initialTime = parseInt(this.props.initialTime)

    return (
      <Player
        videoProps={{
          source: { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
          resizeMode: resizeModeMap[this.props.objectFit],
          posterSource: { uri: this.props.poster },
          positionMillis: initialTime,
          shouldPlay: this.props.autoplay,
          isLooping: this.props.loop,
          isMuted: this.props.isMuted
        }}
        controls={this.props.controls}
        showProgress={this.props.showProgress}
        showFullscreenBtn={this.props.showFullscreenBtn}
        showPlayBtn={this.props.showPlayBtn}
        showCenterPlayBtn={this.props.showCenterPlayBtn}
        playbackCallback={this._onPlaybackStatusUpdate}
        isPortrait={this.state.isPortrait}
        switchToLandscape={this.switchToLandscape}
        switchToPortrait={this.switchToPortrait}
      />
    )
  }
}

export default _Video

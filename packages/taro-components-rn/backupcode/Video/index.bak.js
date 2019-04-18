/**
 * ✔ src
 * ✔ initialTime
 * ✘ duration
 * ✘ controls true
 * ✘ danmuList
 * ✘ danmuBtn
 * ✘ enableDanmu
 * ✔ autoplay
 * ✔ loop
 * ✔ muted
 * ✘ pageGesture
 * ✘ direction
 * ✘ showProgress true
 * ✘ showFullscreen-btn true
 * ✘ showPlayBtn true
 * ✘ showCenterPlayBtn
 * ✘ enableProgressGesture
 * ✔ objectFit
 * ✔ poster
 * ✔ onPlay
 * ✔ onPause
 * ✔ onEnded
 * ✔ onTimeupdate
 * ✘ onFullscreenchange
 * ✔ onWaiting
 * ✔ onError
 * ✘ onProgress
 *
 * @flow
 */

import * as React from 'react'
import { Video } from 'expo'
import utils from '../../utils'

const resizeModeMap = {
  contain: Video.RESIZE_MODE_CONTAIN,
  fill: Video.RESIZE_MODE_STRETCH,
  cover: Video.RESIZE_MODE_COVER
}

type Props = {
  src: string,
  initialTime?: number,
  autoplay?: boolean,
  loop?: boolean,
  muted?: boolean,
  objectFit?: 'contain' | 'fill' | 'cover',
  poster?: string,
  onPlay?: Function,
  onPause?: Function,
  onEnded?: Function,
  onTimeupdate?: Function,
  onWaiting?: Function,
  onError?: Function
}

class _Video extends React.Component<Props> {
  props: Props

  static defaultProps = {
    initialTime: 0,
    objectFit: 'contain',
    onPlay: utils.noop,
    onPause: utils.noop,
    onEnded: utils.noop,
    onTimeupdate: utils.noop,
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

    this.props.onTimeupdate(positionMillis)

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

  _handleVideoRef = (component) => {
    const playbackObject = component
    playbackObject.loadAsync({ uri: this.props.src }, {
      positionMillis: this.props.initialTime,
      shouldPlay: this.props.autoplay,
      isLooping: this.props.loop,
      isMuted: this.props.isMuted
    })
    playbackObject.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
  }

  render () {
    return (
      <Video
        ref={this._handleVideoRef}
        resizeMode={resizeModeMap[this.props.objectFit]}
        posterSource={{ uri: this.props.poster }}
        style={{ width: 300, height: 300 }}
      />
    )
  }
}

export default _Video

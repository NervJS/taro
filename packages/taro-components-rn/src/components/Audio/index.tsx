/**
 * 音频组件
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/audio.html#audio
 *
 * - id
 * ✔ src
 * ✔ loop
 * ✘ controls
 * ✔ poster
 * ✔ name
 * ✔ author
 * ✔ onError
 * ✔ onPlay
 * ✔ onPause
 * ✔ onTimeUpdate
 * ✔ onEnded
 */

import * as React from 'react'
import {
  TouchableWithoutFeedback,
  ActivityIndicator,
  Text,
  View,
  ImageBackground,
  NetInfo
} from 'react-native'
import { Audio } from 'expo'
import { MaterialIcons } from '@expo/vector-icons'
import utils from '../../utils'
import styles from './styles'

const soundObject = new Audio.Sound()

const enum PLAYBACK_STATES {
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  BUFFERING = 'BUFFERING',
  ERROR = 'ERROR',
  ENDED = 'ENDED'
}

const enum MediaErrorCode {
  MEDIA_ERR_ABORTED = 1,
  MEDIA_ERR_NETWORK,
  MEDIA_ERR_DECODE,
  MEDIA_ERR_SRC_NOT_SUPPORTED
}

export interface Props {
  src: string;
  loop?: boolean;
  controls?: boolean;
  poster?: string;
  name?: string;
  author?: string;
  onError?(event: { errMsg: MediaErrorCode }): void;
  onPlay?(): void;
  onPause?(): void;
  onTimeUpdate?(event: { currentTime: number, duration: number }): void;
  onEnded?(): void;
}

export interface State {
  networkState: string;
  playbackState: PLAYBACK_STATES;
  lastPlaybackStateUpdate: number;
  playbackInstancePosition: number;
  playbackInstanceDuration: number;
  shouldPlay: boolean;
}

class _Audio extends React.Component<Props, State> {
  static defaultProps = {
    name: '未知音频',
    author: '未知作者',
    onError: utils.noop,
    onPlay: utils.noop,
    onPause: utils.noop,
    onTimeUpdate: utils.noop,
    onEnded: utils.noop,
  }
  state: State = {
    networkState: '',
    playbackState: PLAYBACK_STATES.LOADING,
    lastPlaybackStateUpdate: Date.now(),
    playbackInstancePosition: 0,
    playbackInstanceDuration: 0,
    shouldPlay: false
  }

  getSource() {
    const { src } = this.props
    return typeof src === 'string' ? { uri: src } : src
  }

  _onConnectionChange(connectionInfo: any) {
    this.setState({ networkState: connectionInfo.type })
  }

  _setupNetInfoListener() {
    NetInfo.getConnectionInfo().then((connectionInfo: any) => {
      this.setState({ networkState: connectionInfo.type })
    })
    NetInfo.addEventListener(
      'connectionChange',
      this._onConnectionChange.bind(this)
    )
  }

  _setPlaybackState = (playbackState: PLAYBACK_STATES) => {
    const { onPlay, onPause, onEnded, onTimeUpdate } = this.props
    if (playbackState === PLAYBACK_STATES.PLAYING) {
      onTimeUpdate && onTimeUpdate({ currentTime: this.state.playbackInstancePosition, duration: this.state.playbackInstanceDuration })
    }
    if (this.state.playbackState !== playbackState) {
      this.setState({ playbackState, lastPlaybackStateUpdate: Date.now() })
      if (playbackState === PLAYBACK_STATES.PLAYING) {
        onPlay && onPlay()
      } else if (playbackState === PLAYBACK_STATES.PAUSED) {
        onPause && onPause()
      } else if (playbackState === PLAYBACK_STATES.ENDED) {
        onEnded && onEnded()
      }
    }
  }

  _onPlaybackStatusUpdate = (playbackStatus: any) => {
    const { onError } = this.props
    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        this._setPlaybackState(PLAYBACK_STATES.ERROR)
        onError && onError({ errMsg: MediaErrorCode.MEDIA_ERR_NETWORK })
      }
      return
    }
    this.setState({
      playbackInstancePosition: playbackStatus.positionMillis,
      playbackInstanceDuration: playbackStatus.durationMillis,
      shouldPlay: playbackStatus.shouldPlay,
    })
    if (this.state.playbackState !== PLAYBACK_STATES.ENDED) {
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        this._setPlaybackState(PLAYBACK_STATES.ENDED)
      } else {
        if (this.state.networkState === 'none' && playbackStatus.isBuffering) {
          this._setPlaybackState(PLAYBACK_STATES.ERROR)
        } else {
          this._setPlaybackState(playbackStatus.isPlaying ? PLAYBACK_STATES.PLAYING : (playbackStatus.isBuffering ? PLAYBACK_STATES.BUFFERING : PLAYBACK_STATES.PAUSED))
        }
      }
    }
  }

  _getMMSSFromMillis = (millis: number) => {
    const totalSeconds = millis / 1000
    const seconds = Math.floor(totalSeconds % 60)
    const minutes = Math.floor(totalSeconds / 60)

    const padWithZero = (number: number) => {
      const string = number.toString()
      if (number < 10) {
        return '0' + string
      }
      return string
    }
    return padWithZero(minutes) + ':' + padWithZero(seconds)
  }

  _getPercent = () => {
    if (
      soundObject != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      ) * 100
    }
    return 0
  }

  onToggle = async () => {
    switch (this.state.playbackState) {
      case PLAYBACK_STATES.ENDED:
        soundObject.setStatusAsync({ shouldPlay: true, positionMillis: 0 })
        break
      case PLAYBACK_STATES.PLAYING:
        soundObject.setStatusAsync({ shouldPlay: false })
        break
      case PLAYBACK_STATES.PAUSED:
        soundObject.setStatusAsync({ shouldPlay: true })
        break
    }
  }

  async componentDidMount() {
    this._setupNetInfoListener()
    soundObject.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
    try {
      await soundObject.loadAsync(this.getSource(), {
        isLooping: !!this.props.loop,
      })
    } catch (err) {
      // ERR
    }
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this._onConnectionChange.bind(this)
    )
    soundObject.unloadAsync()
  }

  render() {
    const { playbackState } = this.state
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={this.onToggle}>
            <View style={styles.poster}>
              <ImageBackground source={{ uri: this.props.poster }} style={styles.posterImg}>
                {(playbackState === PLAYBACK_STATES.PAUSED || playbackState === PLAYBACK_STATES.ENDED) && <MaterialIcons
                  name={'play-circle-outline'}
                  size={24}
                  color="white"
                  style={styles.playIcon}
                />}
                {playbackState === PLAYBACK_STATES.PLAYING && <MaterialIcons
                  name={'pause-circle-outline'}
                  size={24}
                  color="white"
                  style={styles.playIcon}
                />}
                {(playbackState === PLAYBACK_STATES.LOADING ||
                  playbackState === PLAYBACK_STATES.BUFFERING ||
                  playbackState === PLAYBACK_STATES.ERROR) &&
                  <ActivityIndicator color="white" size={'small'} />}
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.info}>
            <View style={styles.detail}>
              <View style={styles.name}><Text style={styles.nameText}>{this.props.name}</Text></View>
              <View style={styles.author}><Text style={styles.authorText}>{this.props.author}</Text></View>
            </View>
            <View style={styles.time}><Text style={styles.timeText}>{this._getMMSSFromMillis(this.state.playbackInstancePosition)}</Text></View>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressBarTint, {
            width: `${this._getPercent()}%`
          }]}>
          </View>
        </View>
      </View>
    )
  }
}

export default _Audio

/**
 * Modified based on https://github.com/expo/videoplayer
 *
 * @flow
 */

import * as React from 'react'
import { Audio, Video } from 'expo'
import {
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Text,
  Slider,
  NetInfo
} from 'react-native'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'

// Default assets

import {
  PlayIcon,
  PauseIcon,
  Spinner,
  FullscreenEnterIcon,
  FullscreenExitIcon,
} from './icons'

const THUMB_IMAGE = require('../../assets/thumb.png')

// UI states

const CONTROL_STATES = {
  SHOWN: 'SHOWN',
  SHOWING: 'SHOWING',
  HIDDEN: 'HIDDEN',
  HIDING: 'HIDDING'
}

const PLAYBACK_STATES = {
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  BUFFERING: 'BUFFERING',
  ERROR: 'ERROR',
  ENDED: 'ENDED'
}

const SEEK_STATES = {
  NOT_SEEKING: 'NOT_SEEKING',
  SEEKING: 'SEEKING',
  SEEKED: 'SEEKED'
}

// Don't show the Spinner for very short periods of buffering
const BUFFERING_SHOW_DELAY = 200

type Props = {
  controls?: boolean,
  showProgress?: boolean,
  showFullscreenBtn?: boolean,
  showPlayBtn?: boolean,
  showCenterPlayBtn?: boolean,
  /**
   * How long should the fadeIn animation for the controls run? (in milliseconds)
   * Default value is 200.
   *
   */
  fadeInDuration: number,
  /**
   * How long should the fadeOut animation run? (in milliseconds)
   * Default value is 1000.
   *
   */
  fadeOutDuration: number,
  /**
   * How long should the fadeOut animation run when the screen is tapped when the controls are visible? (in milliseconds)
   * Default value is 200.
   *
   */
  quickFadeOutDuration: number,
  /**
   * If the user has not interacted with the controls, how long should the controls stay visible? (in milliseconds)
   * Default value is 4000.
   *
   */
  hideControlsTimerDuration: number,

  /**
   * Callback that gets passed `playbackStatus` objects for the underlying video element
   */
  playbackCallback: Function,

  /**
   * Error callback (lots of errors are non-fatal and the video will continue to play)
   */
  errorCallback: Function,

  // Icons
  playIcon: Function,
  pauseIcon: Function,
  spinner: Function,
  fullscreenEnterIcon: Function,
  fullscreenExitIcon: Function,

  /**
   * Style to use for the all the text in the videoplayer including seek bar times and error messages
   */
  textStyle: Object,

  /**
   * Props to use into the underlying <Video>. Useful for configuring autoplay, playback speed, and other Video properties.
   * See Expo documentation on <Video>. `source` is required.
   */
  videoProps: Object,

  /**
   * Write internal logs to console
   */
  debug: boolean,

  // Dealing with fullscreen
  isPortrait: boolean,
  switchToLandscape: Function,
  switchToPortrait: Function,

  showControlsOnLoad: boolean
}

export default class VideoPlayer extends React.Component<Props> {
  props: Props

  static defaultProps = {
    controls: true,
    showProgress: true,
    showFullscreenBtn: true,
    showPlayBtn: true,
    // Animations
    fadeInDuration: 200,
    fadeOutDuration: 1000,
    quickFadeOutDuration: 200,
    hideControlsTimerDuration: 4000,
    // Appearance (assets and styles)
    playIcon: PlayIcon,
    pauseIcon: PauseIcon,
    spinner: Spinner,
    fullscreenEnterIcon: FullscreenEnterIcon,
    fullscreenExitIcon: FullscreenExitIcon,
    textStyle: {
      color: '#FFFFFF',
      fontSize: 12,
    },
    // Callbacks
    playbackCallback: () => {},
    errorCallback: error => {
      console.log('Error: ', error.message, error.type, error.obj)
    },
    debug: false,
    switchToLandscape: () => {
      console.warn(
        'Pass in this function `switchToLandscape` in props to enable fullscreening'
      )
    },
    switchToPortrait: () => {
      console.warn(
        'Pass in this function `switchToLandscape` in props to enable fullscreening'
      )
    },
    showControlsOnLoad: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      // Playback state
      playbackState: PLAYBACK_STATES.LOADING,
      lastPlaybackStateUpdate: Date.now(),
      //Seeking state
      seekState: SEEK_STATES.NOT_SEEKING,
      // State comes from the playbackCallback
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      // Error message if we are in PLAYBACK_STATES.ERROR
      error: null,
      // Controls display state
      controlsOpacity: new Animated.Value(props.showControlsOnLoad ? 1 : 0),
      controlsState: props.showControlsOnLoad
        ? CONTROL_STATES.SHOWN
        : CONTROL_STATES.HIDDEN,
    }
  }

  async componentDidMount() {
    this._setupNetInfoListener()

    if (this.state.controlsState === CONTROL_STATES.SHOWN) {
      this._resetControlsTimer()
    }

    // Set audio mode to play even in silent mode (like the YouTube app)
    try {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      })
    } catch (e) {
      this.props.errorCallback({
        type: 'NON_FATAL',
        message: 'setAudioModeAsync error',
        obj: e,
      })
    }
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this._onConnectionChange.bind(this)
    )
  }

  _onConnectionChange(connectionInfo) {
    this.props.debug && console.log('[networkState]', connectionInfo.type)
    this.setState({ networkState: connectionInfo.type })
  }

  // Listen for changes in network connectivity
  _setupNetInfoListener() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      this.props.debug && console.log('[networkState]', connectionInfo.type)
      this.setState({ networkState: connectionInfo.type })
    })
    NetInfo.addEventListener(
      'connectionChange',
      this._onConnectionChange.bind(this)
    )
  }

  // Handle events during playback
  _setPlaybackState(playbackState) {
    if (this.state.playbackState != playbackState) {
      this.props.debug &&
        console.log(
          '[playback]',
          this.state.playbackState,
          ' -> ',
          playbackState,
          ' [seek] ',
          this.state.seekState,
          ' [shouldPlay] ',
          this.state.shouldPlay
        )

      this.setState({ playbackState, lastPlaybackStateUpdate: Date.now() })
    }
  }

  _setSeekState(seekState) {
    this.props.debug &&
      console.log(
        '[seek]',
        this.state.seekState,
        ' -> ',
        seekState,
        ' [playback] ',
        this.state.playbackState,
        ' [shouldPlay] ',
        this.state.shouldPlay
      )

    this.setState({ seekState })

    // Don't keep the controls timer running when the state is seeking
    if (seekState === SEEK_STATES.SEEKING) {
      this.controlsTimer && this.clearTimeout(this.controlsTimer)
    } else {
      // Start the controls timer anew
      this._resetControlsTimer()
    }
  }

  _playbackCallback(playbackStatus) {
    try {
      this.props.playbackCallback(playbackStatus)
    } catch (e) {
      console.error('Uncaught error when calling props.playbackCallback', e)
    }

    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        this._setPlaybackState(PLAYBACK_STATES.ERROR)
        const errorMsg = `Encountered a fatal error during playback: ${
          playbackStatus.error
        }`
        this.setState({
          error: errorMsg,
        })
        this.props.errorCallback({ type: 'FATAL', message: errorMsg, obj: {} })
      }
    } else {
      // Update current position, duration, and `shouldPlay`
      this.setState({
        playbackInstancePosition: playbackStatus.positionMillis,
        playbackInstanceDuration: playbackStatus.durationMillis,
        shouldPlay: playbackStatus.shouldPlay,
      })

      // Figure out what state should be next (only if we are not seeking, other the seek action handlers control the playback state,
      // not this callback)
      if (
        this.state.seekState === SEEK_STATES.NOT_SEEKING &&
        this.state.playbackState !== PLAYBACK_STATES.ENDED
      ) {
        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          this._setPlaybackState(PLAYBACK_STATES.ENDED)
        } else {
          // If the video is buffering but there is no Internet, you go to the ERROR state
          if (
            this.state.networkState === 'none' &&
            playbackStatus.isBuffering
          ) {
            this._setPlaybackState(PLAYBACK_STATES.ERROR)
            this.setState({
              error:
                'You are probably offline. Please make sure you are connected to the Internet to watch this video',
            })
          } else {
            this._setPlaybackState(
              this._isPlayingOrBufferingOrPaused(playbackStatus)
            )
          }
        }
      }
    }
  }

  // Seeking
  _getSeekSliderPosition() {
    if (
      this._playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      )
    }
    return 0
  }

  _onSeekSliderValueChange = () => {
    if (
      this._playbackInstance != null &&
      this.state.seekState !== SEEK_STATES.SEEKING
    ) {
      this._setSeekState(SEEK_STATES.SEEKING)
      // A seek might have finished (SEEKED) but since we are not in NOT_SEEKING yet, the `shouldPlay` flag
      // is still false, but we really want it be the stored value from before the previous seek
      this.shouldPlayAtEndOfSeek =
        this.state.seekState === SEEK_STATES.SEEKED
          ? this.shouldPlayAtEndOfSeek
          : this.state.shouldPlay
      // Pause the video
      this._playbackInstance.setStatusAsync({ shouldPlay: false })
    }
  }

  _onSeekSliderSlidingComplete = async value => {
    if (this._playbackInstance != null) {
      // Seeking is done, so go to SEEKED, and set playbackState to BUFFERING
      this._setSeekState(SEEK_STATES.SEEKED)
      // If the video is going to play after seek, the user expects a spinner.
      // Otherwise, the user expects the play button
      this._setPlaybackState(
        this.shouldPlayAtEndOfSeek
          ? PLAYBACK_STATES.BUFFERING
          : PLAYBACK_STATES.PAUSED
      )
      this._playbackInstance
        .setStatusAsync({
          positionMillis: value * this.state.playbackInstanceDuration,
          shouldPlay: this.shouldPlayAtEndOfSeek,
        })
        .then(playbackStatus => {
          // The underlying <Video> has successfully updated playback position
          // TODO: If `shouldPlayAtEndOfSeek` is false, should we still set the playbackState to PAUSED?
          // But because we setStatusAsync(shouldPlay: false), so the playbackStatus return value will be PAUSED.
          this._setSeekState(SEEK_STATES.NOT_SEEKING)
          this._setPlaybackState(
            this._isPlayingOrBufferingOrPaused(playbackStatus)
          )
        })
        .catch(message => {
          this.props.debug && console.log('Seek error: ', message)
        })
    }
  }

  _isPlayingOrBufferingOrPaused = playbackStatus => {
    if (playbackStatus.isPlaying) {
      return PLAYBACK_STATES.PLAYING
    }

    if (playbackStatus.isBuffering) {
      return PLAYBACK_STATES.BUFFERING
    }

    return PLAYBACK_STATES.PAUSED
  }

  _onSeekBarTap = evt => {
    if (
      !(
        this.state.playbackState === PLAYBACK_STATES.LOADING ||
        this.state.playbackState === PLAYBACK_STATES.ENDED ||
        this.state.playbackState === PLAYBACK_STATES.ERROR ||
        this.state.controlsState !== CONTROL_STATES.SHOWN
      )
    ) {
      const value = evt.nativeEvent.locationX / this.state.sliderWidth
      this._onSeekSliderValueChange()
      this._onSeekSliderSlidingComplete(value)
    }
  }

  // Capture the width of the seekbar slider for use in `_onSeekbarTap`
  _onSliderLayout = evt => {
    this.setState({ sliderWidth: evt.nativeEvent.layout.width })
  }

  // Controls view
  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000
    const seconds = Math.floor(totalSeconds % 60)
    const minutes = Math.floor(totalSeconds / 60)

    const padWithZero = number => {
      const string = number.toString()
      if (number < 10) {
        return '0' + string
      }
      return string
    }
    return padWithZero(minutes) + ':' + padWithZero(seconds)
  }

  // Controls Behavior
  _replay() {
    this._playbackInstance
      .setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
      })
      .then(() => {
        // Update playbackState to get out of ENDED state
        this.setState({ playbackState: PLAYBACK_STATES.PLAYING })
      })
  }

  _togglePlay() {
    this.state.playbackState == PLAYBACK_STATES.PLAYING
      ? this._playbackInstance.setStatusAsync({ shouldPlay: false })
      : this._playbackInstance.setStatusAsync({ shouldPlay: true })
  }

  _toggleControls = () => {
    switch (this.state.controlsState) {
      case CONTROL_STATES.SHOWN:
        // If the controls are currently shown, a tap should hide controls quickly
        this.setState({ controlsState: CONTROL_STATES.HIDING })
        this._hideControls(true)
        break
      case CONTROL_STATES.HIDDEN:
        // If the controls are currently, show controls with fade-in animation
        this._showControls()
        this.setState({ controlsState: CONTROL_STATES.SHOWING })
        break
      case CONTROL_STATES.HIDING:
        // If controls are fading out, a tap should reverse, and show controls
        this.setState({ controlsState: CONTROL_STATES.SHOWING })
        this._showControls()
        break
      case CONTROL_STATES.SHOWING:
        // A tap when the controls are fading in should do nothing
        break
    }
  }

  _showControls = () => {
    this.showingAnimation = Animated.timing(this.state.controlsOpacity, {
      toValue: 1,
      duration: this.props.fadeInDuration,
      useNativeDriver: true,
    })

    this.showingAnimation.start(({ finished }) => {
      if (finished) {
        this.setState({ controlsState: CONTROL_STATES.SHOWN })
        this._resetControlsTimer()
      }
    })
  }

  _hideControls = (immediate = false) => {
    if (this.controlsTimer) {
      this.clearTimeout(this.controlsTimer)
    }
    this.hideAnimation = Animated.timing(this.state.controlsOpacity, {
      toValue: 0,
      duration: immediate
        ? this.props.quickFadeOutDuration
        : this.props.fadeOutDuration,
      useNativeDriver: true,
    })
    this.hideAnimation.start(({ finished }) => {
      if (finished) {
        this.setState({ controlsState: CONTROL_STATES.HIDDEN })
      }
    })
  }

  _onTimerDone = () => {
    // After the controls timer runs out, fade away the controls slowly
    this.setState({ controlsState: CONTROL_STATES.HIDING })
    this._hideControls()
  }

  _resetControlsTimer = () => {
    if (this.controlsTimer) {
      this.clearTimeout(this.controlsTimer)
    }
    this.controlsTimer = this.setTimeout(
      this._onTimerDone.bind(this),
      this.props.hideControlsTimerDuration
    )
  }

  render() {
    // const videoWidth = Dimensions.get('window').width * (this.props.isPortrait ? 0.92 : 1)
    // const videoHeight = this.props.isPortrait ? (videoWidth * (9 / 16)) : Dimensions.get('window').height
    const videoWidth = this.props.isPortrait ? 300 : Dimensions.get('window').width
    const videoHeight = this.props.isPortrait ? 225 : Dimensions.get('window').height
    const centeredContentWidth = 60

    const PlayIcon = this.props.playIcon
    const PauseIcon = this.props.pauseIcon
    const Spinner = this.props.spinner
    const FullscreenEnterIcon = this.props.fullscreenEnterIcon
    const FullscreenExitIcon = this.props.fullscreenExitIcon

    // Do not let the user override `ref`, `callback`, and `style`
    const {
      ref,
      callback,
      style,
      source,
      ...otherVideoProps
    } = this.props.videoProps

    // TODO: Best way to throw required property missing error
    if (!source) {
      console.error('`source` is a required property')
    }

    const Control = ({ callback, center, children, ...otherProps }) => (
      <TouchableOpacity
        {...otherProps}
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        onPress={() => {
          this._resetControlsTimer()
          callback()
        }}>
        <View
          style={
            center
              ? {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  justifyContent: 'center',
                  width: centeredContentWidth,
                  height: centeredContentWidth,
                  borderRadius: centeredContentWidth,
                }
              : {}
          }>
          {children}
        </View>
      </TouchableOpacity>
    )

    const CenteredView = ({ children, style, ...otherProps }) => (
      <Animated.View
        {...otherProps}
        style={[
          {
            position: 'absolute',
            left: (videoWidth - centeredContentWidth) / 2,
            top: (videoHeight - centeredContentWidth) / 2,
            width: centeredContentWidth,
            height: centeredContentWidth,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}>
        {children}
      </Animated.View>
    )

    const ErrorText = ({ text }) => (
      <View
        style={{
          position: 'absolute',
          top: videoHeight / 2,
          width: videoWidth - 40,
          marginRight: 20,
          marginLeft: 20,
        }}>
        <Text style={[this.props.textStyle, { textAlign: 'center' }]}>
          {text}
        </Text>
      </View>
    )

    return (
      <TouchableWithoutFeedback onPress={this._toggleControls.bind(this)}>
        <View
          style={{
            backgroundColor: 'black',
          }}>
          <Video
            source={source}
            ref={component => {
              this._playbackInstance = component
              ref && ref(component)
            }}
            onPlaybackStatusUpdate={this._playbackCallback.bind(this)}
            style={{
              width: videoWidth,
              height: videoHeight,
            }}
            {...otherVideoProps}
          />

          {/* Spinner */}
          {((this.state.playbackState == PLAYBACK_STATES.BUFFERING &&
            Date.now() - this.state.lastPlaybackStateUpdate >
              BUFFERING_SHOW_DELAY) ||
            this.state.playbackState == PLAYBACK_STATES.LOADING) && (
            <CenteredView>
              <Spinner />
            </CenteredView>
          )}

          {/* Play/pause buttons */}
          {this.props.showCenterPlayBtn && (this.state.seekState == SEEK_STATES.NOT_SEEKING ||
            this.state.seekState == SEEK_STATES.SEEKED) &&
            (this.state.playbackState == PLAYBACK_STATES.PLAYING ||
              this.state.playbackState == PLAYBACK_STATES.PAUSED) && (
              <CenteredView
                pointerEvents={
                  this.state.controlsState === CONTROL_STATES.HIDDEN
                    ? 'none'
                    : 'auto'
                }
                style={{
                  opacity: this.state.controlsOpacity,
                }}>
                <Control center={true} callback={this._togglePlay.bind(this)}>
                  {this.state.playbackState == PLAYBACK_STATES.PLAYING ? (
                    <PauseIcon />
                  ) : (
                    <PlayIcon />
                  )}
                </Control>
              </CenteredView>
            )}
          {/* Replay button to show at the end of a video */}
          {this.props.showCenterPlayBtn && this.state.playbackState == PLAYBACK_STATES.ENDED && (
            <CenteredView>
              <Control center={true} callback={this._replay.bind(this)}>
                <PlayIcon />
              </Control>
            </CenteredView>
          )}

          {/* Error display */}
          {this.state.playbackState == PLAYBACK_STATES.ERROR && (
            <ErrorText text={this.state.error} />
          )}

          {/* Bottom bar */}
          {this.props.controls && <Animated.View
            pointerEvents={
              this.state.controlsState === CONTROL_STATES.HIDDEN
                ? 'none'
                : 'auto'
            }
            style={{
              position: 'absolute',
              bottom: 0,
              width: videoWidth,
              opacity: this.state.controlsOpacity,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(0,0,0,0.1)'
            }}>
            {/* Play/pause buttons */}
            {this.props.showPlayBtn && (this.state.seekState == SEEK_STATES.NOT_SEEKING ||
              this.state.seekState == SEEK_STATES.SEEKED ||
              this.state.seekState == SEEK_STATES.SEEKING) &&
              (this.state.playbackState == PLAYBACK_STATES.PLAYING ||
                this.state.playbackState == PLAYBACK_STATES.PAUSED) && (
                <Control
                  center={false}
                  callback={this._togglePlay.bind(this)}
                  style={{ marginRight: 8, backgroundColor: 'transparent' }}
                >
                  {this.state.playbackState == PLAYBACK_STATES.PLAYING ? (
                    <PauseIcon />
                  ) : (
                    <PlayIcon />
                  )}
                </Control>
              )}
            {/* Replay button to show at the end of a video */}
            {this.props.showPlayBtn && this.state.playbackState == PLAYBACK_STATES.ENDED && (
              <Control center={false} callback={this._replay.bind(this)} style={{marginRight: 8}}>
                <PlayIcon />
              </Control>
              )}

            {/* Current time display */}
            {this.props.showProgress && <Text
              style={[
                this.props.textStyle,
                { backgroundColor: 'transparent', marginLeft: 5 },
              ]}>
              {this._getMMSSFromMillis(this.state.playbackInstancePosition)}
            </Text>}

            {/* Seek bar */}
            {this.props.showProgress && <TouchableWithoutFeedback
              onLayout={this._onSliderLayout.bind(this)}
              onPress={this._onSeekBarTap.bind(this)}>
              <Slider
                style={{ marginRight: 10, marginLeft: 10, flex: 1 }}
                // thumbTintColor='#fff'
                thumbImage={THUMB_IMAGE}
                minimumTrackTintColor='#fff'
                maximumTrackTintColor='rgba(255,255,255,0.3)'
                value={this._getSeekSliderPosition()}
                onValueChange={this._onSeekSliderValueChange}
                onSlidingComplete={this._onSeekSliderSlidingComplete}
                disabled={
                  this.state.playbackState === PLAYBACK_STATES.LOADING ||
                  this.state.playbackState === PLAYBACK_STATES.ENDED ||
                  this.state.playbackState === PLAYBACK_STATES.ERROR ||
                  this.state.controlsState !== CONTROL_STATES.SHOWN
                }
              />
            </TouchableWithoutFeedback>}

            {/* Duration display */}
            {this.props.showProgress && <Text
              style={[
                this.props.textStyle,
                { backgroundColor: 'transparent', marginRight: 5 },
              ]}>
              {this._getMMSSFromMillis(this.state.playbackInstanceDuration)}
            </Text>}

            {/* Fullscreen control */}
            {this.props.showFullscreenBtn && (
              <Control
                style={{ backgroundColor: 'transparent' }}
                center={false}
                callback={() => {
                  this.props.isPortrait
                    ? this.props.switchToLandscape()
                    : this.props.switchToPortrait()
                }}>
                {this.props.isPortrait ? (
                  <FullscreenEnterIcon />
                ) : (
                  <FullscreenExitIcon />
                )}
              </Control>
            )}
          </Animated.View>}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

reactMixin(VideoPlayer.prototype, TimerMixin)

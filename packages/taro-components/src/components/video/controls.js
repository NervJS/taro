import Nerv, { Component } from 'nervjs'
import { formatTime } from './utils'

/**
 * @typedef {Object} ControlsProps
 * @property {Boolean} controls={controls}
 * @property {Number} currentTime={this.currentTime}
 * @property {Number} duration={this.state.duration}
 * @property {Boolean} isPlaying={this.state.isPlaying}
 * @property {Function} pauseFunc={this.pause}
 * @property {Function} playFunc={this.play}
 * @property {Function} seekFunc={this.seek}
 * @property {Boolean} showPlayBtn={showPlayBtn}
 * @property {Boolean} showProgress={showProgress}
 */
class Controls extends Component {
  visible = false
  isDraggingProgressBall = false

  /** @type {number} */
  hideControlsTimer

  progressDimentions = {
    left: 0,
    right: 0,
    width: 0
  }

  calcPercentage = pageX => {
    let pos = pageX - this.progressDimentions.left
    pos = Math.max(pos, 0)
    pos = Math.min(pos, this.progressDimentions.width)
    return pos / this.progressDimentions.width
  }

  getControlsRef = ref => {
    if (!ref) return
    this.controlsRef = ref
  }
  getCurrentTimeRef = ref => {
    if (!ref) return
    this.currentTimeRef = ref
  }
  getProgressBallRef = ref => {
    if (!ref) return
    this.progressBallRef = ref
  }

  setCurrentTime (time) {
    if (this.currentTimeRef) {
      this.currentTimeRef.innerHTML = formatTime(time)
    }
  }
  setProgressBall (percentage) {
    if (this.progressBallRef) {
      this.progressBallRef.style.left = `${percentage * 100}%`
    }
  }

  toggleVisibility (nextVisible) {
    const visible = nextVisible === undefined ? !this.visible : nextVisible
    if (visible) {
      this.hideControlsTimer && clearTimeout(this.hideControlsTimer)
      if (this.props.isPlaying) {
        this.hideControlsTimer = setTimeout(() => {
          this.toggleVisibility(false)
        }, 2000)
      }
      if (this.controlsRef) {
        this.controlsRef.style.visibility = 'visible'
      }
    } else {
      if (this.controlsRef) {
        this.controlsRef.style.visibility = 'hidden'
      }
    }
    this.visible = !!visible
  }

  onDragProgressBallStart = () => {
    this.isDraggingProgressBall = true
    this.hideControlsTimer && clearTimeout(this.hideControlsTimer)
  }
  onClickProgress = e => {
    e.stopPropagation()
    const seekFunc = this.props.seekFunc
    const percentage = this.calcPercentage(e.pageX)
    seekFunc(percentage * this.props.duration)
    this.toggleVisibility(true)
  }
  bindTouchEvents = () => {
    let percentage = 0
    const touchMove = e => {
      if (!this.isDraggingProgressBall) return
      const touchX = e.touches[0].pageX
      percentage = this.calcPercentage(touchX)
      this.setProgressBall(percentage)
    }
    const touchEnd = e => {
      if (!this.isDraggingProgressBall) return
      const seekFunc = this.props.seekFunc
      this.isDraggingProgressBall = false
      seekFunc(percentage * this.props.duration)
      this.toggleVisibility(true)
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

  componentDidMount () {
    this.unbindTouchEvents = this.bindTouchEvents()
  }
  componentWillUnmount () {
    this.unbindTouchEvents()
  }

  render () {
    const { controls, currentTime, duration, isPlaying, pauseFunc, playFunc, showPlayBtn, showProgress } = this.props
    const formattedDuration = formatTime(duration)
    let playBtn

    if (!showPlayBtn) {
      return null
    } else if (isPlaying) {
      playBtn = <div className='taro-video-control-button taro-video-control-button-pause' onClick={pauseFunc} />
    } else {
      playBtn = <div className='taro-video-control-button taro-video-control-button-play' onClick={playFunc} />
    }

    return (
      <div className='taro-video-bar taro-video-bar-full' ref={this.getControlsRef}>
        {controls && (
          <div className='taro-video-controls'>
            {playBtn}
            {showProgress && (
              <div className='taro-video-current-time' ref={this.getCurrentTimeRef}>
                {formatTime(currentTime)}
              </div>
            )}
            {showProgress && (
              <div className='taro-video-progress-container' onClick={this.onClickProgress}>
                <div
                  className='taro-video-progress'
                  ref={ref => {
                    if (ref !== null) {
                      const rect = ref.getBoundingClientRect()
                      this.progressDimentions.left = rect.left
                      this.progressDimentions.right = rect.right
                      this.progressDimentions.width = rect.width
                    }
                  }}>
                  <div className='taro-video-progress-buffered' style='width: 100%;' />
                  <div className='taro-video-ball' ref={this.getProgressBallRef} onTouchStart={this.onDragProgressBallStart} style={`left: ${formattedDuration ? (this.currentTime / duration) * 100 : 0}%`}>
                    <div className='taro-video-inner' />
                  </div>
                </div>
              </div>
            )}
            {showProgress && <div className='taro-video-duration'>{formattedDuration}</div>}
          </div>
        )}
        {this.props.children}
      </div>
    )
  }
}

export default Controls

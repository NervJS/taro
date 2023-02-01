import { Component, h, ComponentInterface, Prop, Host, Element, Listen, Method } from '@stencil/core'
import { formatTime } from './utils'

@Component({
  tag: 'taro-video-control'
})
export class VideoControl implements ComponentInterface {
  private currentTimeRef: HTMLDivElement
  private progressBallRef: HTMLDivElement
  private visible = false
  private isDraggingProgressBall = false
  private hideControlsTimer: ReturnType<typeof setTimeout>
  private percentage = 0
  private progressDimensions = {
    left: 0,
    width: 0
  }

  @Element() el: HTMLElement

  @Prop() controls: boolean
  @Prop() currentTime: number
  @Prop() duration: number
  @Prop() isPlaying: boolean
  @Prop() pauseFunc: () => void
  @Prop() playFunc: () => void
  @Prop() seekFunc: (position: number) => void
  @Prop() showPlayBtn: boolean
  @Prop() showProgress: boolean

  @Listen('touchmove', {
    target: 'document'
  })
  onDocumentTouchMove (e: TouchEvent) {
    if (!this.isDraggingProgressBall) return
    const touchX = e.touches[0].pageX
    this.percentage = this.calcPercentage(touchX)
    this.setProgressBall(this.percentage)
    this.setCurrentTime(this.percentage * this.duration)
  }

  @Listen('touchend', {
    target: 'document'
  })
  @Listen('touchcancel', {
    target: 'document'
  })
  onDocumentTouchEnd () {
    if (!this.isDraggingProgressBall) return

    this.isDraggingProgressBall = false
    this.seekFunc(this.percentage * this.duration)
    this.toggleVisibility(true)
  }

  @Method()
  async setProgressBall (percentage: number) {
    if (this.progressBallRef) {
      this.progressBallRef.style.left = `${percentage * 100}%`
    }
  }

  @Method()
  async toggleVisibility (nextVisible?: boolean) {
    const visible = nextVisible === undefined ? !this.visible : nextVisible
    if (visible) {
      this.hideControlsTimer && clearTimeout(this.hideControlsTimer)
      if (this.isPlaying) {
        this.hideControlsTimer = setTimeout(() => {
          this.toggleVisibility(false)
        }, 2000)
      }
      this.el.style.visibility = 'visible'
    } else {
      this.el.style.visibility = 'hidden'
    }
    this.visible = !!visible
  }

  @Method()
  async getIsDraggingProgressBall () {
    return this.isDraggingProgressBall
  }

  @Method()
  async setCurrentTime (time: number) {
    this.currentTimeRef.innerHTML = formatTime(time)
  }

  calcPercentage = (pageX: number): number => {
    let pos = pageX - this.progressDimensions.left
    pos = Math.max(pos, 0)
    pos = Math.min(pos, this.progressDimensions.width)
    return pos / this.progressDimensions.width
  }

  onDragProgressBallStart = () => {
    this.isDraggingProgressBall = true
    this.hideControlsTimer && clearTimeout(this.hideControlsTimer)
  }

  onClickProgress = (e: MouseEvent) => {
    e.stopPropagation()

    const percentage = this.calcPercentage(e.pageX)
    this.seekFunc(percentage * this.duration)
    this.toggleVisibility(true)
  }

  render () {
    const {
      controls,
      currentTime,
      duration,
      isPlaying,
      pauseFunc,
      playFunc,
      showPlayBtn,
      showProgress
    } = this

    const formattedDuration = formatTime(duration)
    let playBtn

    if (!showPlayBtn) {
      playBtn = null
    } else if (isPlaying) {
      playBtn = <div class='taro-video-control-button taro-video-control-button-pause' onClick={pauseFunc} />
    } else {
      playBtn = <div class='taro-video-control-button taro-video-control-button-play' onClick={playFunc} />
    }

    return (
      <Host class='taro-video-bar taro-video-bar-full'>
        {controls && (
          <div class='taro-video-controls'>
            {playBtn}
            {showProgress && (
              <div class='taro-video-current-time' ref={dom => (this.currentTimeRef = dom as HTMLDivElement)}>
                {formatTime(currentTime)}
              </div>
            )}
            {showProgress && (
              <div class='taro-video-progress-container' onClick={this.onClickProgress}>
                <div
                  class='taro-video-progress'
                  ref={ref => {
                    if (!ref) return
                    const rect = ref.getBoundingClientRect()
                    this.progressDimensions.left = rect.left
                    this.progressDimensions.width = rect.width
                  }}>
                  <div class='taro-video-progress-buffered' style={{ width: '100%' }} />
                  <div
                    class='taro-video-ball'
                    ref={dom => (this.progressBallRef = dom as HTMLDivElement)}
                    onTouchStart={this.onDragProgressBallStart}
                    style={{
                      left: `${formattedDuration ? (this.currentTime / duration) * 100 : 0}%`
                    }}
                  >
                    <div class='taro-video-inner' />
                  </div>
                </div>
              </div>
            )}
            {showProgress && <div class='taro-video-duration'>{formattedDuration}</div>}
          </div>
        )}
        <slot />
      </Host>
    )
  }
}

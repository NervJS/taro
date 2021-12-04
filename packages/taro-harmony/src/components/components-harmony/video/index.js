import { createOption } from '../utils'

const NUM_HORIZONTAL = -90
const NUM_HORIZONTAL_ANTI = 90
const NUM_VERTICAL = 0

export default createOption({
  props: [
    'id',
    'src',
    'controls',
    'autoplay',
    'speed',
    'loop',
    'muted',
    'initialTime',
    'direction',
    'objectFit',
    'poster'
  ],

  data () {
    let videoDirection = 'auto'
    if (this.direction === NUM_VERTICAL) {
      videoDirection = 'vertical'
    } else if (this.direction === NUM_HORIZONTAL || this.direction === NUM_HORIZONTAL_ANTI) {
      videoDirection = 'horizontal'
    }

    return {
      duration: 0,
      videoDirection
    }
  },

  preparedCallback: function (e) {
    this.duration = e.duration
    this.$trigger('loadedmetadata', { duration: this.duration })
  },
  startCallback: function () {
    this.$trigger('play')
  },
  pauseCallback: function () {
    this.$trigger('pause')
  },
  finishCallback: function () {
    this.$trigger('ended')
  },
  stopCallback: function () {
    this.$trigger('stop')
  },
  errorCallback: function () {
    this.$trigger('error')
  },
  seekedCallback: function (e) {
    const buffered = this.duration > 0 ? (e.currenttime / this.duration) * 100 : 0
    this.$trigger('progress', { buffered })
  },
  timeupdateCallback: function (e) {
    this.$trigger('timeupdate', { currentTime: e.currenttime, duration: this.duration })
  },
  clickCallback: function () {
    this.$trigger('tap')
  },
  fullscreenChangeCallback: function (e) {
    const isFullScreen = !!e.fullscreen
    let direction = NUM_VERTICAL
    if (isFullScreen) {
      direction = this.videoDirection === 'horizontal' ? NUM_HORIZONTAL_ANTI : NUM_VERTICAL
    }
    this.$trigger('fullscreenchange', { fullScreen: isFullScreen, direction })
  }
})

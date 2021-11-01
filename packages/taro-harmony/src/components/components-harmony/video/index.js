const NUM_HORIZONTAL = -90
const NUM_HORIZONTAL_ANTI = 90
const NUM_VERTICAL = 0

export default {
  props: [
    'id',
    'cls',
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
    this.$emit('loadedmetadata', { id: this.id, duration: this.duration })
  },
  startCallback: function () {
    this.$emit('play', { id: this.id })
  },
  pauseCallback: function () {
    this.$emit('pause', { id: this.id })
  },
  finishCallback: function () {
    this.$emit('ended', { id: this.id })
  },
  stopCallback: function () {
    this.$emit('stop', { id: this.id })
  },
  errorCallback: function () {
    this.$emit('error', { id: this.id })
  },
  seekedCallback: function (e) {
    const buffered = this.duration > 0 ? (e.currenttime / this.duration) * 100 : 0
    this.$emit('progress', { id: this.id, buffered })
  },
  timeupdateCallback: function (e) {
    this.$emit('timeupdate', { id: this.id, currentTime: e.currenttime, duration: this.duration })
  },
  clickCallback: function () {
    this.$emit('tap', { id: this.id })
  },
  fullscreenChangeCallback: function (e) {
    const isFullScreen = !!e.fullscreen
    let direction = NUM_VERTICAL
    if (isFullScreen) {
      direction = this.videoDirection === 'horizontal' ? NUM_HORIZONTAL_ANTI : NUM_VERTICAL
    }
    this.$emit('fullscreenchange', { id: this.id, fullScreen: isFullScreen, direction })
  }
}

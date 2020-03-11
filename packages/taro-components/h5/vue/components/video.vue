<script>
export default {
  name: 'taro-video',
  props: {
    isFullScreen: Boolean
  },
  render (createElement) {
    return createElement('taro-video-core', {
      'class': ['hydrated taro-video-container', {
        'taro-video-type-fullscreen': this.isFullScreen
      }],
      attrs: {
        'is-full-screen': this.isFullScreen
      },
      'on': this.$listeners
    }, this.$slots.default)
  }
}
</script>

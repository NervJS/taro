<script>
export default {
  name: 'taro-image',
  props: {
    mode: String
  },
  render (createElement) {
    return createElement('taro-image-core', {
      'class': ['hydrated taro-img', {
        'taro-img__widthfix': this.mode === 'widthFix'
      }],
      attrs: {
        mode: this.mode
      },
      'on': this.$listeners
    }, this.$slots.default)
  }
}
</script>

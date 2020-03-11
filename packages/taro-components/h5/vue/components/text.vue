<script>
export default {
  name: 'taro-text',
  props: {
    selectable: Boolean
  },
  render (createElement) {
    return createElement('taro-text-core', {
      'class': ['hydrated taro-text', {
        'taro-text__selectable': this.selectable
      }],
      attrs: {
        selectable: this.selectable
      },
      'on': this.$listeners
    }, this.$slots.default)
  }
}
</script>

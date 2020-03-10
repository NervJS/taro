<script>
export default {
  name: 'taro-input',
  props: {
    focus: Boolean
  },
  render (createElement) {
    const self = this
    return createElement('taro-input-core', {
        'class': 'hydrate',
        'attrs': {
          'auto-focus': self.focus
        },
        'on': {
          input (e) {
            self.$emit('input', e)
          },
          focus (e) {
            self.$emit('focus', e)
          },
          blur (e) {
            self.$emit('blur', e)
          },
          confirm (e) {
            self.$emit('confirm', e)
          },
          change (e) {
            self.$emit('change', e)
          },
          keydown (e) {
            self.$emit('keydown', e)
          }
        }
      }, this.$slots.default)
  }
}
</script>

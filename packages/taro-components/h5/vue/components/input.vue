<script>
import { listeners } from '../mixins/listeners'
export default {
  name: 'taro-input',
  mixins: [listeners],
  model: {
    event: 'model'
  },
  props: {
    focus: Boolean
  },
  render (createElement) {
    const self = this
    return createElement('taro-input-core', {
        class: 'hydrated',
        attrs: {
          'auto-focus': self.focus
        },
        'on': {
          ...this.listeners,
          input (e) {
            self.$emit('input', e)
            self.$emit('model', e.target.value)
          }
        }
      }, this.$slots.default)
  }
}
</script>

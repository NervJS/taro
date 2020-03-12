<script>
import { listeners } from '../mixins/listeners'
export default {
  name: 'taro-picker',
  mixins: [listeners],
  model: {
    event: 'model'
  },
  props: {
    range: Array,
    value: [Number, String, Array]
  },
  mounted () {
    this.$el.value = this.value
  },
  watch: {
    value (newVal) {
      this.$el.value = newVal
    }
  },
  render (createElement) {
    const self = this

    return createElement('taro-picker-core', {
      class: 'hydrated',
      domProps: {
        range: self.range
      },
      on: {
        ...self.listeners,
        change (e) {
          self.$emit('change', e)
          self.$emit('model', e.target.value)
        }
      }
    }, self.$slots.default)
  }
}
</script>

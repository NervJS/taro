<script>
import { listeners } from '../mixins/listeners'
export default {
  name: 'taro-text',
  mixins: [listeners],
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
      'on': this.listeners
    }, this.$slots.default)
  }
}
</script>

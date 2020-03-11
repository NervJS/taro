<script>
import { listeners } from '../mixins/listeners'
export default {
  name: 'taro-image',
  mixins: [listeners],
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
      'on': this.listeners
    }, this.$slots.default)
  }
}
</script>

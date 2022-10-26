import { listeners } from './mixins/listeners'
import { refs } from './mixins/refs'

export default {
  name: 'taro-image',
  mixins: [listeners, refs],
  props: {
    mode: String
  },
  render (createElement) {
    return createElement('taro-image-core', {
      class: ['hydrated', {
        'taro-img__widthfix': this.mode === 'widthFix'
      }],
      attrs: {
        mode: this.mode
      },
      on: this.listeners
    }, this.$slots.default)
  }
}

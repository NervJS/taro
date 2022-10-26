import { listeners } from './mixins/listeners'
import { refs } from './mixins/refs'

export default {
  name: 'taro-text',
  mixins: [listeners, refs],
  props: {
    selectable: Boolean
  },
  render (createElement) {
    return createElement('taro-text-core', {
      class: ['hydrated', {
        'taro-text__selectable': this.selectable
      }],
      attrs: {
        selectable: this.selectable
      },
      on: this.listeners
    }, this.$slots.default)
  }
}

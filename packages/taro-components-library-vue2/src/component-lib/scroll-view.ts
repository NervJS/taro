import { listeners } from './mixins/listeners'
import { refs } from './mixins/refs'

export default {
  name: 'taro-scroll-view',
  mixins: [listeners, refs],
  props: {
    scrollX: Boolean,
    scrollY: Boolean
  },
  render (createElement) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    const attrs = {}
    if (self.scrollX) attrs['scroll-x'] = true
    if (self.scrollY) attrs['scroll-y'] = true

    return createElement('taro-scroll-view-core', {
      class: ['hydrated', {
        'taro-scroll-view__scroll-x': self.scrollX,
        'taro-scroll-view__scroll-y': self.scrollY
      }],
      attrs,
      on: {
        ...self.listeners,
        scroll (e) {
          if (e instanceof CustomEvent) {
            self.$emit('scroll', e)
          }
        }
      }
    }, self.$slots.default)
  }
}

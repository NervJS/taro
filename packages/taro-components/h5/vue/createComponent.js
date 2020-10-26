import { listeners } from './mixins/listeners'
import { refs } from './mixins/refs'

export default function createComponent (name, classNames = []) {
  return {
    name,
    mixins: [listeners, refs],
    render (createElement) {
      return createElement(`${name}-core`, {
        class: ['hydrated', ...classNames],
        on: this.listeners
      }, this.$slots.default)
    }
  }
}

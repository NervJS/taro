import { listeners } from './mixins/listeners'
import { refs } from './mixins/refs'

export default function createComponent (name, classNames = []) {
  return {
    name,
    mixins: [listeners, refs],
    props: ['nativeProps'],
    render (createElement) {
      return createElement(`${name}-core`, {
        class: ['hydrated', ...classNames],
        domProps: {
          nativeProps: this.nativeProps
        },
        attrs: this.$attrs,
        on: this.listeners
      }, this.$slots.default)
    }
  }
}

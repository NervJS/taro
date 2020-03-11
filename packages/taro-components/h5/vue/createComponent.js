import { listeners } from './mixins/listeners'

export default function createComponent (name, classNames = []) {
  return {
    name,
    mixins: [listeners],
    render (createElement) {
      return createElement(`${name}-core`, {
        class: ['hydrated', ...classNames],
        on: this.listeners
      }, this.$slots.default)
    }
  }
}

export default function createComponent (name, classNames = []) {
  return {
    name,
    render (createElement) {
      return createElement(`${name}-core`, {
        class: ['hydrated', ...classNames],
        on: this.$listeners
      }, this.$slots.default)
    }
  }
}

export default function createComponent (name) {
  return {
    name,
    render (createElement) {
      return createElement(`${name}-core`, {
        class: 'hydrated',
        on: this.$listeners
      }, this.$slots.default)
    }
  }
}

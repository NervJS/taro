export const listeners = {
  computed: {
    listeners () {
      const vm = this
      return {
        ...vm.$listeners,
        click(e) {
          vm.$emit('tap', e)
        }
      }
    }
  }
}
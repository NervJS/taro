export const listeners = {
  computed: {
    listeners () {
      // eslint-disable-next-line
      const vm = this
      return {
        ...vm.$listeners,
        click (e) {
          vm.$emit('tap', e)
        }
      }
    }
  }
}

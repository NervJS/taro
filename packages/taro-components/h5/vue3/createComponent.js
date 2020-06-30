import { h } from 'vue'

export default function createComponent (name, classNames = []) {
  return {
    emits: ['tap'],
    setup (props, { slots, emit }) {
      return () => (
        h(
          `${name}-core`,
          {
            class: ['hydrated', ...classNames],
            onClick (e) {
              emit('tap', e)
            }
          },
          slots
        )
      )
    }
  }
}

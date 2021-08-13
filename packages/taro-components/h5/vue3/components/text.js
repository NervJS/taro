import { h } from 'vue'

export default {
  emits: ['tap'],
  setup (props, { slots, emit, attrs }) {
    return () => (
      h(
        'taro-text-core',
        {
          class: ['hydrated', {
            'taro-text_selectable': attrs.selectable
          }],
          onClick (e) {
            emit('tap', e)
          }
        },
        slots
      )
    )
  }
}

import { h } from 'vue'

export default {
  emits: ['tap'],
  setup (props, { slots, emit, attrs }) {
    return () => (
      h(
        'taro-image-core',
        {
          class: ['hydrated', {
            'taro-img__widthfix': attrs.mode === 'widthFix'
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

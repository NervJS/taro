import { h } from 'vue'

export default {
  emits: ['tap', 'scroll'],
  setup (props, { slots, emit, attrs }) {
    return () => (
      h(
        'taro-scroll-view-core',
        {
          class: ['hydrated', {
            'taro-scroll-view__scroll-x': attrs['scroll-x'] === '',
            'taro-scroll-view__scroll-y': attrs['scroll-y'] === ''
          }],
          onClick (e) {
            emit('tap', e)
          },
          onScroll (e) {
            if (e instanceof CustomEvent) {
              emit('scroll', e)
            }
          }
        },
        slots
      )
    )
  }
}

import { h } from 'vue'

import { useForwardRef } from './forwardRef'

export default {
  emits: ['tap', 'scroll'],
  setup (__props, { slots, emit, attrs }) {
    const forwardRef = useForwardRef()
    return () => (
      h(
        'taro-scroll-view-core',
        {
          ref: forwardRef,
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

import { h } from 'vue'

import { useForwardRef } from './forwardRef'

export default {
  emits: ['tap'],
  setup (__props, { slots, emit, attrs }) {
    const iconType = attrs.type.replace(/_/g, '-')

    const forwardRef = useForwardRef()

    return () => (
      h(
        'taro-icon-core',
        {
          ref: forwardRef,
          class: ['hydrated', `weui-icon-${iconType}`],
          onClick (e) {
            emit('tap', e)
          }
        },
        slots
      )
    )
  }
}

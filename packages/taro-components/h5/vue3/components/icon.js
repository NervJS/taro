import { h } from 'vue'

export default {
  emits: ['tap'],
  setup (props, { slots, emit, attrs }) {
    const iconType = attrs.type.replace(/_/g, '-')

    return () => (
      h(
        'taro-icon-core',
        {
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

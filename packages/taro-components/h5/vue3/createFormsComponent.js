import { h } from 'vue'

export default function createFormsComponent (name, eventName, modelValue = 'value', classNames = []) {
  const props = {
    modelValue: null
  }
  if (name === 'taro-input') {
    props.focus = Boolean
  }

  return {
    emits: ['tap', 'update:modelValue'],
    props,
    setup (props, { slots, emit }) {
      const attrs = {
        [modelValue]: props.modelValue
      }

      if (name === 'taro-input') {
        attrs['auto-focus'] = props.focus
      }

      return () => (
        h(
          `${name}-core`,
          {
            class: ['hydrated', ...classNames],
            ...attrs,
            onClick (e) {
              emit('tap', e)
            },
            [`on${eventName}`] (e) {
              emit('update:modelValue', e.target.value)
            }
          },
          slots
        )
      )
    }
  }
}

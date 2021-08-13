import { h, toRefs, computed } from 'vue'

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
      const { modelValue: model, focus } = toRefs(props)

      const attrs = computed(() => {
        return name === 'taro-input'
          ? {
            [modelValue]: model.value,
            'auto-focus': focus.value
          }
          : {
            [modelValue]: model.value
          }
      })

      return () => (
        h(
          `${name}-core`,
          {
            class: ['hydrated', ...classNames],
            ...attrs.value,
            onClick (e) {
              emit('tap', e)
            },
            [`on${eventName}`] (e) {
              emit('update:modelValue', e.detail.value)
            }
          },
          slots
        )
      )
    }
  }
}

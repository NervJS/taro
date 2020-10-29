import { listeners } from './mixins/listeners'
import { refs } from './mixins/refs'
export default function createFormsComponent (name, event, modelValue = 'value', classNames = []) {
  const props = {}
  if (name === 'taro-input') {
    props.focus = Boolean
  }

  return {
    name,
    mixins: [listeners, refs],
    model: {
      prop: modelValue,
      event: 'model'
    },
    props,
    methods: {
      input (e) {
        this.$emit('input', e)
        this.$emit('model', e.target.value)
      },
      change (e) {
        this.$emit('change', e)
        this.$emit('model', e.target.value)
      }
    },
    render (createElement) {
      // eslint-disable-next-line
      const self = this;

      const attrs = {}
      if (name === 'taro-input') {
        attrs['auto-focus'] = self.focus
      }

      const on = { ...self.listeners }
      on[event] = self[event]

      return createElement(`${name}-core`, {
        class: ['hydrated', ...classNames],
        attrs,
        on
      }, self.$slots.default)
    }
  }
}

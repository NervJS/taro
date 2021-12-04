import { createOption } from '../utils'

export default createOption({
  props: [
    'id',
    'type',
    'checked',
    'disabled',
    'showtext',
    'texton',
    'textoff'
  ],
  onChange (e) {
    this.$trigger('change', { value: e.checked })
  }
})

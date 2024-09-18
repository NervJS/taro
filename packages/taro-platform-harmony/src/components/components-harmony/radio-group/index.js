import { createOption } from '../utils'

export default createOption({
  props: [
    'id'
  ],

  onChange (e) {
    this.$trigger('change', { value: e.value })
  }
})

import { createOption } from '../utils'

export default createOption({
  data: {
    values: []
  },
  props: [
    'id'
  ],
  onChange () {
    this.$trigger('change', { value: this.values })
  },
  collectValue (value) {
    this.values.push(value)
  },
  removeValue (value) {
    const idx = this.values.indexOf(value)
    if (idx > -1) {
      this.values.splice(idx, 1)
    }
  }
})

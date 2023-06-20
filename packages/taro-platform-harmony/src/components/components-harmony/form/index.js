import { createOption } from '../utils'

export default createOption({
  props: ['cls', 'id'],
  onSubmit (e) {
    this.$trigger('submit', { value: e.value })
  },
  onReset () {
    this.$trigger('reset')
  }
})

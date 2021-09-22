export default {
  data: {
    values: []
  },
  props: [
    'cls',
    'id'
  ],
  onChange () {
    this.$emit('change', { value: this.values, id: this.id })
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
}

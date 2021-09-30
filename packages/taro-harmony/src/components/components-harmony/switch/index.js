export default {
  props: [
    'id',
    'cls',
    'type',
    'checked',
    'disabled',
    'showtext',
    'texton',
    'textoff'
  ],
  onChange (e) {
    this.$emit('change', { value: e.checked })
  }
}

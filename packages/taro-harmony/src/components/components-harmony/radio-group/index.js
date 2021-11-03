export default {
  props: [
    'id',
    'cls'
  ],

  onChange (e) {
    this.$trigger('change', { value: e.value })
  }
}

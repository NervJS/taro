export default {
  props: [
    'cls',
    'id',
    'indicatorDots',
    'indicatorColor',
    'indicatorActiveColor',
    'autoplay',
    'current',
    'interval',
    'duration',
    'circular',
    'vertical'
  ],
  onChange (e) {
    this.$emit('change', { current: e.index, id: this.id })
  }
}

import { createOption } from '../utils'

export default createOption({
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
    this.$trigger('change', { current: e.index })
  }
})

import { createOption } from '../utils'

export default createOption({
  props: {
    id: String,
    scrollX: {
      default: false
    },
    scrollY: {
      default: false
    },
    scrollTop: Number,
    scrollLeft: Number,
    scrollWithAnimation: {
      default: false
    }
  },
  computed: {
    flexDirection () {
      return this.scrollX ? 'row' : (this.scrollY && 'column')
    }
  },
  onInit () {
    this.$watch('scrollTop', 'onScrollTopChange')
    this.$watch('scrollLeft', 'onScrollLeftChange')
  },
  onScrollTopChange (newVal) {
    this.scrollTo('y', newVal)
  },
  onScrollLeftChange (newVal) {
    this.scrollTo('x', newVal)
  },
  scrollTo (direction, offset) {
    const el = this.$refs.el
    const options = {
      smooth: this.scrollWithAnimation
    }
    options['d' + direction] = offset - el.getScrollOffset()[direction]
    el.scrollBy(options)
  },
  onReachStart () {
    this.triggerScrollToUpper('left')
  },
  onReachEnd () {
    this.triggerScrollToLower('right')
  },
  onReachTop () {
    this.triggerScrollToUpper('top')
  },
  onReachBottom () {
    this.triggerScrollToLower('bottom')
  },
  triggerScrollToUpper (direction) {
    this.$trigger('scrolltoupper', {
      type: 'scrolltoupper',
      detail: { direction }
    })
  },
  triggerScrollToLower (direction) {
    this.$trigger('scrolltolower', {
      type: 'scrolltolower',
      detail: { direction }
    })
  }
})

import { covertHex3ToHex6, createOption } from '../utils'

export default createOption({
  props: [
    'id',
    'min',
    'max',
    'step',
    'disabled',
    'value',
    'backgroundcolor',
    'activecolor',
    'blockColor',
    'showValue',
    'showsteps',
    'showtips'
    // 命名规则不一致因为 internalComponents 中有些使用驼峰，有些是短线，和其保持一致
  ],
  computed: {
    color () {
      return covertHex3ToHex6(this.backgroundcolor)
    },
    selectedColor () {
      return covertHex3ToHex6(this.activecolor)
    },
    sliderBlockColor () {
      return covertHex3ToHex6(this.blockColor)
    },
    valueWidth () {
      if (!this.showValue) {
        return '0px'
      }
      let baseWidth = 28
      const maxLen = Math.max(this.min.toString()?.length, this.max.toString()?.length, this.step.toString()?.length)
      if (maxLen > 3) {
        baseWidth = baseWidth + (maxLen - 3) * 15
      }
      return baseWidth + 'vp'
    }
  },
  data () {
    return {
      currentValue: this.value || 0
    }
  },
  onChange (e) {
    if (e.isEnd === 'true') {
      this.$trigger('change', { progress: e.progress, isEnd: e.isEnd, value: e.value })
    }
    this.$trigger('changing', { progress: e.progress, isEnd: e.isEnd, value: e.value })
    this.currentValue = e.value
  }
})

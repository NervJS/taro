import { covertHex3ToHex6 } from '../utils'

export default {
  props: [
    'id',
    'cls',
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
    // 命名规则不一致因为 internalComponents中有些使用驼峰，有些是短线，和其保持一致
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
    }
  },
  data () {
    return {
      currentValue: this.value || 0
    }
  },
  onChange (e) {
    if (e.isEnd === 'true') {
      this.$emit('change', { id: this.id, progress: e.progress, isEnd: e.isEnd, value: e.value })
    }
    this.$emit('changing', { id: this.id, progress: e.progress, isEnd: e.isEnd, value: e.value })
    this.currentValue = e.value
  }
}

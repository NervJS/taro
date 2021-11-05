import { covertHex3ToHex6 } from '../utils'

export default {
  props: [
    'type',
    'percent',
    'secondarypercent',
    'clockwise',
    'showInfo',
    'fontSize',
    'strokeWidth',
    'activeColor',
    'backgroundColor'
  ],
  computed: {
    progressColor () {
      return covertHex3ToHex6(this.activeColor)
    },
    progressBgColor () {
      return covertHex3ToHex6(this.backgroundColor)
    }
  }
}

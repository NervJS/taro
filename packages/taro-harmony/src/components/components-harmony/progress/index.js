export default {
  props: [
    'cls',
    'type',
    'percent',
    'secondarypercent',
    'clockwise',
    'showInfo',
    'borderRadius',
    'fontSize',
    'strokeWidth',
    'color',
    'activeColor',
    'backgroundColor',
    'active',
    'activeMode',
    'duration'
  ],
  computed: {
    progressColor () {
      return this.filterColor(this.activeColor)
    },
    progressBgColor () {
      return this.filterColor(this.backgroundColor)
    }
  },
  // 颜色只能用6位颜色符号 如：#ff0000
  filterColor (v) {
    const reg = /^#([0-9a-fA-F]{3})$/
    if (reg.test(v)) {
      const c = v.substring(1).split('')
      let s = '#'
      for (let i = 0; i < c.length; i++) {
        s += c[i] + c[i]
      }
      return s
    }
    return v
  }
}

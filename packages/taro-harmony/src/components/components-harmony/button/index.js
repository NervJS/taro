import { createOption } from '../utils'

export default createOption({
  props: {
    id: '',
    cls: '',
    type: 'capsule',
    harmonyType: 'capsule',
    size: 'default',
    plain: false,
    disabled: false,
    loading: false,
    hoverStartTime: 20,
    hoverStayTime: 70,
    hoverClass: 'button-hover',
    cn: []
  },
  data () {
    return {
      hover: false,
      touch: false
    }
  },
  computed: {
    clsType () {
      return `type-${this.type}`
    },
    clsSize () {
      return `size-${this.size}`
    },
    clsPlain () {
      if (!this.plain) return ''
      return `type-${this.type}-plain`
    },
    clsDisable () {
      if (!this.disabled) return ''
      return 'disabled'
    },
    clsDisableType () {
      if (!this.disabled) return ''
      if (this.plain) return `type-${this.type}-plain-disabled`
      return `type-${this.type}-disabled`
    },
    clsHover () {
      return this.hover && !this.disabled ? this.hoverClass : ''
    },
    value () {
      return (this.cn[0] && this.cn[0].v) || ''
    }
  },
  onTouchStart () {
    if (this.disabled) {
      return
    }

    this.touch = true
    if (this.hoverClass && !this.disabled) {
      setTimeout(() => {
        if (this.touch) {
          this.hover = true
        }
      }, this.hoverStartTime)
    }
  },
  onTouchEnd () {
    if (this.disabled) {
      return
    }

    this.touch = false
    if (this.hoverClass && !this.disabled) {
      setTimeout(() => {
        if (!this.touch) {
          this.hover = false
        }
      }, this.hoverStayTime)
    }
  }
})

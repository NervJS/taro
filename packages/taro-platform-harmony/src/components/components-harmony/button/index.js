import { createOption } from '../utils'

export default createOption({
  props: {
    id: {
      default: ''
    },
    cls: {
      default: ''
    },
    type: {
      default: 'default'
    },
    harmonyType: {
      default: 'capsule'
    },
    size: {
      default: 'default'
    },
    plain: {
      default: false
    },
    disabled: {
      default: false
    },
    loading: {
      default: false
    },
    hoverStartTime: {
      default: 20
    },
    hoverStayTime: {
      default: 70
    },
    hoverClass: {
      default: 'button-hover'
    },
    formType: {
      default: null
    },
    cn: {
      default: []
    }
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
    clsLoading () {
      if (!this.loading) return ''
      return `type-${this.type}-loading`
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
      return this.cn.map(i => i.v).join('')
    }
  },
  onTouchStart () {
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
    this.touch = false
    if (this.hoverClass && !this.disabled) {
      setTimeout(() => {
        if (!this.touch) {
          this.hover = false
        }
      }, this.hoverStayTime)
    }
  },
  onClick () {
    this.$trigger('tap')
  }
})

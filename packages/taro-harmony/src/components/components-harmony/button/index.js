
export default {
  props: {
    id: {
      default: ''
    },
    cls: {
      default: ''
    },
    value: {
      default: ''
    },
    type: {
      default: 'default'
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
    hover: {
      default: 'button-hover'
    },
    hoverClass: {
      default: 'a'
    }
    //  hoverStartTime: {
    //   default: '20',
    //  },
    //  hoverStayTime: {
    //   default: '70',
    //  },
  },
  data () {
    return {
      clsHover: ''
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
    }
  },

  onClick () {
    this.$emit('click', { id: this.id })
    this.handleHoverClass()
  },

  handleHoverClass () {
    this.clsHover = this.hoverClass
    const timer = setTimeout(() => {
      this.clsHover = ''
      clearTimeout(timer)
    }, 70)
  }
}

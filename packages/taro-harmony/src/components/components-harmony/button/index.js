import { createOption } from '../utils'

export default createOption({
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
  }
})

import window from '@ohos.window'

export default {
  data: {
    type: 'keyboardHeightChange',
    windowClass: null,
    height: 0
  },
  props: {
    id: String,
    value: String,
    cls: String,
    type: String,
    password: Boolean,
    placeholder: String,
    placeholderColor: '#99000000',
    disabled: Boolean,
    maxlength: {
      default: 140
    },
    focus: Boolean,
    confirmType: {
      default: 'done',
      validator: function (value) {
        const isValidConfirmType = ['default', 'next', 'go', 'done', 'send', 'search'].indexOf(value) !== -1
        if (!isValidConfirmType) {
          console.warn('unsupported props-confirmType:' + value + ', will use default confirmType[done].')
        }
        return isValidConfirmType
      }
    }
  },

  computed: {
    realType () {
      let temp = this.type
      if (this.password === true) {
        temp = 'password'
      }
      return temp
    }
  },

  onInit () {
    this.windowClass = window.getTopWindow()
    this.windowClass.then(win => {
      win.on('keyboardHeightChange', (err, data) => {
        if (!err) {
          if (this.height !== data.height) {
            this.onKeyboardHeightChange(data.height)
          }
          this.height = data.height
        }
      })
    })
  },

  onInput (e) {
    this.value = e.value
    this.$emit('input', {
      id: this.id, value: e.value, cursor: this.value.length, keyCode: null
    })
  },

  onFocus () {
    this.$emit('focus', {
      id: this.id, value: this.value, height: this.height
    })
  },

  onBlur () {
    this.$emit('blur', {
      id: this.id, value: this.value
    })
  },

  onEnterKeyClick () {
    this.$emit('confirm', {
      id: this.id, value: this.value
    })
  },

  onKeyboardHeightChange (height) {
    this.$emit('keyboardheightchange', {
      id: this.id, height: height, duration: 0
    })
  },

  onDestroy () {
    if (this.windowClass) {
      this.windowClass.off(this.type)
    }
  }
}

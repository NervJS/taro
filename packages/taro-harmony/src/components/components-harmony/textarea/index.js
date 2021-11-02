import window from '@ohos.window'

export default {
  data: {
    textareaValue: '',
    height: 0
  },

  props: [
    'id',
    'cls',
    'value',
    'placeholder',
    'maxlength',
    'autoFocus',
    'selectionStart',
    'selectionEnd',
    'headerIcon',
    'showcounter',
    'menuoptions',
    'softkeyboardenabled'
  ],

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
    this.textareaValue = e.value
    this.$emit('input', {
      id: this.id, value: e.text, cursor: e.text.length, keyCode: null
    })
  },

  onFocus () {
    this.$emit('focus', {
      id: this.id, value: this.textareaValue, height: this.height
    })
  },

  onBlur () {
    this.$emit('blur', {
      id: this.id, value: this.textareaValue, height: this.height
    })
  },

  onTranslate (e) {
    this.$emit('translate', e)
  },

  onShare (e) {
    this.$emit('share', e)
  },

  onSearch (e) {
    this.$emit('confirm', {
      id: this.id, ...e
    })
  },

  onOptionSelect (e) {
    this.$emit('optionselect', e)
  },

  onSelectChange (e) {
    this.$emit('selectchange', e)
  },

  onKeyboardHeightChange (height) {
    this.$emit('keyboardheightchange', {
      id: this.id, height, duration: 0
    })
  }
}

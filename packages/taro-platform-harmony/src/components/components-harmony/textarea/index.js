import window from '@ohos.window'

import { createOption } from '../utils'

export default createOption({
  data () {
    return {
      textareaValue: this.value || '',
      height: 0
    }
  },

  props: [
    'id',
    'value',
    'disabled',
    'placeholder',
    'maxlength',
    'autoFocus',
    'autoHeight',
    'selectionStart',
    'selectionEnd',
    'headericon',
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
    this.$watch('value', 'onPropertyChange')
  },

  onPropertyChange (newV) {
    this.textareaValue = newV
  },

  onInput (e) {
    this.textareaValue = e.value
    this.$trigger('input', {
      value: e.text, cursor: e.text.length, keyCode: null
    })
  },

  onFocus () {
    this.$trigger('focus', {
      value: this.textareaValue, height: this.height
    })
  },

  onBlur () {
    this.$trigger('blur', {
      value: this.textareaValue, height: this.height
    })
  },

  onTranslate (e) {
    this.$trigger('translate', e)
  },

  onShare (e) {
    this.$trigger('share', e)
  },

  onSearch (e) {
    this.$trigger('search', e)
  },

  onOptionSelect (e) {
    this.$trigger('optionselect', e)
  },

  onSelectChange (e) {
    this.$trigger('selectchange', e)
  },

  onKeyboardHeightChange (height) {
    this.$trigger('keyboardheightchange', {
      height, duration: 0
    })
  }
})

export default {
  data: {
    textareaValue: ''
  },
  props: [
    'id',
    'cls',
    'value',
    'placeholder',
    'placeholderStyle',
    'placeholderClass',
    'disabled',
    'maxlength',
    'autoFocus',
    'focus',
    'fixed',
    'cursorSpacing',
    'cursor',
    'showConfirmBar',
    'selectionStart',
    'selectionEnd',
    'adjustPosition',
    'holdKeyboard',
    'disableDefaultPadding',
    'headerIcon',
    'showcounter',
    'menuoptions',
    'softkeyboardenabled'
  ],
  onInput (e) {
    this.textareaValue = e.value
    this.$emit('input', {
      id: this.id, value: e.text, cursor: e.text.length, keyCode: null
    })
  },
  onFocus () {
    this.$emit('focus', {
      id: this.id, value: this.textareaValue
    })
  },
  onBlur () {
    this.$emit('blur', {
      id: this.id, value: this.textareaValue
    })
  },
  onTranslate (e) {
    this.$emit('translate', e)
  },
  onShare (e) {
    this.$emit('share', e)
  },
  onSearch (e) {
    this.$emit('search', e)
  },
  onOptionSelect (e) {
    this.$emit('optionselect', e)
  },
  onSelectChange (e) {
    this.$emit('selectchange', e)
  }
}

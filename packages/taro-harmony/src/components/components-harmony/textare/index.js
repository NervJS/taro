export default {
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
  onChange (e) {
    this.$emit('input', { current: { value: e.text } })
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

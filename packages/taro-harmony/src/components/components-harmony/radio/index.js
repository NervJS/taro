export default {
  props: [
    'id',
    'cls',
    'groupId',
    'value',
    'checked',
    'disabled'
  ],

  onChange (e) {
    if (e.checked) {
      const radioGroup = this.findRadioGroup()
      if (radioGroup && radioGroup.onChange) {
        radioGroup.onChange({ id: this.id, value: e.value })
      }
    }
  },

  findRadioGroup () {
    let parent = this.$parent()
    while (parent) {
      if (!parent.$child) break
      const radioItem = parent.$child(this.id)
      if (radioItem) {
        return parent
      }
      parent = parent.$parent()
    }
  }

}

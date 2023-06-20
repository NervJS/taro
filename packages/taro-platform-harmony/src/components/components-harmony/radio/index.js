export default {
  props: [
    'id',
    'name',
    'groupId',
    'value',
    'checked',
    'disabled'
  ],

  computed: {
    nameValue () {
      let name = this.name
      if (this.groupId) {
        name = this.groupId
      }
      return name
    }
  },

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
      const radioGroup = parent.$child(this.groupId)
      if (radioGroup) {
        return radioGroup
      }
      parent = parent.$parent()
    }
  }
}

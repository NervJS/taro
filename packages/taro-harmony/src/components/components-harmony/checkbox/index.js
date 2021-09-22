export default {
  props: [
    'id',
    'cls',
    'value',
    'disabled',
    'checked',
    'groupId'
  ],
  onAttached () {
    const checkboxGroup = this.findCheckboxGroup()
    if (this.checked) {
      checkboxGroup.collectValue(this.value)
    }
  },
  onChange (e) {
    const checkboxGroup = this.findCheckboxGroup()
    if (e.checked) {
      checkboxGroup.collectValue(this.value)
    } else {
      checkboxGroup.removeValue(this.value)
    }
    checkboxGroup.onChange()
  },
  onDestroy () {
    const checkboxGroup = this.findCheckboxGroup()
    if (this.checked) {
      checkboxGroup.removeValue(this.value)
    }
  },
  findCheckboxGroup () {
    let parent = this.$parent()
    while (parent) {
      // parent.$child(this.groupId) 这是鸿蒙的 bug。
      // 等待修复后，直接 parent 就行
      const checkboxGroup = parent.$child(this.groupId)
      if (checkboxGroup) {
        return checkboxGroup
      }
      parent = parent.$parent()
    }
  }
}

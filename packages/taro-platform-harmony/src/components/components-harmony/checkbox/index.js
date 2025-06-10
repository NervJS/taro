export default {
  props: [
    'id',
    'value',
    'name',
    'disabled',
    'checked',
    'groupId',
    'cn'
  ],
  computed: {
    textValue () {
      const cn = this.cn
      return cn && cn[0] && cn[0].nn === '#text' ? cn[0].v : ''
    }
  },
  onAttached () {
    const checkboxGroup = this.findCheckboxGroup()
    if (checkboxGroup && this.checked) {
      checkboxGroup.collectValue(this.value)
    }
  },
  onChange (e) {
    const checkboxGroup = this.findCheckboxGroup()

    if (!checkboxGroup) return

    if (e.checked) {
      checkboxGroup.collectValue(this.value)
    } else {
      checkboxGroup.removeValue(this.value)
    }
    checkboxGroup.onChange()
  },
  onDestroy () {
    let checkboxGroup

    try {
      // 可能父元素已经卸载了，不 catch 会报错
      checkboxGroup = this.findCheckboxGroup()
    // eslint-disable-next-line no-empty
    } catch (error) {}

    if (checkboxGroup && this.checked) {
      checkboxGroup.removeValue(this.value)
    }
  },
  findCheckboxGroup () {
    let parent = this.$parent()
    while (parent && parent.$child) {
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

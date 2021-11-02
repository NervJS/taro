export function covertHex3ToHex6 (color) {
  return color && color.replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i, '#$1$1$2$2$3$3')
}

export function createOption (option) {
  option.$trigger = function (event, params) {
    this.$emit(event, { id: this.id, ...params })
  }
  return option
}

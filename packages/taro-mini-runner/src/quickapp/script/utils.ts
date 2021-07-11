export function setData (data: Record<string, unknown>, cb?: () => void) {
  for (const k in data) {
    this.$set(k, data[k])
  }

  // nextTick
  cb && setTimeout(cb)
}

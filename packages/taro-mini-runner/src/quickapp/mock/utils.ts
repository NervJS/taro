export function setData (data: Record<string, unknown>, cb?: () => void) {
  for (const k in data) {
    const v = data[k]
    const pathArr = k.split('.')
    const pathArrLen = pathArr.length

    let obj = this as any
    for (let i = 0; i < pathArrLen - 1; i++) {
      obj = obj[pathArr[i]]
    }
    obj[pathArr[pathArrLen - 1]] = v
  }

  // this.$forceUpdate(); // 无效???
  this.$set('t', 1) // 有效

  // nextTick
  cb && setTimeout(cb)
}

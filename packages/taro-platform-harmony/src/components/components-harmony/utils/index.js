export function covertHex3ToHex6 (color) {
  return color && color.replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i, '#$1$1$2$2$3$3')
}

export function createOption (option) {
  option.$trigger = function (event, params) {
    this.$emit(event, { id: this.id, ...params })
  }
  return option
}

export function queryToJson (str) {
  const dec = decodeURIComponent
  const qp = str.split('&')
  const ret = {}
  let name
  let val
  for (let i = 0, l = qp.length, item; i < l; ++i) {
    item = qp[i]
    if (item.length) {
      const s = item.indexOf('=')
      if (s < 0) {
        name = dec(item)
        val = ''
      } else {
        name = dec(item.slice(0, s))
        val = dec(item.slice(s + 1))
      }
      if (typeof ret[name] === 'string') {
        ret[name] = [ret[name]]
      }

      if (Array.isArray(ret[name])) {
        ret[name].push(val)
      } else {
        ret[name] = val
      }
    }
  }
  return ret
}

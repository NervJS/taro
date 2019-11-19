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
      if (typeof ret[name] === 'string') { // inline'd type check
        ret[name] = [ret[name]]
      }

      if (Array.isArray(ret[name])) {
        ret[name].push(val)
      } else {
        ret[name] = val
      }
    }
  }
  return ret // Object
}

let _i = 1
const _loadTime = (new Date()).getTime().toString()

export function getUniqueKey () {
  return _loadTime + (_i++)
}

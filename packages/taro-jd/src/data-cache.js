const data = {}

export function cacheDataSet (key, val) {
  data[key] = val
}

export function cacheDataGet (key, delelteAfterGet) {
  const temp = data[key]
  delelteAfterGet && delete data[key]
  return temp
}

export function cacheDataHas (key) {
  return key in data
}

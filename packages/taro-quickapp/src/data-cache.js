import appGlobal from './global'

appGlobal.cacheData = appGlobal.cacheData || {}

export function cacheDataSet (key, val) {
  appGlobal.cacheData[key] = val
}

export function cacheDataGet (key, delelteAfterGet) {
  const temp = appGlobal.cacheData[key]
  delelteAfterGet && delete appGlobal.cacheData[key]
  return temp
}

export function cacheDataHas (key) {
  return key in appGlobal.cacheData
}

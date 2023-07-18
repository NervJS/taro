import { processOpenApi, temporarilyNotSupport } from '../../utils/index'

// 位置
export * from './startLocationUpdate'
export * from './startLocationUpdateBackground'
export * from './stopLocationUpdate'

export const openLocation = /* @__PURE__ */ processOpenApi({
  name: 'openLocation',
  defaultOptions: { scale: 18 }
})

export { getLocation } from './getLocation'
export * from './offLocationChange'
export * from './offLocationChangeError'
export * from './onLocationChange'
export * from './onLocationChangeError'

export const choosePoi = /* @__PURE__ */ temporarilyNotSupport('choosePoi')
export const getFuzzyLocation = /* @__PURE__ */ temporarilyNotSupport('getFuzzyLocation')

export { chooseLocation } from './chooseLocation'

import { processOpenApi, temporarilyNotSupport } from '../../utils/index'

export const startLocationUpdateBackground = /* @__PURE__ */ temporarilyNotSupport('startLocationUpdateBackground')

export const openLocation = /* @__PURE__ */ processOpenApi({
  name: 'openLocation',
  defaultOptions: { scale: 18 }
})

export { getLocation } from './getLocation'

export const choosePoi = /* @__PURE__ */ temporarilyNotSupport('choosePoi')
export const getFuzzyLocation = /* @__PURE__ */ temporarilyNotSupport('getFuzzyLocation')

export { chooseLocation } from './chooseLocation'
export { offLocationChange, offLocationChangeError, onLocationChange, onLocationChangeError, startLocationUpdate, stopLocationUpdate } from './locationChange'

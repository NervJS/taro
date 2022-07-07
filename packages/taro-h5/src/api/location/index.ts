import { processOpenApi, temporarilyNotSupport } from '../utils/index'

// 位置
export const stopLocationUpdate = temporarilyNotSupport('stopLocationUpdate')
export const startLocationUpdateBackground = temporarilyNotSupport('startLocationUpdateBackground')
export const startLocationUpdate = temporarilyNotSupport('startLocationUpdate')

export const openLocation = processOpenApi({
  name: 'openLocation',
  defaultOptions: { scale: 18 }
})

export const onLocationChangeError = temporarilyNotSupport('onLocationChangeError')
export const onLocationChange = temporarilyNotSupport('onLocationChange')
export const offLocationChangeError = temporarilyNotSupport('offLocationChangeError')
export const offLocationChange = temporarilyNotSupport('offLocationChange')

export { getLocation } from './getLocation'

export const choosePoi = temporarilyNotSupport('choosePoi')
export const getFuzzyLocation = temporarilyNotSupport('getFuzzyLocation')

export { chooseLocation } from './chooseLocation'

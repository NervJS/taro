import { processOpenApi, temporarilyNotSupport } from '../utils/index'

// 位置
export const stopLocationUpdate = temporarilyNotSupport('stopLocationUpdate')
export const startLocationUpdateBackground = temporarilyNotSupport('startLocationUpdateBackground')
export const startLocationUpdate = temporarilyNotSupport('startLocationUpdate')

export const openLocation = processOpenApi('openLocation', { scale: 18 })

export const onLocationChangeError = temporarilyNotSupport('onLocationChangeError')
export const onLocationChange = temporarilyNotSupport('onLocationChange')
export const offLocationChangeError = temporarilyNotSupport('offLocationChangeError')
export const offLocationChange = temporarilyNotSupport('offLocationChange')

export const getLocation = processOpenApi('getLocation')

export const choosePoi = temporarilyNotSupport('choosePoi')

export * from './chooseLocation'

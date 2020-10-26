import { processOpenapi } from '../utils/index'

export { default as chooseLocation } from './chooseLocation'
export const getLocation = processOpenapi('getLocation')
export const openLocation = processOpenapi('openLocation', { scale: 18 })

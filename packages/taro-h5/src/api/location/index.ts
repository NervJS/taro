import { processOpenApi } from '../utils/index'

export { default as chooseLocation } from './chooseLocation'
export const getLocation = processOpenApi('getLocation')
export const openLocation = processOpenApi('openLocation', { scale: 18 })

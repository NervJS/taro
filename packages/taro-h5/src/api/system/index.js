import { getSystemInfo, getSystemInfoSync } from './info'
import { getNetworkType, onNetworkStatusChange } from './network'
import { processApis } from '../utils'

export const scanCode = processApis('scanQRCode', { needResult: 1 }, res => ({
  errMsg: res.errMsg === 'scanQRCode:ok' ? 'scanCode:ok' : res.errMsg,
  result: res.resultStr
}))
export const getLocation = processApis('getLocation')
export const openLocation = processApis('openLocation', { scale: 18 })
export { getSystemInfo, getSystemInfoSync, getNetworkType, onNetworkStatusChange }

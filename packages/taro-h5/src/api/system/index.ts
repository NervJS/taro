import { getSystemInfo, getSystemInfoSync } from './info'
import { getNetworkType, onNetworkStatusChange } from './network'
import { processOpenApi } from '../utils'

export const scanCode = processOpenApi('scanQRCode', { needResult: 1 }, res => ({
  errMsg: res.errMsg === 'scanQRCode:ok' ? 'scanCode:ok' : res.errMsg,
  result: res.resultStr
}))
export { getSystemInfo, getSystemInfoSync, getNetworkType, onNetworkStatusChange }

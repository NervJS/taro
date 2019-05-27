import { getSystemInfo, getSystemInfoSync } from './info'
import { getNetworkType, onNetworkStatusChange } from './network'
import { processOpenapi } from '../utils'

export const scanCode = processOpenapi('scanQRCode', { needResult: 1 }, res => ({
  errMsg: res.errMsg === 'scanQRCode:ok' ? 'scanCode:ok' : res.errMsg,
  result: res.resultStr
}))
export { getSystemInfo, getSystemInfoSync, getNetworkType, onNetworkStatusChange }

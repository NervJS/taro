import { processOpenApi } from '../utils'

// 扫码
export const scanCode = processOpenApi('scanQRCode', { needResult: 1 }, res => ({
  errMsg: res.errMsg === 'scanQRCode:ok' ? 'scanCode:ok' : res.errMsg,
  result: res.resultStr
}))

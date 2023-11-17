import { processOpenApi } from '../../utils'

/**
 * 调起客户端扫码界面，扫码成功后返回对应的结果(harmony平台暂不支持)
 * 
 * @canNotUse scanCode
 */
export const scanCode = /* @__PURE__ */ processOpenApi({
  name: 'scanQRCode',
  defaultOptions: { needResult: 1 },
  formatResult: (res) => ({
    errMsg: res.errMsg === 'scanQRCode:ok' ? 'scanCode:ok' : res.errMsg,
    result: res.resultStr,
  }),
})

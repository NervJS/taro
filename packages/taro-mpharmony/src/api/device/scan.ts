import Taro from '@tarojs/api'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 调起客户端扫码界面，扫码成功后返回对应的结果
 * 
 * @canUse scanCode
 * @__object [onlyFromCamera, scanType[barCode, qrCode, datamatrix, pdf417]]
 * @__success [charSet, rawData, result, scanType[QR_CODE, AZTEC, CODABAR, CODE_39, CODE_93, CODE_128,\
 * DATA_MATRIX, EAN_8, EAN_13, ITF, PDF_417, UPC_A, UPC_E]]
 */
export const scanCode: typeof Taro.scanCode = (options) => {
  const name = 'scanCode'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    return Promise.reject(res)
  }
  const {
    onlyFromCamera = false,
    scanType = [],
    success,
    fail,
    complete
  } = options || {}
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.scanCode({
      onlyFromCamera,
      scanType,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}

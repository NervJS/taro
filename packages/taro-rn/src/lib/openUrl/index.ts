import { Linking } from 'react-native'

import { errorHandler, successHandler } from '../../utils'

interface Option {
  /** 跳转链接 */
  url: string
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: TaroGeneral.CallbackResult) => void
  /** 接口调用失败的回调函数 */
  fail?: (res: TaroGeneral.CallbackResult) => void
  /** 接口调用成功的回调函数 */
  success?: (res: TaroGeneral.CallbackResult) => void
}

export async function openUrl<T>(opts: Option): Promise<T> {
  const { url, success, fail, complete } = opts || {}
  const res: any = { errMsg: 'openUrl:ok' }

  const isSupport = await Linking.canOpenURL(url)
  if (isSupport) {
    await Linking.openURL(url)
    return successHandler(success, complete)(res)
  } else {
    res.errMsg = 'openUrl:fail. Do not support the openUrl Api'
    return errorHandler(fail, complete)(res)
  }
}

export default {
  openUrl,
}

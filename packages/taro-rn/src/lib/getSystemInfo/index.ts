import { errorHandler, successHandler } from '../../utils'
import { getSystemInfoSync } from '../getSystemInfoSync'

export function getSystemInfo(opts: Taro.getSystemInfo.Option = {}): Promise<Taro.getSystemInfo.Result> {
  const { success, fail, complete }: any = opts
  try {
    const res = {
      ...getSystemInfoSync(),
      errMsg: 'getSystemInfo: ok'
    }
    return successHandler(success, complete)(res)
  } catch (err) {
    const res = { errMsg: err.message }
    return errorHandler(fail, complete)(res)
  }
}

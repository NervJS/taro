import { getSystemInfoSync } from '../getSystemInfoSync'

export function getSystemInfo(opts: Taro.getSystemInfo.Option  = {}): Promise<Taro.getSystemInfo.Result> {
  const { success, fail, complete }: any = opts
  try {
    const res = {
      ...getSystemInfoSync(),
      errMsg: 'getSystemInfo: ok'
    }
    success?.(res)
    complete?.(res)

    return Promise.resolve(res)
  } catch (err) {
    const res = { errMsg: err.message }
    fail?.(res)
    complete?.(res)

    return Promise.reject(err)
  }
}

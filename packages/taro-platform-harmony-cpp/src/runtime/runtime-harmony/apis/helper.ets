import type { TaroAny } from '@tarojs/runtime'

import type { IEtsMethodsOptions } from '../index'

export function baseArgumentHandle (obj: TaroAny, option: IEtsMethodsOptions) {
  try {
    if (option.name) {
      const data: TaroAny = obj[option.name]
      option.successHandler && option.successHandler({ data })
    }
  } catch (err) {
    option.errorHandler && option.errorHandler({
      errCode: err?.code,
      errMsg: err?.message,
      data: err?.data,
    })
  }
}

export function baseMethodHandle (obj: TaroAny, option: IEtsMethodsOptions) {
  try {
    if (option.name) {
      const data: TaroAny = obj[option.name](...option.args!)
      option.successHandler && option.successHandler({ data })
    }
  } catch (err) {
    option.errorHandler && option.errorHandler({
      errCode: err?.code,
      errMsg: err?.message,
      data: err?.data,
    })
  }
}

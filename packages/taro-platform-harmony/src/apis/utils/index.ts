import abilityAccessCtrl from '@ohos.abilityAccessCtrl'
import { Current, eventCenter } from '@tarojs/runtime'

import { ICallbackResult, MethodHandler } from './handler'

import type { FunctionType, IAsyncParams } from './types'

export * from './validate'
export { MethodHandler }
export { noop } from '@tarojs/shared'

export function requestPermissions (permissions: string[]) {
  return new Promise<void>((resolve, reject) => {
    const context = getContext(Current?.page)
    const atManager = abilityAccessCtrl.createAtManager()

    atManager.requestPermissionsFromUser(context, permissions, (err, _) => {
      if (err) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(`[Taro] 请求用户授权 ${permissions.join('、')} 失败：${JSON.stringify(err)}`)
      } else {
        resolve()
      }
    })
  })
}

export function object2String (obj) {
  let str = ''
  for (const item in obj) {
    str = str + item + ':' + obj[item] + ' \n'
  }
  return str
}

export function temporarilyNotSupport (name: string, recommended?: string) {
  return (option = {}, ...args) => {
    const { success, fail, complete } = option as any
    const handle = new MethodHandler({ name, success, fail, complete })
    let errMsg = `暂时不支持 API ${name}`
    if (recommended) {
      errMsg += `, 请使用 ${recommended}`
    }
    eventCenter.trigger('__taroNotSupport', {
      name,
      args: [option, ...args],
      type: 'method',
      category: 'temporarily',
    })
    if (process.env.NODE_ENV === 'production') {
      console.warn(errMsg)
      return handle.success({ errMsg })
    } else {
      return handle.fail({ errMsg })
    }
  }
}

export function permanentlyNotSupport (name = '') {
  return (option = {}, ...args: any[]) => {
    const { success, fail, complete } = option as any
    const handle = new MethodHandler<ICallbackResult>({ name, success, fail, complete })
    const errMsg = '不支持 API'
    eventCenter.trigger('__taroNotSupport', {
      name,
      args: [option, ...args],
      type: 'method',
      category: 'permanently',
    })
    if (process.env.NODE_ENV === 'production') {
      console.warn(errMsg)
      return handle.success({ errMsg })
    } else {
      return handle.fail({ errMsg })
    }
  }
}

/** @deprecated */
export function callCallbackSuccess<T extends FunctionType> (res, options?: IAsyncParams<T>) {
  options?.success?.(res)
  options?.complete?.(res)
}

/** @deprecated */
export function callCallbackFail<T extends FunctionType> (res, options?: IAsyncParams<T>) {
  options?.fail?.(res)
  options?.complete?.(res)
}

/** @deprecated */
export function callAsyncSuccess<T extends FunctionType> (resolve, res, options?: IAsyncParams<T>) {
  options?.success?.(res)
  options?.complete?.(res)
  resolve(res)
}

/** @deprecated */
export function callAsyncFail<T extends FunctionType> (reject, res, options?: IAsyncParams<T>) {
  options?.fail?.(res)
  options?.complete?.(res)
  reject(res)
}

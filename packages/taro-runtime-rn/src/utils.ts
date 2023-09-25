import { CallbackResult, OptionsFunc } from './types/index'

export const incrementId = () => {
  const chatCodes: number[] = []
  // A-Z
  for (let i = 65; i <= 90; i++) {
    chatCodes.push(i)
  }
  // a-z
  for (let i = 97; i <= 122; i++) {
    chatCodes.push(i)
  }
  const chatCodesLen = chatCodes.length - 1
  const list = [0, 0]
  return () => {
    const target = list.map(item => chatCodes[item])
    const res = String.fromCharCode(...target)

    let tailIdx = list.length - 1

    list[tailIdx]++

    while (list[tailIdx] > chatCodesLen) {
      list[tailIdx] = 0
      tailIdx = tailIdx - 1
      if (tailIdx < 0) {
        list.push(0)
        break
      }
      list[tailIdx]++
    }

    return res
  }
}


export function isFunction (o: unknown): o is (...args: any[]) => any {
  return typeof o === 'function'
}

export const EMPTY_OBJ: any = {}

export const HOOKS_APP_ID = 'taro-app'

export const isArray = Array.isArray

export function successHandler (success: OptionsFunc | undefined, complete: OptionsFunc | undefined): any {
  return function (res: CallbackResult) {
    success && isFunction(success) && success(res)
    complete && isFunction(complete) && complete(res)
    return Promise.resolve(res)
  }
}

export function errorHandler (fail: OptionsFunc | undefined, complete: OptionsFunc | undefined): any {
  return function (res: CallbackResult) {
    fail && isFunction(fail) && fail(res)
    complete && isFunction(complete) && complete(res)
    return Promise.reject(res)
  }
}

export function getPageStr (path: string):string{
  return path.replace(/\//g,'')
}
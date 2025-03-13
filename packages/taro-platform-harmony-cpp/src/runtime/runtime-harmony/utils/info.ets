import { Current } from '../current'

import type { TaroAny, TFunc } from '@tarojs/runtime'

export function printWithStack (method: string, err: Error = new Error(), ...args: TaroAny[]) {
  console.error(`TARO_LOG(${method}): `, ...args.map((arg: TaroAny): string => typeof arg === 'object' ? JSON.stringify(arg || '') : arg), err.message, err.stack)
}

export function printInfo (method: string, ...args: TaroAny[]) {
  console.log(`TARO_LOG(${method}): `, ...args.map((arg: TaroAny): string => typeof arg === 'object' ? JSON.stringify(arg || '') : arg)) // eslint-disable-line no-console
}

export function runInDebug (fn: TFunc) {
  if (Current.isDebug) {
    try {
      fn()
    } catch (e) {
      printWithStack('runInDebug', e)
    }
  }
}

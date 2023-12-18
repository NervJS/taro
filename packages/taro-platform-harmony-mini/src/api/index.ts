import definition from '@tarojs/plugin-platform-harmony-mini/dist/definition.json'
import isMatchWith from 'lodash-es/isMatchWith'
import set from 'lodash-es/set'
import taro from './apis/taro'

export * from './apis/index'
export * from './apis/taro'

let list: Record<string, unknown> | null = null
export function canIUse (scheme = '') {
  /** Note: 此处方法仅作适配使用，用于避免 babel 无法识别的情况，比如通过变量传递的 scheme 等等
   * 同时，此处的 scheme 不包括在编译时写入的 hooks 等方法，故而不支持相关判断
   */
  if (list === null) {
    list = {
      ...definition.apis,
      ...definition.components,
      canIUse: '*'
      
    } as Exclude<typeof list, null>
  }
  if (!scheme) return false
  const o = set({}, scheme, true)
  return isMatchWith(list, o, (a, b) => {
    if (a === '*' || b === true) return true
  })
}

export default taro

function safeStringify (obj) {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (error) {
    // 在处理非法输入时捕获异常
    return String(obj) // 返回原始值的字符串表示形式
  }
}

function logFun (funObj, message) {
  return new Proxy(funObj, {
    apply (target, thisArg, args) {
      // eslint-disable-next-line no-console
      console.log(`${message}, 参数为 ${safeStringify(args)}`)
      return target.apply(thisArg, args)
    }
  })
}

function logObj (obj) {
  return new Proxy(obj, {
    get (target, property) {
      if (typeof target[property] !== 'function') {
        const value = target[property]
        // @ts-ignore
        // eslint-disable-next-line no-console
        console.log(`调用 native ${property} property，结果为：${safeStringify(value)} `)
        return value
      }

      return function (...args) {
        // @ts-ignore
        let log = `调用 native.${property} 方法`

        if (args && args[0]) {
          log = `${log}, 参数为${safeStringify(args[0])}`

          if (typeof args[0].success === 'function') {
            // @ts-ignore
            args[0].success = logFun(args[0].success, `${log} success回调结果`)
          }
          if (typeof args[0].fail === 'function') {
            // @ts-ignore
            args[0].fail = logFun(args[0].fail, `${log} fail回调结果`)
          }
        }

        const result = target[property].apply(this, args)
        log = `${log}, 返回值为${safeStringify(result)}`
        // eslint-disable-next-line no-console
        console.log(`${log}`)
        return result
      }
    }
  })
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.warn(`当前为development阶段，输出所有原生Api的调用日志。`)
  // @ts-ignore
  window.native = logObj(window.native || {})
}

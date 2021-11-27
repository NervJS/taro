import { IAsyncParams } from './types'

interface Current {
  taro: Record<string, any>
}

export const current: Current = {
  taro: {}
}

export function noop () {}

export function unsupport (str: string) {
  return function () {
    process.env.NODE_ENV !== 'production' && console.warn(`暂不支持 Taro.${str}`)
  }
}

export function getParameterError ({
  name = '',
  param,
  correct,
  wrong
}: {
  name?: string,
  param?: string,
  correct: string,
  wrong: any
}): string {
  const parameter = param ? `parameter.${param}` : 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`
}

export function upperCaseFirstLetter (string: string): string {
  if (typeof string !== 'string') return string
  string = string.replace(/^./, match => match.toUpperCase())
  return string
}

export function shouleBeObject (name: string, target: any): {
  res: boolean,
  msg?: string
} {
  if (target && typeof target === 'object') return { res: true }
  return {
    res: false,
    msg: getParameterError({
      name,
      correct: 'Object',
      wrong: target
    })
  }
}

// export function validateOptions (funcName, options: any): {
//   isPassed: boolean
//   res: any
// } {
//   // options must be an Object
//   const isObject = shouleBeObject(funcName, options)
//   if (!isObject.res) {
//     const res = { errMsg: isObject.msg }
//     console.error(res.errMsg)
//     return {
//       isPassed: false,
//       res
//     }
//   }
//   const { key, fail, complete } = options
//   const res: any = { errMsg: `${funcName}:ok` }
//   if (key && typeof key !== 'string') {
//     res.errMsg = getParameterError({
//       name: funcName,
//       param: 'key',
//       correct: 'String',
//       wrong: key
//     })
//     console.error(res.errMsg)
//     typeof fail === 'function' && fail(res)
//     typeof complete === 'function' && complete(res)
//     return {
//       isPassed: false,
//       res
//     }
//   }
//   return {
//     isPassed: true,
//     res
//   }
// }

export function validateOptions (funcName, options: any): {
  isPassed: boolean
  res: any
} {
  // options must be an Object
  const isObject = shouleBeObject(funcName, options)
  if (!isObject.res) {
    const res = { errMsg: isObject.msg }
    console.error(res.errMsg)
    return {
      isPassed: false,
      res
    }
  }
  const { key, type, altitude, isHighAccuracy, highAccuracyExpireTime, fail, complete } = options
  const params = [{
    value: key,
    param: 'key',
    correct: 'String'
  }, {
    value: type,
    param: 'type',
    correct: 'String'
  }, {
    value: altitude,
    param: 'altitude',
    correct: 'Boolean'
  }, {
    value: isHighAccuracy,
    param: 'isHighAccuracy',
    correct: 'Boolean'
  }, {
    value: highAccuracyExpireTime,
    param: 'highAccuracyExpireTime',
    correct: 'number'
  }]
  const res: any = { errMsg: `${funcName}:ok` }
  for (let i = 0; i < params.length; i++) {
    if (params[i].value && typeof params[i].value !== params[i].correct) {
      res.errMsg = getParameterError({
        name: funcName,
        param: params[i].param,
        correct: params[i].correct,
        wrong: params[i].value
      })
      console.error(res.errMsg)
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return {
        isPassed: false,
        res
      }
    }
  }
  return {
    isPassed: true,
    res
  }
}

export function callAsyncSuccess (resolve, res, options?: IAsyncParams) {
  options?.success?.(res)
  options?.complete?.(res)
  resolve && resolve(res)
}

export function callAsyncFail (reject, res, options?: IAsyncParams) {
  options?.fail?.(res)
  options?.complete?.(res)
  reject && reject(res)
}

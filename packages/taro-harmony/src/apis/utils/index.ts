import { IAsyncParams } from './types'
interface IVRPRes {
  isPassVRP: boolean
  pName: string
  pType: string
  pWrongType: string
}
interface Current {
  taro: Record<string, any>
}
interface IVROptions {
  options: any
  rTypes: Array<string>
  rParamNames: Array<string>
}
interface IVOOptions extends IVROptions {
  funcName: string
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

export function upperCaseFirstLetter (string: string): string {
  if (typeof string !== 'string') return string
  string = string.replace(/^./, match => match.toUpperCase())
  return string
}

export function callAsyncSuccess (resolve, res, options?: IAsyncParams) {
  options?.success?.(res)
  options?.complete?.(res)
  resolve(res)
}

export function callAsyncFail (reject, res, options?: IAsyncParams) {
  options?.fail?.(res)
  options?.complete?.(res)
  reject(res)
}

export function getParameterError ({
  funcName = '',
  pName,
  pType,
  pWrongType
}: {
  funcName?: string,
  pName?: string,
  pType: string,
  pWrongType: string
}): string {
  let msg = ''
  if (pName && pType && pWrongType) {
    const parameter = pName ? `parameter.${pName}` : 'parameter'
    const errorType = upperCaseFirstLetter(pWrongType === null ? 'Null' : pWrongType)
    msg = `${funcName}:fail parameter error: ${parameter} should be ${upperCaseFirstLetter(pType)} instead of ${errorType}`
  } else {
    msg = `${funcName}:fail parameter error: the name, expecting type and wrong type must be provided.`
  }

  return msg
}

function validateRequiredParam (vrOptions: IVROptions): IVRPRes {
  const { options, rParamNames, rTypes } = vrOptions
  const m: number = rTypes.length
  const n: number = rParamNames.length
  const resVRP: IVRPRes = {
    isPassVRP: true,
    pName: '',
    pType: '',
    pWrongType: ''
  }
  if (m !== n) {
    resVRP.isPassVRP = false
    return resVRP
  }
  for (let i = 0; i < m; i++) {
    const tempType: string = typeof options[rParamNames[i]]
    // options[rParamNames[i]] 值存在，再去判断类型是否正确
    if (options[rParamNames[i]] && tempType !== rTypes[i]) {
      resVRP.isPassVRP = false
      resVRP.pName = rParamNames[i]
      resVRP.pType = rTypes[i]
      resVRP.pWrongType = tempType
      return resVRP
    }
  }
  return resVRP
}

export function shouleBeObject (funcName: string, target: any, pName?: string): {
  res: boolean,
  msg?: string
} {
  if (target && typeof target === 'object') return { res: true }
  return {
    res: false,
    msg: getParameterError({
      funcName,
      pName,
      pType: 'Object',
      pWrongType: typeof target
    })
  }
}

export function validateOptions (voOptions: IVOOptions) {
  const { funcName, options, rParamNames, rTypes } = voOptions
  // 判断参数是否为 Object
  const isObject = shouleBeObject(funcName, options)
  if (!isObject.res) {
    const res = { errMsg: isObject.msg }
    console.error(res.errMsg)
    return {
      isPassed: false,
      res
    }
  }

  const res: any = { errMsg: `${funcName}:ok` }

  // 判断 api 个性参数类型是否正确
  if (rTypes && rParamNames && rTypes.length > 0 && rParamNames.length > 0) {
    const vrOptions: IVROptions = {
      options,
      rTypes,
      rParamNames
    }
    const resVRP: IVRPRes = validateRequiredParam(vrOptions)
    const { pName, pType, pWrongType, isPassVRP } = resVRP
    if (!isPassVRP) {
      const { fail, complete } = options
      res.errMsg = getParameterError({
        funcName: funcName,
        pName: pName,
        pType: pType,
        pWrongType: pWrongType
      })
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

export function callbackInPromise (callback: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        callback(resolve, reject)
      } catch (error) {
        console.error('ddoowwnnllooaadd callbackInPromise ERROR:' + error)
        reject(error)
      }
    }, 100)
  })
}

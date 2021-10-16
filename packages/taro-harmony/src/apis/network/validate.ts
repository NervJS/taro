import { shouleBeObject, upperCaseFirstLetter } from '../utils'
import { General } from '@tarojs/taro/types'

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
    msg = `${funcName}:fail parameter error: ${parameter} should be ${pType} instead of ${errorType}`
  } else {
    msg = `${funcName}:fail parameter error: the names, types ande parameters don't match`
  }

  return msg
}
interface IVRPRes {
  isPassVRP: boolean
  pName: string
  pType: string
  pWrongType: string
}

function validateRequiredParam (rParams: Array<any>, rTypes: Array<string>, rParamNames: Array<string>): IVRPRes {
  const m: number = rParams.length
  const n: number = rTypes.length
  const q: number = rParamNames.length
  const resVRP: IVRPRes = {
    isPassVRP: true,
    pName: '',
    pType: '',
    pWrongType: ''
  }
  if (m !== n && m !== q && n !== q) {
    resVRP.isPassVRP = false
    return resVRP
  }
  for (let i = 0; i < m; i++) {
    if (typeof rParams[i] !== rTypes[i]) {
      resVRP.isPassVRP = false
      resVRP.pName = rParamNames[i]
      resVRP.pType = rTypes[i]
      resVRP.pWrongType = typeof rParams[i]
      return resVRP
    }
  }
  return resVRP
}

function validateParams (funcName: string, params: General.IAnyObject, rParams?: Array<any>, rTypes?: Array<string>, rParamNames?: Array<string>) {
  // 判断参数是否为 Object
  const isObject = shouleBeObject(funcName, params)
  if (!isObject.res) {
    const res = { errMsg: isObject.msg }
    console.error(res.errMsg)
    return {
      isPassed: false,
      res
    }
  }

  const res:General.IAnyObject = { errMsg: `${funcName}:ok` }

  // 判断 api 个性参数类型是否正确
  if (rParams && rTypes && rParamNames) {
    const resVRP: IVRPRes = validateRequiredParam(rParams, rTypes, rParamNames)
    const { pName, pType, pWrongType, isPassVRP } = resVRP
    if (!isPassVRP) {
      const { fail, complete } = params
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

export {
  validateParams
}

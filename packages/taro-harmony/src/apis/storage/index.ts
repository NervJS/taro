import { getParameterError, validateOptions } from '../utils'
import { IAsyncParams } from '../utils/types'

const dataStorage = require('@ohos.data.storage')
const app = require('@system.app')
const appInfo = app.getInfo()
const appID = appInfo.appID

const storagePath = `/data/data/${appID}/api_storage`
const storage = dataStorage.getStorageSync(storagePath)

function getItem (key: string): { result: boolean, data?: number | string | boolean } {
  try {
    const item = JSON.parse(storage.getSync(key, null))
    if (item && typeof item === 'object' && item.hasOwnProperty('data')) {
      return { result: true, data: item.data }
    } else {
      return { result: false }
    }
  } catch (error) {
    return { result: false }
  }
}

export function getStorageSync (key: string) {
  if (typeof key !== 'string') {
    return console.error(getParameterError({
      funcName: 'getStorage',
      pName: 'key',
      pType: 'String',
      pWrongType: typeof key
    }))
  }
  const res = getItem(key)
  if (res.result) return res.data
  return ''
}

interface IGetStorageParams extends IAsyncParams {
  key: string
}

export function getStorage (options: IGetStorageParams) {
  const voOtions = {
    funcName: 'getStorage',
    options,
    rParamNames: ['key'],
    rTypes: ['string']
  }
  const { res, isPassed } = validateOptions(voOtions)
  if (!isPassed) {
    return Promise.reject(res)
  }
  const { key, success, fail, complete } = options
  const { result, data } = getItem(key)
  if (result) {
    res.data = data
  } else {
    res.errMsg = 'getStorage:fail data not found'
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
    return Promise.reject(res)
  }
  typeof success === 'function' && success(res)
  typeof complete === 'function' && complete(res)

  return Promise.resolve(res)
}

export function setStorageSync (key: string, data: number | string | boolean) {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      funcName: 'setStorageSync',
      pName: 'key',
      pType: 'String',
      pWrongType: typeof key
    }))
    return
  }
  const obj = { data }
  storage.putSync(key, JSON.stringify(obj))
  storage.flushSync()
}

interface ISetStorageParams extends IAsyncParams {
  key: string
  data: number | string | boolean
}
export function setStorage (options: ISetStorageParams) {
  const voOtions = {
    funcName: 'setStorage',
    options,
    rParamNames: ['key'],
    rTypes: ['string']
  }
  const { res, isPassed } = validateOptions(voOtions)
  if (!isPassed) {
    return Promise.reject(res)
  }
  const { key, data, success, complete } = options
  setStorageSync(key, data)

  typeof success === 'function' && success(res)
  typeof complete === 'function' && complete(res)

  return Promise.resolve(res)
}

export function removeStorageSync (key: string) {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      funcName: 'removeStorageSync',
      pName: 'key',
      pType: 'String',
      pWrongType: typeof key
    }))
    return
  }
  storage.deleteSync(key)
}

interface IRemoveStorageParams extends IAsyncParams {
  key: string
}
export function removeStorage (options: IRemoveStorageParams) {
  const voOtions = {
    funcName: 'removeStorage',
    options,
    rParamNames: ['key'],
    rTypes: ['string']
  }
  const { res, isPassed } = validateOptions(voOtions)
  if (!isPassed) {
    return Promise.reject(res)
  }
  const { key, success, complete } = options

  removeStorageSync(key)
  success && success(res)
  complete && complete(res)

  return Promise.resolve(res)
}

export function clearStorageSync () {
  storage.clearSync()
}

export function clearStorage (options: IAsyncParams) {
  const voOtions = {
    funcName: 'clearStorage',
    options,
    rParamNames: [],
    rTypes: []
  }
  const { res, isPassed } = validateOptions(voOtions)
  if (!isPassed) {
    return Promise.reject(res)
  }
  clearStorageSync()
}

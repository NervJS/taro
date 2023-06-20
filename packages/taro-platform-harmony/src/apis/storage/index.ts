import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'

import type { IAsyncParams } from '../utils/types'

interface IGetStorageParams extends IAsyncParams {
  key: string
}
interface ISetStorageParams extends IAsyncParams {
  key: string
  data: number | string | boolean
}

interface IRemoveStorageParams extends IAsyncParams {
  key: string
}

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

const storageSchema = {
  key: 'String'
}

export function getStorageSync (key: string) {
  validateParams('getStorageSync', [key], ['string'])

  const res = getItem(key)
  if (res.result) return res.data
  return ''
}

export function getStorage (options: IGetStorageParams) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('getStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const { result, data } = getItem(options.key)
    const res: Record<string, any> = { errMsg: 'getStorage:ok' }
    if (result) {
      res.data = data
      callAsyncSuccess(resolve, res, options)
    } else {
      res.errMsg = 'getStorage:fail data not found'
      callAsyncFail(reject, res, options)
    }
  })
}

export function setStorageSync (key: string, data: number | string | boolean) {
  validateParams('setStorageSync', [key], ['string'])
  const obj = { data }
  storage.putSync(key, JSON.stringify(obj))
  storage.flushSync()
}

export function setStorage (options: ISetStorageParams) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('setStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const { key, data } = options
    const res = { errMsg: 'setStorage:ok' }

    setStorageSync(key, data)

    callAsyncSuccess(resolve, res, options)
  })
}

export function removeStorageSync (key: string) {
  validateParams('removeStorageSync', [key], ['string'])
  storage.deleteSync(key)
}

export function removeStorage (options: IRemoveStorageParams) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('removeStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    removeStorageSync(options.key)

    const res = { errMsg: 'removeStorage:ok' }
    callAsyncSuccess(resolve, res, options)
  })
}

export function clearStorageSync () {
  storage.clearSync()
}

export function clearStorage (options: IAsyncParams) {
  return new Promise(resolve => {
    clearStorageSync()

    const res = { errMsg: 'clearStorage:ok' }
    callAsyncSuccess(resolve, res, options)
  })
}

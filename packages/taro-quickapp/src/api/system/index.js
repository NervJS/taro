import device from '@system.device'
import { generateUnSupportApi } from '../utils'

export function getSystemInfo (options = {}) {
  const { success, fail, complete } = options
  const res = { errMsg: 'getSystemInfo:ok' }

  return new Promise((resolve, reject) => {
    device.getInfo({
      success (data) {
        res.result = data.result
        success && success(res)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        reject(res)
      },
      complete () {
        complete && complete(res)
      }
    })
  })
}

export function getSystemId (options = {}) {
  const { success, fail, complete, type } = options
  const res = { errMsg: 'getSystemId:ok' }
  return new Promise((resolve, reject) => {
    device.getId({
      type,
      success (data) {
        res.result = data.result
        success && success(res)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        reject(res)
      },
      complete () {
        complete && complete(res)
      }
    })
  })
}

export function getSystemDeviceId (options = {}) {
  const { success, fail, complete } = options
  const res = { errMsg: 'getSystemDeviceId:ok' }
  return new Promise((resolve, reject) => {
    device.getDeviceId({
      success (data) {
        res.result = data.result
        success && success(res)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function getSystemUserId (options = {}) {
  const { success, fail, complete } = options
  const res = { errMsg: 'getSystemUserId:ok' }
  return new Promise((resolve, reject) => {
    device.getDeviceId({
      success (data) {
        res.result = data.result
        success && success(res)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function getSystemAdvertisingId (options = {}) {
  const { success, fail, complete } = options
  const res = { errMsg: 'getSystemAdvertisingId:ok' }
  return new Promise((resolve, reject) => {
    device.getAdvertisingId({
      success (data) {
        res.result = data.result
        success && success(res)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function getSystemSerial (options = {}) {
  const { success, fail, complete } = options
  const res = { errMsg: 'getSystemSerial:ok' }
  return new Promise((resolve, reject) => {
    device.getSerial({
      success (data) {
        res.result = data.result
        success && success(res)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function getSystemTotalStorage (options = {}) {
  const { success, fail, complete } = options
  const res = { errMsg: 'getSystemTotalStorage:ok' }
  return new Promise((resolve, reject) => {
    device.getTotalStorage({
      success (data) {
        res.result = data.result
        success && success(res)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function getSystemAvailableStorage (options = {}) {
  const { success, fail, complete } = options
  const res = { errMsg: 'getSystemAvailableStorage:ok' }
  return new Promise((resolve, reject) => {
    device.getAvailableStorage({
      success (data) {
        res.result = data.result
        success && success(res)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function getSystemCpuInfo (options = {}) {
  const { success, fail, complete } = options
  const res = { errMsg: 'getSystemCpuInfo:ok' }
  return new Promise((resolve, reject) => {
    device.getCpuInfo({
      success (data) {
        res.result = data.result
        success && success(res)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function getSystemPlatform () {
  return device.platform
}

let unSupportApis = ['getSystemInfoSync']
unSupportApis = generateUnSupportApi(
  '快应用暂不支持SystemInfo的同步接口',
  unSupportApis
)

const qSystem = {
  getSystemInfo,
  getSystemId,
  getSystemDeviceId,
  getSystemUserId,
  getSystemAdvertisingId,
  getSystemSerial,
  getSystemTotalStorage,
  getSystemAvailableStorage,
  getSystemCpuInfo,
  getSystemPlatform
}

Object.assign(qSystem, unSupportApis)

export default qSystem

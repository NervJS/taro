import barcode from '@system.barcode'
import vibrator from '@system.vibrator'
import clipboard from '@system.clipboard'
import sensor from '@system.sensor'
import geolocation from '@system.geolocation'

import { makeSyncPromise } from '../utils'

export function scanCode (options = {}) {
  const {
    success,
    fail,
    complete
  } = options

  const res = { errMsg: 'scanCode:ok' }

  return new Promise((resolve, reject) => {
    barcode.scan({
      success (data) {
        res.result = data.result
        success && success(res)
        complete && complete(res)
        resolve(res)
      },
      cancel () {
        res.errMsg = 'cancelScanCode: success'
        success && success(res)
        complete && complete(res)
        res.result = ''
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        complete && complete(res)
        fail && fail(res)
        reject(res)
        console.log(`scanCode fail, code = ${code}`, data)
      },

      complete () {
        complete && complete(res)
      }
    })
  })
}

export function vibrateShort (options = {}) {
  return makeSyncPromise('vibrateShort', () => {
    vibrator.vibrate({
      mode: 'short'
    })
  }, options)
}

export function vibrateLong (options = {}) {
  return makeSyncPromise('vibrateLong', () => {
    vibrator.vibrate({
      mode: 'long'
    })
  }, options)
}

export function setClipboardData (options = {}) {
  const {
    data,
    success,
    fail,
    complete
  } = options

  const res = { errMsg: 'setClipboardData:ok' }

  return new Promise((resolve, reject) => {
    clipboard.set({
      text: data,
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

export function getClipboardData (options = {}) {
  const {
    success,
    fail,
    complete
  } = options

  const res = { errMsg: 'getClipboardData:ok' }

  return new Promise((resolve, reject) => {
    clipboard.get({
      success (data) {
        res.data = data.text
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

export function startAccelerometer (options = {}) {
  return makeSyncPromise('startAccelerometer', null, options)
}

export function stopAccelerometer (options = {}) {
  return makeSyncPromise('stopAccelerometer', () => {
    sensor.unsubscribeAccelerometer()
  }, options)
}

export function onAccelerometerChange (callback) {
  if (callback) {
    sensor.subscribeAccelerometer({
      callback
    })
  }
}

export function startCompass (options = {}) {
  return makeSyncPromise('startCompass', null, options)
}

export function stopCompass (options = {}) {
  return makeSyncPromise('stopCompass', () => {
    sensor.unsubscribeCompass()
  }, options)
}

export function onCompassChange (callback) {
  if (callback) {
    sensor.subscribeCompass({
      callback
    })
  }
}

export function getLocation (options = {}) {
  const {
    success,
    fail,
    complete
  } = options
  const res = { errMsg: 'getLocation:ok' }

  return new Promise((resolve, reject) => {
    geolocation.getLocation({
      success (data) {
        res.latitude = data.latitude
        res.longitude = data.longitude
        res.accuracy = data.accuracy
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

export default {
  scanCode,
  vibrateShort,
  vibrateLong,
  setClipboardData,
  getClipboardData,
  startAccelerometer,
  stopAccelerometer,
  onAccelerometerChange,
  startCompass,
  stopCompass,
  onCompassChange,
  getLocation
}

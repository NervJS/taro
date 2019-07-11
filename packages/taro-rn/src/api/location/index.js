import * as Location from 'expo-location'
import { Permissions } from 'react-native-unimodules'
import { askAsyncPermissions } from '../utils'

export async function getLocation (opts = {}) {
  const status = await askAsyncPermissions(Permissions.LOCATION)
  if (status !== 'granted') {
    const res = {errMsg: `Permissions denied!`}
    return Promise.reject(res)
  }

  if (!opts || typeof opts !== 'object') {
    opts = {}
  }

  const {altitude = false, success, fail, complete} = opts

  return new Promise((resolve, reject) => {
    Location.getCurrentPositionAsync({
      enableHighAccuracy: Boolean(altitude)
    }).then((resp) => {
      const {coords, timestamp} = resp
      const {latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed} = coords
      const res = {
        latitude,
        longitude,
        speed,
        altitude,
        accuracy,
        verticalAccuracy: altitudeAccuracy,
        horizontalAccuracy: null,
        heading,
        timestamp
      }
      success && success(res)
      complete && complete(res)
      resolve(res)
    }).catch((err) => {
      const res = {
        errMsg: `getLocation fail`,
        err
      }
      fail && fail(res)
      complete && complete(res)
      reject(res)
    })
  })
}

export default {
  getLocation
}

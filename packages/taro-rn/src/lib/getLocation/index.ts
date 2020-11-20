import { getCurrentPositionAsync, LocationAccuracy } from 'expo-location'
import { Permissions } from 'react-native-unimodules'
import { askAsyncPermissions } from '../../utils/premissions'

export async function getLocation(opts: Taro.getLocation.Option = {}): Promise<Taro.getLocation.SuccessCallbackResult> {
  try {
    const status = await askAsyncPermissions(Permissions.LOCATION)
    if (status !== 'granted') {
      const res = { errMsg: 'Permissions denied!' }
      return Promise.reject(res)
    }
  } catch (err) {
    const res = {
      errMsg: 'Permissions denied!',
      err
    }
    return Promise.reject(res)
  }

  const { isHighAccuracy = false, success, fail, complete } = opts

  return new Promise((resolve, reject) => {
    getCurrentPositionAsync({
      accuracy: isHighAccuracy ? LocationAccuracy.High : LocationAccuracy.Balanced
    }).then((resp) => {
      const { coords } = resp
      const { latitude, longitude, altitude, accuracy, speed } = coords
      const res = {
        latitude,
        longitude,
        speed: speed ?? 0,
        altitude: altitude ?? 0,
        accuracy: accuracy ?? 0,
        verticalAccuracy: 0,
        horizontalAccuracy: 0,
        errMsg: 'getLocation:ok'
      }
      success?.(res)
      complete?.(res)
      resolve(res)
    }).catch((err) => {
      const res = {
        errMsg: 'getLocation fail',
        err
      }
      fail?.(res)
      complete?.(res)
      reject(res)
    })
  })
}

import Geolocation from '@react-native-community/geolocation'
import { requestForegroundPermissionsAsync } from 'expo-location'
import { errorHandler } from '../../utils'

export async function getLocation(opts: Taro.getLocation.Option = {}): Promise<Taro.getLocation.SuccessCallbackResult> {
  const { isHighAccuracy = false, highAccuracyExpireTime = 3000, success, fail, complete } = opts

  try {
    // @ts-ignore
    // todo: fix types
    const { granted } = await requestForegroundPermissionsAsync()
    if (!granted) {
      const res = { errMsg: 'Permissions denied!' }
      return errorHandler(fail, complete)(res)
    }
  } catch (err) {
    const res = { errMsg: 'Permissions denied!' }
    return errorHandler(fail, complete)(res)
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude, altitude, accuracy, speed } = coords
        const res = {
          latitude,
          longitude,
          speed: speed ?? 0,
          altitude: altitude ?? 0,
          accuracy,
          verticalAccuracy: 0,
          horizontalAccuracy: 0,
          errMsg: 'getLocation:ok'
        }
        success?.(res)
        complete?.(res)
        resolve(res)
      },
      (err) => {
        const res = {
          errMsg: 'getLocation fail',
          err
        }
        fail?.(res)
        complete?.(res)
        reject(res)
      },
      {
        // 当 maximumAge 为 0 时，如果不设置 timeout 或 timeout 太少可能会超时
        timeout: highAccuracyExpireTime,
        // maximumAge 设置为 0 则会获取当前位置，而不是获取一个前不久缓存的位置
        maximumAge: 0,
        enableHighAccuracy: isHighAccuracy
      }
    )
  })
}

import * as Brightness from 'expo-brightness'
import { Permissions } from 'react-native-unimodules'

/**
 * 设置屏幕亮度
 * @param opts
 * @param {number} opts.value - 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮
 */
export async function setScreenBrightness (opts) {
  const {value} = opts
  await Permissions.askAsync(Permissions.SYSTEM_BRIGHTNESS)
  const {status} = await Permissions.getAsync(Permissions.SYSTEM_BRIGHTNESS)
  if (status === 'granted') {
    (Brightness as any).setSystemBrightness(value)
  }
}

/**
 *
 * @param opts
 */
export function getScreenBrightness (opts) {

}

import Taro from '@tarojs/api'

let display
let bluetooth
let geoLocationManager
let wifiManager

try {
  display = requireNapi('display')
  bluetooth = requireNapi('bluetooth')
  geoLocationManager = requireNapi('geoLocationManager')
  wifiManager = requireNapi('wifi')
} catch (e) {} // eslint-disable-line no-empty

// @ts-ignore
export const getSystemSetting: typeof Taro.getSystemSetting = () => {
  let bluetoothEnabled: number | boolean = false
  let locationEnabled = false
  let wifiEnabled = false
  let bluetoothError = ''
  let locationError = ''
  try {
    bluetoothEnabled = bluetooth.getState()
    bluetoothEnabled = bluetoothEnabled === 2 || bluetoothEnabled === 5
  } catch (err) {
    console.error('errCode:' + err.code + ',errMessage:' + err.message)
    bluetoothError = err.message
  }
  try {
    locationEnabled = geoLocationManager.isLocationEnabled()
  } catch (err) {
    console.error('errCode:' + err.code + ',errMessage:' + err.message)
    locationError = err.message
  }
  try {
    wifiEnabled = wifiManager.isWifiActive()
  } catch (err) {
    console.error('errCode:' + err.code + ',errMessage:' + err.message)
  }
  // @ts-ignore
  const { rotation } = display.getDefaultDisplaySync()
  const deviceOrientation = rotation === 1 || rotation === 3 ? 'landscape' : 'portrait'
  return {
    bluetoothEnabled,
    bluetoothError,
    locationEnabled,
    locationError,
    wifiEnabled,
    deviceOrientation,
  }
}

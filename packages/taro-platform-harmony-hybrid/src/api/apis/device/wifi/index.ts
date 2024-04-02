/**
 * 设置 wifiList 中 AP 的相关信息
 * 
 * @canNotUse setWifiList
 */
export * from './connectWifi'
export * from './getConnectedWifi'
export * from './getWifiList'
export * from './offGetWifiList'
export * from './offWifiConnected'
export * from './offWifiConnectedWithPartialInfo'
export * from './onGetWifiList'
export * from './onWifiConnected'
export * from './onWifiConnectedWithPartialInfo'
export * from './startWifi'
export * from './stopWifi'
export { setWifiList } from '@tarojs/taro-h5'

/**
 * Wifi 信息(native 返回)
 * 
 * @canUse WifiInfo
 * @__class [SSID, BSSID, secure, signalStrength, frequency]
 */
import DeviceInfo from 'react-native-device-info'

export function getAppBaseInfo(): Taro.getAppBaseInfo.Result {
  return {
    SDKVersion: '', // not supportted
    version: DeviceInfo.getVersion(),
    language: '', // todo
    enableDebug: !!__DEV__,
    theme: 'light' // 当前只支持 light
  }
}

import Taro from "@tarojs/taro"

export const onUserCaptureScreen: typeof Taro.onUserCaptureScreen = (callback) => {
  console.log('on user capture screen')
  // @ts-ignore
  const ret = native.onUserCaptureScreen(callback)
  return ret
}

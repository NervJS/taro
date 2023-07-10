import Taro from "@tarojs/taro"

export const onUserCaptureScreen: typeof Taro.onUserCaptureScreen = (callback) => {
  // @ts-ignore
  const ret = native.onUserCaptureScreen(callback)
  return ret
}

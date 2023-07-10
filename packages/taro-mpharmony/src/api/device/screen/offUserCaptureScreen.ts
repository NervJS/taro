import Taro from "@tarojs/taro"

export const offUserCaptureScreen: typeof Taro.offUserCaptureScreen = (callback) => {
  // @ts-ignore
  const ret = native.offUserCaptureScreen(callback)
  return ret
}

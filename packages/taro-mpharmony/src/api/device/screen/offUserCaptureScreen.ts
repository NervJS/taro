import Taro from "@tarojs/taro"

export const offUserCaptureScreen: typeof Taro.offUserCaptureScreen = (callback) => {
  console.log('off user capture screen')
  // @ts-ignore
  const ret = native.offUserCaptureScreen(callback)
  return ret
}

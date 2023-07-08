import Taro from "@tarojs/taro"

export const onGyroscopeChange: typeof Taro.onGyroscopeChange = (callback) => {
  console.log('on gyroscope change')
  // @ts-ignore
  const ret = native.onGyroscopeChange(callback)
  return ret
}

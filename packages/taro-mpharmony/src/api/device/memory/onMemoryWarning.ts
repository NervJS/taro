import Taro from "@tarojs/taro"

export const onMemoryWarning: typeof Taro.onMemoryWarning = (callback) => {
  console.log('on memory warning')
  // @ts-ignore
  const ret = native.onMemoryWarning(callback)
  return ret
}

import Taro from "@tarojs/taro"

export const offMemoryWarning: typeof Taro.offMemoryWarning = (callback) => {

  console.log('off memory warning')
  // @ts-ignore
  const ret = native.offMemoryWarning(callback)
  return ret
}

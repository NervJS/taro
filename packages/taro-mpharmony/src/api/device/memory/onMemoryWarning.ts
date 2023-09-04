import Taro from '@tarojs/taro'

export const onMemoryWarning: typeof Taro.onMemoryWarning = (callback) => {
  const ret: Taro.onMemoryWarning.CallbackResult = {
    level: 5
  }
  callback(ret)
}

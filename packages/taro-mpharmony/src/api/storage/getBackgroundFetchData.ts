import Taro from '@tarojs/taro'

// null-implementation
export const getBackgroundFetchData: typeof Taro.getBackgroundFetchData = function (option) {
  const name = 'getBackgroundFetchData'
  return new Promise<TaroGeneral.CallbackResult>(() => {
    try {
      option?.fail?.({ errMsg: `${name}:fail` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  })
}
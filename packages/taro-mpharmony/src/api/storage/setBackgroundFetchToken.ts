import Taro from '@tarojs/taro'

// null-implementation
export const setBackgroundFetchToken: typeof Taro.setBackgroundFetchToken = function (option) {
  const name = 'setBackgroundFetchToken'
  return new Promise<TaroGeneral.CallbackResult>(() => {
    try {
      option?.fail?.({ errMsg: `${name}:fail` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  })
}
import Taro from '@tarojs/taro'

/**
 * 拉取 backgroundFetch 客户端缓存数据
 * 
 * @canUse getBackgroundFetchData
 * @null_implementation
 */
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

import * as H5 from '@tarojs/taro-h5'
import Taro from './index'

const {
  initNativeApi,
  ...apis
} = H5

initNativeApi(Taro)

const taro = Object.assign(Taro, apis)

export default taro
export * from './index'
export * from '@tarojs/taro-h5'
export const getApp = Taro.getApp

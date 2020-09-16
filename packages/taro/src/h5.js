import { initNativeApi } from '@tarojs/taro-h5'
import Taro from './index'

initNativeApi(Taro)

export default Taro
export * from './index'
export * from '@tarojs/taro-h5'
export const getApp = Taro.getApp

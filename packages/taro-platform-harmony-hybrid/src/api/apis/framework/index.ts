import Taro from '@tarojs/api'

export const getApp: typeof Taro.getApp = function <T extends Taro.App = TaroGeneral.IAnyObject> () {
  return Taro.getCurrentInstance().app as unknown as T
}

export { getCurrentPages } from '@tarojs/router'
export { getApp } from '@tarojs/taro-h5'
export { getCurrentInstance } from '@tarojs/taro-h5'

// 自定义组件
export const getCurrentInstance = Taro.getCurrentInstance




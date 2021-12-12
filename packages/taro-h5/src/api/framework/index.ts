import Taro from '@tarojs/api'

export const getApp: typeof Taro.getApp = function <T = TaroGeneral.IAnyObject> () {
  return Taro.getCurrentInstance().app as unknown as Taro.getApp.Instance<T>
}

export { getCurrentPages } from '@tarojs/router'

// 自定义组件
export const getCurrentInstance = Taro.getCurrentInstance

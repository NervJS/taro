import { isObject } from './utils'

export function Behavior (options) {
  return options
}

export function getPreload (current) {
  return function (key, val) {
    current.preloadData = isObject(key)
      ? key
      : {
        [key]: val
      }
  }
}

const defaultDesignWidth = 750
const defaultDesignRatio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
}

export function getInitPxTransform (taro) {
  return function (config) {
    const {
      designWidth = defaultDesignWidth,
      deviceRatio = defaultDesignRatio
    } = config
    taro.config = taro.config || {}
    taro.config.designWidth = designWidth
    taro.config.deviceRatio = deviceRatio
  }
}

export function getPxTransform (taro) {
  return function (size) {
    const {
      designWidth = defaultDesignWidth,
      deviceRatio = defaultDesignRatio
    } = taro.config || {}
    if (!(designWidth in deviceRatio)) {
      throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
    }
    return (parseInt(size, 10) * deviceRatio[designWidth]) + 'rpx'
  }
}

import { isFunction, isObject } from './utils'

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
const defaultBaseFontSize = 20

export function getInitPxTransform (taro) {
  return function (config) {
    const {
      designWidth = defaultDesignWidth,
      deviceRatio = defaultDesignRatio,
      baseFontSize = defaultBaseFontSize
    } = config
    taro.config = taro.config || {}
    taro.config.designWidth = designWidth
    taro.config.deviceRatio = deviceRatio
    taro.config.baseFontSize = baseFontSize
  }
}

export function getPxTransform (taro) {
  return function (size) {
    const config = taro.config || {}
    const deviceRatio = config.deviceRatio || defaultDesignRatio
    const designWidth = (((input = 0) => isFunction(config.designWidth)
      ? config.designWidth(input)
      : config.designWidth || defaultDesignWidth))(size)
    if (!(designWidth in deviceRatio)) {
      throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
    }
    return (parseInt(size, 10) * deviceRatio[designWidth]) + 'rpx'
  }
}

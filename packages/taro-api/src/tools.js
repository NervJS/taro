export function Behavior (options) {
  return options
}

export function getPreload (taro) {
  return function (key, val) {
    if (typeof key === 'object') {
      taro.preloadData = key
    } else if (key !== undefined && val !== undefined) {
      taro.preloadData = {
        [key]: val
      }
    }
  }
}

export function getInitPxTransform (taro) {
  return function (config) {
    const {
      designWidth = 750,
      deviceRatio = {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    } = config
    taro.config = taro.config || {}
    taro.config.designWidth = designWidth
    taro.config.deviceRatio = deviceRatio
  }
}

export function getPxTransform (taro) {
  return function (size) {
    const {
      designWidth = 750,
      deviceRatio = {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    } = taro.config || {}
    if (!(designWidth in deviceRatio)) {
      throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
    }
    return (parseInt(size, 10) * deviceRatio[designWidth]) + 'rpx'
  }
}

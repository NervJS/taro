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
const defaultUnitPrecision = 5
const defaultTargetUnit = 'rpx'

export function getInitPxTransform (taro) {
  return function (config) {
    const {
      designWidth = defaultDesignWidth,
      deviceRatio = defaultDesignRatio,
      baseFontSize = defaultBaseFontSize,
      targetUnit = defaultTargetUnit,
      unitPrecision = defaultUnitPrecision,
    } = config
    taro.config = taro.config || {}
    taro.config.designWidth = designWidth
    taro.config.deviceRatio = deviceRatio
    taro.config.baseFontSize = baseFontSize
    taro.config.targetUnit = targetUnit
    taro.config.unitPrecision = unitPrecision
  }
}

export function getPxTransform (taro) {
  return function (size) {
    const config = taro.config || {}
    const baseFontSize = config.baseFontSize
    const deviceRatio = config.deviceRatio || defaultDesignRatio
    const designWidth = (((input = 0) => isFunction(config.designWidth)
      ? config.designWidth(input)
      : config.designWidth || defaultDesignWidth))(size)
    if (!(designWidth in deviceRatio)) {
      throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
    }
    const targetUnit = config.targetUnit || defaultTargetUnit
    const unitPrecision = config.unitPrecision || defaultUnitPrecision
    const formatSize = ~~size
    let rootValue = 1 / deviceRatio[designWidth]
    switch (targetUnit) {
      case 'rem':
        rootValue *= baseFontSize * 2
        break
      case 'px':
        rootValue *= 2
        break
    }
    let val = formatSize / rootValue
    if (unitPrecision >= 0 && unitPrecision <= 100) {
      val = Number(val.toFixed(unitPrecision))
    }
    return val + targetUnit
  }
}

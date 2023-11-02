/**
 * 该模块仅存放 convert 转换时用到的工具函数或变量
 */

export const cacheOptions = {
  cacheOptions: {},
  setOptionsToCache: function (options) {
    if (Object.keys(options).length !== 0) {
      this.cacheOptions = options
    }
  },
  getOptionsFromCache: function () {
    return this.cacheOptions
  }
}  

function toCamelCase (s) {
  let camel = ''
  let nextCap = false
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '-') {
      camel += nextCap ? s[i].toUpperCase() : s[i]
      nextCap = false
    } else {
      nextCap = true
    }
  }
  return camel
}

export const convertToArray = function (value, fn) {
  if (value instanceof Array) {
    return value.map(fn)
  } else if (typeof value === 'number') {
    return Array.from({
      length: value
    }, (_, index) => index).map(fn)
  } else if (typeof value === 'string') {
    return Array.from(value).map(fn)
  } else if (typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype) {
    const result = Object.keys(value).map((item) => {
      return fn(value[item], item)
    })
    return result
  }
}

export const getTarget = (target, Taro) => {
  if (!target) {
    return { dataset: {} }
  }
  if (Taro.getEnv() === Taro.ENV_TYPE.MPHARMONY || Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    if (target.fullDataset) {
      return { dataset: target.fullDataset }
    }
    const fullDataset = {}
    // 获取元素的所有属性
    const targetAttrKeys = Object.keys(target)
    // 遍历所有属性
    for (let i = 0; i < targetAttrKeys.length; i++) {
      if (targetAttrKeys[i].startsWith('data-')) {
        fullDataset[toCamelCase(targetAttrKeys[i].replace(/^data-/, '').toLowerCase())] = target[targetAttrKeys[i]]
      }
    }
    target.fullDataset = fullDataset
    return { dataset: fullDataset }
  }
  return target
}
import Taro from '../../taro/index'
/**
 * 开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
 * @param {Object} object 参数
 */
const startPullDownRefresh = function (object = {}) {
  return new Promise((resolve, reject) => {
    const { success, fail, complete } = object
    const res = {}
    Taro.eventCenter.trigger('__taroStartPullDownRefresh', {
      successHandler: () => {
        success && success(res)
        complete && complete()
        resolve(res)
      },
      errorHandler: () => {
        fail && fail(res)
        complete && complete()
        reject(res)
      }
    })
  })
}

/**
 * 停止当前页面下拉刷新。
 * @param {Object} object 参数
 */
const stopPullDownRefresh = function (object = {}) {
  return new Promise((resolve, reject) => {
    const { success, fail, complete } = object
    const res = {}
    Taro.eventCenter.trigger('__taroStopPullDownRefresh', {
      successHandler: () => {
        success && success(res)
        complete && complete()
        resolve(res)
      },
      errorHandler: () => {
        fail && fail(res)
        complete && complete()
        reject(res)
      }
    })
  })
}

export {
  startPullDownRefresh,
  stopPullDownRefresh
}

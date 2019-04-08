import { getSystemInfo, getSystemInfoSync } from './info'
import { getNetworkType, onNetworkStatusChange } from './network'
import { weixinCorpSupport } from '../utils'

function processApis(apiName, defaultOptions) {
  if (!window.wx) {
    return weixinCorpSupport(apiName)
  }
  return (options, ...args) => {
    options = options || {}
    let task = null
    let obj = Object.assign({}, defaultOptions, options)
    if (typeof options === 'string') {
      if (args.length) {
        return wx[apiName](options, ...args)
      }
      return wx[apiName](options)
    }
    const p = new Promise((resolve, reject) => {
      ;['fail', 'success', 'complete'].forEach(k => {
        obj[k] = res => {
          options[k] && options[k](res)
          if (k === 'success') {
            if (apiName === 'connectSocket') {
              resolve(Promise.resolve().then(() => Object.assign(task, res)))
            } else {
              resolve(res)
            }
          } else if (k === 'fail') {
            reject(res)
          }
        }
      })
      if (args.length) {
        task = wx[apiName](obj, ...args)
      } else {
        task = wx[apiName](obj)
      }
    })
    return p
  }
}
export const scanCode = processApis('scanQRCode', { needResult: 1 })
export const getLocation = processApis('getLocation')
export const openLocation = processApis('openLocation', { scale: 18 })
export { getSystemInfo, getSystemInfoSync, getNetworkType, onNetworkStatusChange }

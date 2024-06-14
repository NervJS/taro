import Taro from '@tarojs/api'
import { navigateTo as navigateToH5 } from '@tarojs/taro-h5'

const delay = 300
let lastExecuteTime = 0
let lastUrl

/**
 * 保留当前页面，跳转到应用内的某个页面。
 * 重复点击时 navigateTo 会重复跳转，因此进行限制。
 *
 * @canUse navigateTo
 * @__object [url, events]
 */
export function navigateTo (option: Taro.navigateTo.Option) {
  const targetUrl = option.url
  const executeTime = new Date().getTime()
  if (executeTime - lastExecuteTime < delay && lastUrl === targetUrl) {
    return Promise.resolve({ errMsg: 'navigateTo调用频率太高' })
  }
  lastExecuteTime = executeTime
  lastUrl = targetUrl
  return navigateToH5(option)
}

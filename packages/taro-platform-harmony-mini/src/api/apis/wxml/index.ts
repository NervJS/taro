import Taro from '@tarojs/api'

import { SelectorQuery } from './selectorQuery'

/**
 * 返回一个 SelectorQuery 对象实例
 * 
 * @canUse createSelectorQuery
 */

export const createSelectorQuery: typeof Taro.createSelectorQuery = () => {
  return new SelectorQuery()
}

/**
 * 创建并返回一个 IntersectionObserver 对象实例
 * 
 * @canUse createIntersectionObserver
 */
export { createIntersectionObserver } from '@tarojs/taro-h5'

/**
 * IntersectionObserver 对象，用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见
 * 
 * @canUse IntersectionObserver
 * @__class [disconnect, observe, relativeTo, relativeToViewport]
 */

/**
 * 创建并返回一个 MediaQueryObserver 对象实例
 * 
 * @canUse createMediaQueryObserver
 */
export { createMediaQueryObserver } from '@tarojs/taro-h5'

/**
 * MediaQueryObserver 对象，用于监听页面 media query 状态的变化，如界面的长宽是不是在某个指定的范围内
 * 
 * @canUse MediaQueryObserver
 * @__class [observe, disconnect]
 */

/**
 * Snapshot 实例，可通过 SelectorQuery 获取。
 * 
 * @canNotUse Snapshot
 */
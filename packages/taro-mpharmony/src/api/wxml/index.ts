import Taro from '@tarojs/api'

import { TaroH5IntersectionObserver } from './IntersectionObserver'
import { MediaQueryObserver } from './MediaQueryObserver'
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
export const createIntersectionObserver: typeof Taro.createIntersectionObserver = (component, options) => {
  return new TaroH5IntersectionObserver(component, options)
}

/**
 * 创建并返回一个 MediaQueryObserver 对象实例
 * 
 * @canUse createMediaQueryObserver
 */
export const createMediaQueryObserver: typeof Taro.createMediaQueryObserver = () => {
  return new MediaQueryObserver()
}

/**
 * Snapshot 实例，可通过 SelectorQuery 获取。
 * 
 * @canNotUse Snapshot
 */
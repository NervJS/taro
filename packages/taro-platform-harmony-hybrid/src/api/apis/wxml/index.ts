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
 * Snapshot 实例，可通过 SelectorQuery 获取。
 * 
 * @canNotUse Snapshot
 */
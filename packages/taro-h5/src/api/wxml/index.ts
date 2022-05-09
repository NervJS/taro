import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../utils'
import { SelectorQuery } from './selectorQuery'

export const createSelectorQuery: typeof Taro.createSelectorQuery = () => {
  return new SelectorQuery()
}

export const createIntersectionObserver = temporarilyNotSupport('createIntersectionObserver')

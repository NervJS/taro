import Taro from '@tarojs/taro'

import { IntersectionObserver } from './IntersectionObserver'
import { SelectorQuery } from './selectorQuery'

export const createSelectorQuery = () => {
  return new SelectorQuery()
}

export const createIntersectionObserver: typeof Taro.createIntersectionObserver = (component, options) => {
  return new IntersectionObserver(component, options)
}

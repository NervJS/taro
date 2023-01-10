import Taro from '@tarojs/api'

import { TaroH5IntersectionObserver } from './IntersectionObserver'
import { MediaQueryObserver } from './MediaQueryObserver'
import { SelectorQuery } from './selectorQuery'

export const createSelectorQuery: typeof Taro.createSelectorQuery = () => {
  return new SelectorQuery()
}

export const createIntersectionObserver: typeof Taro.createIntersectionObserver = (component, options) => {
  return new TaroH5IntersectionObserver(component, options)
}

export const createMediaQueryObserver: typeof Taro.createMediaQueryObserver = () => {
  return new MediaQueryObserver()
}
 
import { temporarilyNotSupport } from '../utils'
import { IntersectionObserver } from './IntersectionObserver'
import { SelectorQuery } from './selectorQuery'

import type Taro from '@tarojs/taro/types'

export const createSelectorQuery = () => {
  return new SelectorQuery()
}

export const createIntersectionObserver: typeof Taro.createIntersectionObserver = (component, options) => {
  return new IntersectionObserver(component, options)
}

export const createMediaQueryObserver = /* @__PURE__ */ temporarilyNotSupport('createMediaQueryObserver')

export { IntersectionObserver }

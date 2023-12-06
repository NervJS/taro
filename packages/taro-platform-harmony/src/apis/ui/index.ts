import { temporarilyNotSupport } from '../utils'
import { Animation } from './animation'

import type Taro from '@tarojs/api'

export const createAnimation = (option: Taro.createAnimation.Option) => {
  return new Animation(option)
}
export const getMenuButtonBoundingClientRect = temporarilyNotSupport('getMenuButtonBoundingClientRect')

export * from './background'
export * from './interaction'
export * from './navigation-bar'
export * from './pull-down-refresh'

import Taro from '@tarojs/api'

import { Animation } from './animation'

export const createAnimation = (option: Taro.createAnimation.Option) => {
  return new Animation(option)
}
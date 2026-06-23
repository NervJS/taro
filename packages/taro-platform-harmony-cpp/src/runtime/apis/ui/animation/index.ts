import { Animation } from './animation'

import type Taro from '@tarojs/taro/types'

export const createAnimation = (option: Taro.createAnimation.Option) => {
  return new Animation(option)
}

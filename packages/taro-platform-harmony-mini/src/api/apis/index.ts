import Taro from '@tarojs/api'

export * from './base'
export * from './canvas'
export * from './device'
export * from './files'
export * from './framework'
export * from './location'
export * from './media'
export * from './navigate'
export * from './network'
export * from './open-api'
export * from './route'
export * from './ui'
export * from './wxml'

export { initTabBarApis } from '@tarojs/taro-h5'
export * from './extend-h5'

Taro.eventCenter.on('__taroSetNavigationStyle', (style, textStyle, backgroundColor) => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.native?.setNavigationStyle?.(style, textStyle, backgroundColor)
    // @ts-ignore
    window.currentNavigationStyle = style
  }
})

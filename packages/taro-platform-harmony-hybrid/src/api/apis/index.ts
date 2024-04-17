import Taro from '@tarojs/api'

import native from './NativeApi'

export * from './ad'
export * from './ai'
export * from './alipay'
export * from './base'
export * from './canvas'
export * from './cloud'
export * from './data-analysis'
export * from './device'
export * from './extend-h5-apis'
export * from './files'
export * from './framework'
export * from './location'
export * from './media'
export * from './navigate'
export * from './network'
export * from './open-api'
export * from './payment'
export * from './qq'
export * from './route'
export * from './share'
export * from './storage'
export * from './swan'
export * from './ui'
export * from './worker'
export * from './wxml'

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.currentNavigation = {}
}

Taro.eventCenter.on('__taroSetNavigationStyle', (style, textStyle, backgroundColor) => {
  if (typeof window !== 'undefined') {
    native.setNavigationStyle({ style: style, textStyle: textStyle, backgroundColor: backgroundColor })
    // @ts-ignore
    Object.assign(window.currentNavigation, {
      style,
      textStyle,
      backgroundColor,
    })
    // @ts-ignore
    if (typeof window.originCapsuleState !== 'undefined') {
      // @ts-ignore
      window.native?.setCapsuleState?.(window.originCapsuleState)
    }
  }
})

Taro.eventCenter.on('__taroEnterFullScreen', () => {
  native.setNavigationStyle({ style: 'custom', textStyle: 'black', backgroundColor: '#000000' })
  // @ts-ignore
  if (typeof window.originCapsuleState === 'undefined') {
    // @ts-ignore
    window.originCapsuleState = window.native?.getCapsuleState().visible
  }
  // @ts-ignore
  window.native?.setCapsuleState?.(false)
})

Taro.eventCenter.on('__taroExitFullScreen', () => {
  // @ts-ignore
  const { style, textStyle, backgroundColor } = window.currentNavigation
  native.setNavigationStyle({ style: style, textStyle: textStyle, backgroundColor: backgroundColor })
  // @ts-ignore
  if (typeof window.originCapsuleState !== 'undefined') {
    // @ts-ignore
    window.native?.setCapsuleState?.(window.originCapsuleState)
  }
})

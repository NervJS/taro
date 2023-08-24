import { hooks } from '@tarojs/shared'

// declare const __TARO_FRAMEWORK__: string;

hooks.tap('initNativeApi', function (_taro) {})

export * from './app'
export * from './connect'
export * from './hooks'
export * from './page'

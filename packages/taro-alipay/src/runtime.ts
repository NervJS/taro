import { mergeReconciler, mergeInternalComponents } from '@tarojs/shared'
import { hostConfig, components } from './runtime-utils'

// 支付宝真机只有 navigator.swuserAgent
const { userAgent } = navigator
Object.defineProperty(navigator, 'userAgent', {
  configurable: true,
  enumerable: true,
  get () {
    return userAgent || (navigator as any).swuserAgent || ''
  }
})

mergeReconciler(hostConfig)
mergeInternalComponents(components)

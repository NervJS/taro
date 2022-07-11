import { hooks, mergeInternalComponents, mergeReconciler } from '@tarojs/shared'

import { components, hostConfig } from './runtime-utils'

// 支付宝真机只有 navigator.swuserAgent
const { userAgent } = navigator
Object.defineProperty(navigator, 'userAgent', {
  configurable: true,
  enumerable: true,
  get () {
    return userAgent || (navigator as any).swuserAgent || ''
  }
})

hooks.tap('onSetThirdPartyComponentsEvent', (dom: any, name: string, value: any) => {
  // 以on开头的参数成员，作为attr设置，最终给原生三方组件使用
  dom.setAttribute(name, value)
  dom.props[name] = value
})

hooks.tap('bindFunctionPropertyToPage', (Current:{page:any},dom: any, name: string, value: any) => {
  // 如果是三方组件的函数，需要绑定到页面上进行处理
  Current.page[`${dom.sid}${name}`] = value
})

mergeReconciler(hostConfig)
mergeInternalComponents(components)

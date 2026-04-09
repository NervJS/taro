/**
 * List 组件工具函数
 */

import Taro from '@tarojs/taro'

/** 有 scope 则 `query.in(scope)`，否则与原先一致（page / 根） */
export function createSelectorQueryScoped (selectorQueryScope?: object) {
  if (selectorQueryScope != null) {
    return Taro.createSelectorQuery().in(selectorQueryScope as any)
  }
  const instance = Taro.getCurrentInstance()
  return instance?.page
    ? Taro.createSelectorQuery().in(instance.page as any)
    : Taro.createSelectorQuery()
}

/** IO 作用域，缺省为 page */
export function getMiniProgramObserverScope (selectorQueryScope?: object) {
  return (selectorQueryScope ?? Taro.getCurrentInstance().page) as any
}

/** 判断是否为微信小程序 */
export const isWeapp = process.env.TARO_ENV === 'weapp'

/** 判断是否为支付宝小程序 */
export const isAlipay = process.env.TARO_ENV === 'alipay'

/** 判断是否为 H5 */
export const isH5 = process.env.TARO_ENV === 'h5'

/** 判断是否为小程序环境（微信/支付宝/百度/京东/头条等） */
export const isMiniProgram = isWeapp || isAlipay || process.env.TARO_ENV === 'swan' || process.env.TARO_ENV === 'tt' || process.env.TARO_ENV === 'jd'

/**
 * 是否支持原生 refresher（ScrollView refresher-*）
 * 以各平台 components 为准：weapp/jd/tt 的 ScrollView 有 refresher-enabled 等；harmony-hybrid 的 harmony-definition 中 refresher-* 为 false，走自定义下拉
 */
export const supportsNativeRefresher = isMiniProgram

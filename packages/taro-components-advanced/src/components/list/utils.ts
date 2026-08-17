/**
 * List 组件工具函数
 */

import Taro from '@tarojs/taro'

import { weappScope } from '../../utils/weapp-scope'

import type { RefObject } from 'react'

/**
 * 小程序：用 `weappScope(ref)` 取节点 `_scope`；有则 `createSelectorQuery().in(scope)`，无则不调 `in`。
 * 与 WaterFlow、DongDesign jdpopover 同源，替代原先业务侧传入的 `selectorQueryScope`。
 */
export function createSelectorQueryForRef (
  ref: RefObject<any> | null | undefined
) {
  const scope = weappScope(ref)
  if (scope != null) {
    return Taro.createSelectorQuery().in(scope as any)
  }
  return Taro.createSelectorQuery()
}

/**
 * 仅用于 `Taro.createIntersectionObserver` 的第一个参数：优先 `weappScope(ref)`，无 `_scope` 时用当前 page。
 * （微信要求 IO 挂在组件实例上；与旧实现里「未传 scope 时用 page」的兜底一致。）
 */
export function getIntersectionObserverScopeForRef (
  ref: RefObject<any> | null | undefined
) {
  return (weappScope(ref) ?? Taro.getCurrentInstance().page) as any
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

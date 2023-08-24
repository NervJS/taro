/**
 * 鸿蒙SDK API Version 6
 * 将页面滚动到目标位置
 * - 支持选择器（只支持id选择器，暂不支持class选择器、子选择器、后代选择器、跨自定义组件选择器、多选择器并集）
 * - 滚动距离
 * 文档地址 https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-framework-syntax-js-0000000000611432
 */
import { Current } from '@tarojs/runtime'

import { callAsyncFail, callAsyncSuccess } from '../utils'

import type Taro from '@tarojs/taro'

type pageScrollTo = typeof Taro.pageScrollTo

// TODO
export const getCurrentPages = () => []

export const pageScrollTo: pageScrollTo = (options) => {
  return new Promise((resolve, reject) => {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const res = { errMsg: 'pageScrollTo:ok' }
    const error = { errMsg: 'pageScrollTo:fail' }
    const { scrollTop, selector = '', duration } = options
    try {
      page.$rootElement()?.scrollTo({
        position: scrollTop,
        id: selector.replace('#', ''),
        duration,
        timingFunction: 'ease',
        complete: () => {
          callAsyncSuccess(resolve, res, options)
        }
      })
    } catch (_) {
      callAsyncFail(reject, error, options)
    }
  })
}

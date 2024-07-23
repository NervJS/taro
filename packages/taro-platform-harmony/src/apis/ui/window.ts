import { temporarilyNotSupport } from '../utils'

import type Taro from '@tarojs/taro/types'

/**
 * 设置窗口大小，该接口仅适用于 PC 平台，使用细则请参见指南
 */
export const setWindowSize = /* @__PURE__ */ temporarilyNotSupport('setWindowSize')

/**
 * 监听窗口尺寸变化事件
 */
export const onWindowResize: typeof Taro.onWindowResize = /* @__PURE__ */ temporarilyNotSupport('onWindowResize')

/**
 * 取消监听窗口尺寸变化事件
 */
export const offWindowResize: typeof Taro.offWindowResize = /* @__PURE__ */ temporarilyNotSupport('offWindowResize')

export const checkIsPictureInPictureActive = /* @__PURE__ */ temporarilyNotSupport('checkIsPictureInPictureActive')

import { Shortcuts, toCamelCase } from '@tarojs/shared'

import {
  handleSyncApis,
  initNativeApi,
  modifyApis,
  modifyAsyncResult,
  request,
  transformMeta
} from './apis'

declare const getCurrentPages: any
declare const my: any

const BUBBLE_EVENTS = new Set([
  'touchStart',
  'touchMove',
  'touchEnd',
  'touchCancel',
  'tap',
  'longTap'
])

export {
  handleSyncApis,
  initNativeApi,
  modifyApis,
  modifyAsyncResult,
  request,
  transformMeta
}
export * from './apis-list'
export * from './components'
export const hostConfig = {
  initNativeApi,
  getMiniLifecycle (config) {
    config.component[0] = 'didMount'
    config.component[1] = 'didUnmount'
    return config
  },
  getEventCenter (Events) {
    if (!my.taroEventCenter) {
      my.taroEventCenter = new Events()
    }
    return my.taroEventCenter
  },
  modifyTaroEvent (event, node) {
    if (node.tagName === 'SWIPER' && event.type === 'animationend') {
      event.type = 'animationfinish'
    }
  },
  isBubbleEvents (eventName) {
    return BUBBLE_EVENTS.has(eventName)
  },
  transferHydrateData (data, element, componentsAlias) {
    if (element.isTransferElement) {
      const page = getCurrentPages()[0]
      data[Shortcuts.NodeName] = element.dataName
      page.setData({
        [toCamelCase(data.nn)]: data
      })
      return {
        sid: element.sid,
        [Shortcuts.Text]: '',
        [Shortcuts.NodeName]: componentsAlias['#text']?._num || '8'
      }
    }
  },
  modifyRecursiveComponentConfig (componentConfig, { isCustomWrapper }) {
    // 修改组件的生命周期配置
    return isCustomWrapper
      ? {
        ...componentConfig,
        deriveDataFromProps (nextProps) {
          if (this.data.i !== undefined && this.props.i !== nextProps.i) {
            this.setData({ i: nextProps.i })
          } 
        }
      }
      : componentConfig
  },
}

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
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
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
    if (!isCustomWrapper) return componentConfig

    const { didMount, didUpdate } = componentConfig

    const syncCustomWrapperRenderData = (ctx, nextData) => {
      if (!nextData) return

      const { ubid: nextUpdateBatchId = 0, sid: nextSid } = nextData
      const { ubid: curUpdateBatchId = -1, sid: curSid } = ctx.data.rd || {}

      if (curSid === nextSid && nextUpdateBatchId <= curUpdateBatchId) return
      ctx.setData({ rd: nextData })
    }

    return {
      ...componentConfig,
      deriveDataFromProps (nextProps) {
        syncCustomWrapperRenderData(this, nextProps.i)
      },
      didMount () {
        didMount?.call(this)
        syncCustomWrapperRenderData(this, this.props.i)
      },
      didUpdate (prevProps, prevData) {
        didUpdate?.call(this, prevProps, prevData)
        syncCustomWrapperRenderData(this, this.props.i)
      }
    }
  },
}

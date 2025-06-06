import { Shortcuts, toCamelCase } from '@tarojs/shared'

import { initNativeApi } from './apis'

declare const getCurrentPages: any

export { initNativeApi }
export * from './apis-list'
export * from './components'
export const hostConfig = {
  initNativeApi,
  getMiniLifecycle (config) {
    const methods = config.page[5]
    if (methods.indexOf('onSaveExitState') === -1) {
      methods.push('onSaveExitState')
    }
    return config
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
}

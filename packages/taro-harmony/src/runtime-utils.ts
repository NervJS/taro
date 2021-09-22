import { internalComponents } from '@tarojs/shared'
import { initNativeApi } from './apis'

export { initNativeApi }
export * from './components'
export const hostConfig = {
  initNativeApi,
  modifyTaroEvent (event, node) {
    const comps = Object.keys(internalComponents).map(c => c.toLowerCase())
    const tagName = node.tagName.toLowerCase()
    if (event.type === 'click' && comps.includes(tagName)) {
      event.type = 'tap'
    }
  },
  getPathIndex (indexOfNode) {
    return indexOfNode
  },
  getSpecialNodes () {
    return []
  },
  getMiniLifecycle (config) {
    config.app[0] = 'onCreate'
    config.page[0] = 'onInit'
    config.page[1] = 'onDestroy'
    config.page[5] = [
      'onActive',
      'onInactive',
      'onBackPress',
      'onNewRequest',
      'onStartContinuation',
      'onSaveData',
      'onRestoreData',
      'onCompleteContinuation'
    ]
    return config
  },
  modifyPageObject (config) {
    const origin = config.onInit
    config.onInit = function (options = {}) {
      this.setData = function (normalUpdate: Record<string, any>, cb) {
        Object.keys(normalUpdate).forEach(path => {
          this.$set(path, normalUpdate[path])
        })
        cb()
      }

      Object.keys((this as any)._data).forEach(key => {
        if (!/^root\b/.test(key) && !/^\$i18n\b/.test(key)) {
          options[key] = (this as any)._data[key]
        }
      })
      origin.call(this, options)
    }
  }
}

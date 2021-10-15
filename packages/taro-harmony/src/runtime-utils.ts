import { internalComponents } from '@tarojs/shared'
import { initNativeApi } from './apis'

declare const getApp: any

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
      // 对接小程序规范的 setData 到 harmony 规范的 $set
      this.setData = function (normalUpdate: Record<string, any>, cb) {
        Object.keys(normalUpdate).forEach(path => {
          this.$set(path, normalUpdate[path])
        })
        cb()
      }

      // 处理路由参数
      Object.keys((this as any)._data).forEach(key => {
        if (!/^root\b/.test(key) && !/^\$i18n\b/.test(key)) {
          options[key] = (this as any)._data[key]
        }
      })
      origin.call(this, options)

      // 根据 page.config 初始化 navbar
      const appConfig = getApp().config
      const pageConfig = this.config
      const window = Object.assign({}, appConfig.window, pageConfig)

      this.$set('taroNavBar', {
        background: window.navigationBarBackgroundColor || '#000000',
        textStyle: window.navigationBarTextStyle || 'white',
        title: window.navigationBarTitleText || '',
        style: window.navigationStyle || 'default'
      })
    }
  }
}

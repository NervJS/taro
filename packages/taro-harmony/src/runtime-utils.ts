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
    config.onInit = function () {
      // 对接小程序规范的 setData 到 harmony 规范的 $set
      this.setData = function (normalUpdate: Record<string, any>, cb) {
        Object.keys(normalUpdate).forEach(path => {
          this.$set(path, normalUpdate[path])
        })
        cb()
      }

      // 处理路由参数
      const options = {}
      Object.keys((this as any)._data).forEach(key => {
        if (!/^root\b/.test(key) && !/^\$i18n\b/.test(key)) {
          options[key] = (this as any)._data[key]
        }
      })

      // 调用 onInit
      origin.call(this, options)

      // 手动记录路由堆栈
      const app = getApp()
      const pagePath = this.$taroPath.split('?')[0]
      if (!app.pageStack) {
        app.pageStack = []
      }
      app.pageStack.push(pagePath)

      // 根据 page.config 初始化 navbar
      const appConfig = app.config
      const pageConfig = this.config
      const window = Object.assign({}, appConfig.window, pageConfig)

      this.$set('taroNavBar', {
        background: window.navigationBarBackgroundColor || '#000000',
        textStyle: window.navigationBarTextStyle || 'white',
        title: window.navigationBarTitleText || '',
        style: window.navigationStyle || 'default'
      })

      // 根据 app.config 初始化 tabbar
      if (appConfig.tabBar) {
        const list = appConfig.tabBar.list
        for (const idx in list) {
          const item = list[idx]
          if (item.pagePath === pagePath) {
            this.$set('selected', idx)
            this.$set('isShowTaroTabBar', true)
            this.$set('taroTabBar', appConfig.tabBar)
            break
          }
        }
      }
    }
  }
}

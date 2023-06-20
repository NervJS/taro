import router from '@system.router'

import { covertHex3ToHex6 } from '../utils'

export default {
  props: {
    tabbarData: {
      default: {}
    },
    selected: Number
  },
  computed: {
    borderStyle () {
      return this.tabbarData.borderStyle || 'black'
    },
    color () {
      return covertHex3ToHex6(this.tabbarData.color)
    },
    selectedColor () {
      return covertHex3ToHex6(this.tabbarData.selectedColor)
    },
    backgroundColor () {
      return covertHex3ToHex6(this.tabbarData.backgroundColor)
    }
  },
  jump (pagePath) {
    // @todo 如果跳的 tabbar 页已打开过，优先复用
    const app = getApp()
    const pages = app.pageStack

    for (let i = 0; i < pages.length; i++) {
      const item = pages[i]
      if (item === pagePath) {
        return router.back({
          uri: item
        })
      }
    }

    router.push({ uri: pagePath })
  }
}

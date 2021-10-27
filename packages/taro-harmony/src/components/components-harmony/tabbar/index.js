import router from '@system.router'

function covertHex3ToHex6 (color) {
  return color.replace(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/, '#$1$1$2$2$3$3')
}

export default {
  props: {
    data: {
      default: {}
    },
    selected: Number
  },
  computed: {
    borderStyle () {
      return this.data.borderStyle || 'black'
    },
    color () {
      return covertHex3ToHex6(this.data.color)
    },
    selectedColor () {
      return covertHex3ToHex6(this.data.selectedColor)
    },
    backgroundColor () {
      return covertHex3ToHex6(this.data.backgroundColor)
    }
  },
  jump (pagePath) {
    // @todo 如果跳的 tabbar 页已打开过，优先复用
    const app = getApp()
    const pages = app.pageStack

    for (let i = 0; i < pages.length; i++) {
      const item = pages[i]
      if (item === pagePath) {
        app.pageStack = pages.slice(0, i + 1)
        return router.back({
          uri: item
        })
      }
    }

    router.push({ uri: pagePath })
  }
}

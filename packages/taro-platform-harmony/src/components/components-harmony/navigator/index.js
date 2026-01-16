import router from '@system.router'

import { createOption, queryToJson } from '../utils'

export default createOption({
  props: {
    id: {
      default: ''
    },
    openType: {
      default: 'navigate'
    },
    url: {
      default: ''
    },
    hoverStartTime: {
      default: 50
    },
    hoverStayTime: {
      default: 600
    },
    hoverClass: {
      default: 'navigator-hover'
    }
  },

  data () {
    return {
      targetObj: {
        navigate: 'push',
        redirect: 'replace',
        switchTab: 'push',
        reLaunch: 'replace',
        navigateBack: 'back'
      },
      hover: false,
      touch: false
    }
  },

  computed: {
    clsHover () {
      return this.hover ? this.hoverClass : ''
    }
  },

  onClick () {
    const { openType = 'navigate', url = '' } = this
    this.getRouterFunc(`${openType}`, url)
  },

  getRouterFunc (method, url) {
    const methodName = this.targetObj[method]
    const [uri, queryString = ''] = url.split('?')
    const params = queryToJson(queryString)

    const uriObj = url ? { uri: uri.replace(/^\//, '') } : {}

    const paramsObj = queryString ? { params } : {}

    if (method === 'reLaunch') {
      return router.clear()
    } else if (method === 'switchTab') {
      const app = getApp()
      const pages = app.pageStack

      for (let i = 0; i < pages.length; i++) {
        const item = pages[i]
        if (item === uriObj.uri) {
          return router.back({
            uri: item
          })
        }
      }
    }

    router[methodName]({
      ...uriObj,
      ...paramsObj
    })
  },

  onTouchStart () {
    this.touch = true
    if (this.hoverClass) {
      setTimeout(() => {
        if (this.touch) {
          this.hover = true
        }
      }, this.hoverStartTime)
    }
  },

  onTouchEnd () {
    this.touch = false
    if (this.hoverClass) {
      setTimeout(() => {
        if (!this.touch) {
          this.hover = false
        }
      }, this.hoverStayTime)
    }
  }
})

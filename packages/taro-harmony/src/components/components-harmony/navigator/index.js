import router from '@system.router'
import { createOption } from '../utils'

export default createOption({
  props: {
    id: {
      default: ''
    },
    cls: {
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
    // switchTab目前实现不了
    const methodName = this.targetObj[method]
    const [uri, queryString = ''] = url.split('?')
    const params = this.queryToJson(queryString)

    const uriObj = url ? { uri: uri.replace(/^\//, '') } : {}

    const paramsObj = queryString ? { params } : {}

    if (method === 'reLaunch') {
      router.clear()
    }

    router[methodName]({
      ...uriObj,
      ...paramsObj
    })
  },

  queryToJson (str) {
    const dec = decodeURIComponent
    const qp = str.split('&')
    const ret = {}
    let name
    let val
    for (let i = 0, l = qp.length, item; i < l; ++i) {
      item = qp[i]
      if (item.length) {
        const s = item.indexOf('=')
        if (s < 0) {
          name = dec(item)
          val = ''
        } else {
          name = dec(item.slice(0, s))
          val = dec(item.slice(s + 1))
        }
        if (typeof ret[name] === 'string') {
          ret[name] = [ret[name]]
        }

        if (Array.isArray(ret[name])) {
          ret[name].push(val)
        } else {
          ret[name] = val
        }
      }
    }
    return ret
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

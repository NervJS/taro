import Nerv from 'nervjs'
import history, {
  navigateTo,
  navigateBack,
  redirectTo
} from './lib/history'
import './router.css'

const registeredPages = {}
let registeredPagesArr = []

const hasPage = (pathname) => {
  const isNormalPage = registeredPagesArr.some(v => {
    return pathname === v[0]
  })
  const isIndex = /^\/(index(\.html)?)?[^/]*$/.test(pathname)
  if (isNormalPage || isIndex) return true
  return false
}
const getPage = (pathname) => {
  if (pathname in registeredPages) {
    return registeredPages[pathname]
  } else {
    return registeredPagesArr[0][1]
  }
}

const getWrappedComponent = (component, { location }) => {
  class Wrapped extends component {
    /**
     * __pageStatus
     *   1 - 已隐藏
     *   2 - 展示
     *   3 - 未展示
     *   4 - 被后退
     */
    __pageStatus = 3
    constructor (props, context) {
      context.$router = location
      super(props, context)
      this.$router = location
      this.pageId = location.pageId

      if (this.pageId === 0) {
        this.__pageStatus = 2
      } else {
        this.__pageStatus = 3
      }
    }

    componentWillReceiveProps (nextProps) {
      super.componentWillReceiveProps && super.componentWillReceiveProps()

      const nextLocation = nextProps.location
      const lastShouldShow = this.props.location.pageId === this.pageId
      const nextShouldShow = nextLocation.pageId === this.pageId

      // 显示状态未发生变化
      const noChange = lastShouldShow === nextShouldShow

      if (nextLocation.pageId < this.pageId) {
        this.__pageStatus = 4
        if (noChange) return
        this.forceUpdate()
        this.componentDidHide && this.componentDidHide()
      } else if (nextLocation.pageId > this.pageId) {
        this.__pageStatus = 1
        if (noChange) return
        this.forceUpdate()
        this.componentDidHide && this.componentDidHide()
      } else {
        this.__pageStatus = 2
        if (noChange) return
        this.forceUpdate()
        this.componentDidShow && this.componentDidShow()
      }
    }

    componentDidMount () {
      let nextStatus = this.props.location.pageId === this.pageId ? 2 : 1
      if (this.__pageStatus === nextStatus) {
        super.componentDidMount && super.componentDidMount()
        super.componentDidShow && super.componentDidShow()
        return
      }
      setTimeout(() => {
        this.__pageStatus = 2
        this.defaultShow = true
        this.forceUpdate()
        super.componentDidMount && super.componentDidMount()
        super.componentDidShow && super.componentDidShow()
      }, 100)
    }

    componentWillUnmount () {
      super.componentDidHide && super.componentDidHide()
      super.componentWillUnmount && super.componentWillUnmount()
    }

    render () {
      let pageClassName = 'taro_page'
      let pageContent = ''
      switch (this.__pageStatus) {
        case 1:
          pageClassName = 'taro_page taro_page_hide'
          pageContent = super.render()
          break
        case 2:
          pageClassName = 'taro_page taro_page_show'
          pageContent = super.render()
          break
        case 3:
          pageClassName = 'taro_page'
          break
        case 4:
          pageClassName = 'taro_page'
          pageContent = super.render()
          break
      }
      return (
        <div className={pageClassName} dataPageid={this.pageId}>
          {pageContent}
        </div>
      )
    }
  }

  return Wrapped
}

const getCurrentPages = function (opts) {
  return history.now()
}

/**
 * Router组件内保存了每次路由变化后渲染的组件
 */
class Router extends Nerv.Component {
  constructor () {
    super(...arguments)

    this.state = {
      cached: [],
      current: null
    }
  }

  onHistoryChange = (location, action, payload) => {
    this.navigate(location, action, payload)
  }

  /**
   * 根据提供的location跳转
   *
   * @param {location} location 待跳转的location
   * @param {string} action 跳转的种类
   * @param {any} payload 附加参数
   */
  navigate (location, action, payload = {}) {
    const { fail, complete, success, url, delta } = payload
    let pathname
    if (action === 'BACK') {
      if (!url) return this.commit('BACK', null, { delta })
      else pathname = url
    } else if (action === 'FORWARD') {
      if (!url) return this.commit('FORWARD', null, { delta })
      else pathname = url
    } else if (action === 'PUSH' || action === 'REPLACE') {
      pathname = location.url
    }

    /* loadPage */
    if (!hasPage(pathname)) {
      fail && fail()
      complete && complete()
      return console.warn('page not found')
    }
    getPage(pathname)()
      .then(loaded => {
        const wrapped = getWrappedComponent(loaded.default, { location })
        this.commit(action, wrapped, payload)
        success && success()
      }).catch(e => {
        fail && fail()
      }).then(() => {
        complete && complete()
      })
  }

  commit (action, el, payload) {
    const current = history.nowIdx()
    const { delta } = payload
    switch (action) {
      case 'PUSH':
        this.setState(state => {
          state.cached.splice(current, history.len(), el)
          return {
            current,
            cached: state.cached
          }
        })
        break
      case 'REPLACE':
        this.setState(state => {
          state.cached.splice(current, history.len(), el)
          return {
            current,
            cached: state.cached
          }
        })
        break
      case 'BACK':
        if (el) {
          this.setState((state) => {
            const cached = state.cached
            const paddingArr = new Array(Math.max(delta - current - 1, 0))
            Array.prototype.splice.apply(cached, [0, 10000, el, ...paddingArr])
            return {
              cached,
              current: 0
            }
          })
        } else {
          this.setState((state) => {
            state.cached.splice(current + 1)
            return {
              current,
              cached: state.cached
            }
          })
        }
        break
      case 'FORWARD':
        if (el) {
          this.setState((state) => {
            const cached = state.cached
            const paddingArr = new Array(Math.max(current + delta - cached.length, 0))
            Array.prototype.splice.apply(cached, [state.current, 10000, ...paddingArr, el])
            return {
              cached,
              current: cached.length - 1
            }
          })
        } else {
          this.setState((state) => {
            return { current }
          })
        }
        break
      default:
        console.warn('wrong action')
    }
  }

  getPages () {
    const location = history.now()
    return this.state.cached.map((Page, index) => {
      return <Page location={location} />
    })
  }

  componentDidMount () {
    history.listen(this.onHistoryChange)
    this.navigate(history.now(), 'PUSH')
  }

  componentWillUnmount () {
    history.unlisten(this.onHistoryChange)
  }

  render () {
    return <div className='taro_router'>{this.getPages()}</div>
  }
}

const initRouter = (pageArr, taro) => {
  registeredPagesArr = pageArr
  pageArr.forEach(v => {
    const pageName = v[0]
    const pageLoader = v[1]
    registeredPages[pageName] = pageLoader
  })
  taro.navigateTo = navigateTo
  taro.navigateBack = navigateBack
  taro.redirectTo = redirectTo
  taro.getCurrentPages = getCurrentPages
}

export default {
  Router,
  initRouter
}

export {
  Router,
  initRouter
}

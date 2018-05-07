import Nerv from 'nervjs'
import history, { navigateTo, navigateBack, redirectTo } from './lib/history'
import './router.css'

const registeredPages = {}
let registeredPagesArr = []

const hasPage = (pathname) => {
  const isNormalPage = registeredPagesArr.some(v => {
    return pathname === v[0]
  })
  const isIndex = /^\/(index(\.html)?)?[^/]*$/.test(pathname)
  if (isNormalPage || isIndex) return true
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
    constructor () {
      super(...arguments)
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
      super.componentDidMount && super.componentDidMount()
      super.componentDidShow && super.componentDidShow()
      let nextStatus = this.props.location.pageId === this.pageId ? 2 : 1
      if (this.__pageStatus === nextStatus) return
      setTimeout(() => {
        this.__pageStatus = 2
        this.forceUpdate()
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
        <div className={pageClassName}>
          {pageContent}
        </div>
      )
    }
  }

  return Wrapped
}

const getCurrentPages = function (opts) {
  return history.stack[0]
}

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

  componentDidMount () {
    history.listen(this.onHistoryChange)
    this.navigate(history.now(), 'PUSH')
  }

  componentWillUnmount () {
    history.unlisten(this.onHistoryChange)
  }

  navigate (location, action, payload = {}) {
    switch (action) {
      case 'PUSH':
      case 'REPLACE':
        const pathname = location.pathname
        if (!hasPage(pathname)) {
          payload.fail && payload.fail()
          payload.complete && payload.complete()
          return
        }
        getPage(pathname)()
          .then(loaded => {
            const wrapped = getWrappedComponent(loaded.default, { location })
            this.commit(action, wrapped)
            payload.success && payload.success()
          }).catch(e => {
            payload.fail && payload.fail()
          }).then(() => {
            payload.complete && payload.complete()
          })
        break
      case 'BACK':
        this.commit(action, null, payload)
    }
  }

  commit (action, el, payload) {
    switch (action) {
      case 'PUSH':
        this.setState(state => {
          state.cached.splice(history.current, history.len(), el)
          return {
            cached: state.cached,
            current: history.current
          }
        })
        break
      case 'REPLACE':
        this.setState(state => {
          state.cached.splice(history.current, history.len(), el)
          return {
            cached: state.cached,
            current: history.current
          }
        })
        break
      case 'BACK':
        if (!payload || !payload.delta) return Promise.reject(new Error('wrong arguments'))
        this.setState((state) => {
          state.cached.splice(history.current + 2)
          return {
            current: history.current,
            cached: state.cached
          }
        })
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

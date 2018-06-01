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

const PAGESTATUS = {
  HIDDEN: 1,
  SHOWING: 2
}

const getWrappedComponent = (component, { location }) => {
  class Wrapped extends component {
    __pageStatus = PAGESTATUS.SHOWING
    constructor (props, context) {
      context.$router = location
      super(props, context)
      this.$router = location
      this.locationState = location.state
    }

    componentWillReceiveProps (nextProps) {
      super.componentWillReceiveProps && super.componentWillReceiveProps()

      const nextLocation = nextProps.location
      const lastShouldShow = this.props.location.state === this.locationState
      const nextShouldShow = nextLocation.state === this.locationState

      if (lastShouldShow === nextShouldShow) return

      if (nextLocation.state !== this.locationState) {
        this.__pageStatus = PAGESTATUS.HIDDEN
        this.forceUpdate()
        this.componentDidHide && this.componentDidHide()
      } else {
        this.__pageStatus = PAGESTATUS.SHOWING
        this.forceUpdate()
        this.componentDidShow && this.componentDidShow()
      }
    }

    componentDidMount () {
      super.componentDidMount && super.componentDidMount()
      this.defaultShow = true
      super.componentDidShow && super.componentDidShow()
    }

    componentWillUnmount () {
      super.componentDidHide && super.componentDidHide()
      super.componentWillUnmount && super.componentWillUnmount()
    }

    render () {
      return (
        <div className='taro_page' dataPageid={this.pageId}>
          {this.__pageStatus === PAGESTATUS.SHOWING && super.render()}
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
  constructor (props, context) {
    super(props, context)
    this.state = {
      cached: []
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
    const { fail, complete, success, delta } = payload
    let pathname
    if (action === 'BACK') {
      if (this.state.cached.length <= delta) pathname = location.url
      else return this.commit('BACK', null, { delta })
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
    const { delta } = payload
    switch (action) {
      case 'PUSH':
        this.setState(state => {
          const cached = this.state.cached
          cached.push(el)
          return { cached }
        })
        break
      case 'REPLACE':
        this.setState(state => {
          const cached = this.state.cached
          cached.pop()
          cached.push(el)
          return { cached }
        })
        break
      case 'BACK':
        if (el) {
          this.setState((state) => {
            const cached = [ el ]
            return { cached }
          })
        } else {
          this.setState((state) => {
            const cached = state.cached
            cached.splice(-delta)
            return { cached }
          })
        }
        break
      default:
        console.warn('wrong action')
    }
  }

  getPage () {
    const location = history.now()

    return this.state.cached.map((Page) => {
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
    return <div className='taro_router'>{this.getPage()}</div>
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

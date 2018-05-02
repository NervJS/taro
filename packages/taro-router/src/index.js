import Nerv from 'nervjs'
import history from './lib/history'
import resolvePathname from './lib/resolvePathname'

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
    constructor () {
      super(...arguments)
      this.$router = location
      const pageId = location.pageId
      this.$router.unlisten = history.listen((nextLocation, action, payload) => {
        if (nextLocation.pageId === pageId) {
          this.componentDidShow && this.componentDidShow()
        } else {
          action !== 'BACK' && this.props.__shouldShowPage && this.componentDidHide && this.componentDidHide()
        }
      })
    }

    componentDidMount () {
      super.componentDidMount && super.componentDidMount()
      super.componentDidShow && super.componentDidShow()
    }

    componentWillUnmount () {
      this.$router.unlisten()
      super.componentDidHide && super.componentDidHide()
      super.componentWillUnmount && super.componentWillUnmount()
    }

    render () {
      return this.props.__shouldShowPage && super.render()
    }
  }

  return Wrapped
}

const navigateTo = function (opts) {
  const url = opts.url
  const success = opts.success
  const fail = opts.fail
  const complete = opts.complete

  const current = history.stack[history.stack.length - 1]
  const currentUrl = current.pathname
  history.push({
    url: resolvePathname(url, currentUrl),
    success,
    fail,
    complete
  })
}

const navigateBack = function (opts) {
  history.goBack(opts.delta)
}

const redirectTo = function (opts) {
  const success = opts.success
  const fail = opts.fail
  const complete = opts.complete

  history.replace({
    url: opts.url,
    success,
    fail,
    complete
  })
}

const getCurrentPages = function (opts) {
  return history.stack[0]
}

class Router extends Nerv.Component {
  constructor () {
    super(...arguments)

    this.state = {
      cached: []
    }
  }

  componentDidMount () {
    this.unlisten = history.listen((location, action, payload) => {
      this.navigate(location, action, payload)
    })
    this.navigate(history.stack[0], 'PUSH')
  }

  componentWillUnmount () {
    this.unlisten()
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
        this.setState(prevState => {
          prevState.cached.push(el)
          return { cached: prevState.cached }
        })
        break
      case 'REPLACE':
        this.setState(prevState => {
          prevState.cached.pop()
          prevState.cached.push(el)
          return { cached: prevState.cached }
        })
        break
      case 'BACK':
        if (!payload || !payload.n) return Promise.reject(new Error('wrong arguments'))

        this.setState(prevState => {
          const { cached } = prevState
          const { n } = payload
          cached.splice(cached.length - n, n)
          return { cached }
        })
        break
      default:
        console.warn('wrong action')
    }
  }

  getPages () {
    return this.state.cached.map((Page, index) => {
      const show = index === this.state.cached.length - 1
      return <Page __shouldShowPage={show} />
    })
  }

  render () {
    return <div>{this.getPages()}</div>
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

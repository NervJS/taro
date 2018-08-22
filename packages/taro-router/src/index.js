import Nerv from 'nervjs'
import history from './lib/history'
import {
  navigateTo,
  navigateBack,
  redirectTo
} from './lib/apis'
import { Component } from '@tarojs/taro-h5'
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

const getWrappedComponent = (component) => {
  class Wrapped extends component {
    __pageStatus = PAGESTATUS.SHOWING

    constructor (props, context) {
      super(props, context)
      this.locationState = props._$router.state
    }

    componentWillReceiveProps (nextProps) {
      super.componentWillReceiveProps && super.componentWillReceiveProps(nextProps)

      const nextLocation = nextProps._$router
      const lastShouldShow = this.props._$router.state === this.locationState
      const nextShouldShow = nextLocation.state === this.locationState

      if (lastShouldShow === nextShouldShow) return
      this.$router = nextLocation

      if (nextShouldShow) {
        this.__pageStatus = PAGESTATUS.SHOWING
        this.forceUpdate()
        this.componentDidShow && this.componentDidShow()
      } else {
        this.__pageStatus = PAGESTATUS.HIDDEN
        this.forceUpdate()
        this.componentDidHide && this.componentDidHide()
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
      const containerStyle = this.__pageStatus === PAGESTATUS.SHOWING ? {
        display: 'block'
      } : {
        display: 'none'
      }
      return (
        <div className='taro_page' dataState={this.locationState}
          style={containerStyle}>
          {super.render()}
        </div>
      )
    }
  }
  return Wrapped
}

/**
 * Router组件内保存了每次路由变化后渲染的组件
 */
class Router extends Component {
  /* 页面栈 */
  static pageStack = []
  static pageInstStack = []
  /**
   * 根据提供的location跳转
   *
   * @param {location} location 待跳转的location
   * @param {string} action 跳转的种类
   * @param {any} payload 附加参数
   */

  navigate = (location, action, payload = {}) => {
    const { fail, complete, success, delta } = payload
    let pathname
    if (action === 'BACK') {
      if (this.constructor.pageStack.length <= delta) pathname = location.url
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
        const comp = getWrappedComponent(loaded.default)
        // this.commit(action, Nerv.createElement(comp, {
        //   _$router: location
        // }), payload)
        this.commit(action, comp, payload)
        success && success()
      }).catch(e => {
        console.error(e)
        fail && fail()
      }).then(() => {
        complete && complete()
      })
  }

  commit (action, el, payload) {
    const { delta } = payload
    switch (action) {
      case 'PUSH':
        this.constructor.pageStack.push(el)
        this.forceUpdate()
        break
      case 'REPLACE':
        const pageStack = this.constructor.pageStack
        pageStack.pop()
        pageStack.push(el)
        this.forceUpdate()
        break
      case 'BACK':
        if (el) {
          this.constructor.pageStack = [ el ]
          this.forceUpdate()
        } else {
          const pageStack = this.constructor.pageStack
          pageStack.splice(-delta)
          this.forceUpdate()
        }
        break
      default:
        console.warn('wrong action')
    }
  }

  getPages () {
    const $router = history.now()
    this.constructor.pageInstStack = this.constructor.pageStack.map(Comp => {
      return <Comp _$router={$router} />
    })
    return this.constructor.pageInstStack
  }

  componentDidMount () {
    history.listen(this.navigate)
    this.navigate(history.now(), 'PUSH')
  }

  componentWillUnmount () {
    history.unlisten(this.navigate)
  }

  render () {
    return <div className='taro_router'>{this.getPages()}</div>
  }
}

const getCurrentPages = function (opts) {
  return Router.pageStack
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

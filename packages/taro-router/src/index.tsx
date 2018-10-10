import Nerv from 'nervjs'
import history from './lib/history'
import {
  navigateTo,
  navigateBack,
  redirectTo
} from './lib/apis'
import Taro, { Component } from '@tarojs/taro-h5'
import './router.css'
import { VNode } from 'nerv-shared';

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
      this.$router = props._$router
    }

    componentWillReceiveProps (nextProps) {
      const nextLocation = nextProps._$router
      const lastShouldShow = this.props._$router.state === this.locationState
      const nextShouldShow = nextLocation.state === this.locationState

      this.$router = nextLocation
      super.componentWillReceiveProps && super.componentWillReceiveProps(nextProps)

      if (lastShouldShow === nextShouldShow) return
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
        <div
          className='taro_page'
          dataState={this.locationState}
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

interface RouterPayload {
  complete: Function;
  fail: Function;
  success: Function;
  delta: number;
}

/* 页面栈 */
let pageStack: Component[] = []
let pageInstStack: VNode[] = []

type route = [string, Function]

interface Props {
  routes: route[]
}

class Router extends Component<Props> {
  hasPage = (pathname) => {
    const isNormalPage = this.props.routes.some(([routePathname]) => {
      return pathname === routePathname
    })
    const isIndex = /^\/(index(\.html)?)?[^/]*$/.test(pathname)
    if (isNormalPage || isIndex) return true
    return false
  }

  getPage = (pathname) => {
    const res = this.props.routes.find(([routePathname]) => {
      if (pathname === routePathname) return true
      else return false
    })
    return res ? res[1] : this.props.routes[0][1]
  }

  /**
   * 根据提供的location跳转
   *
   * @param {location} location 待跳转的location
   * @param {string} action 跳转的种类
   * @param {any} payload 附加参数
   */
  navigate = (location, action, payload = {} as RouterPayload) => {
    const { fail, complete, success, delta } = payload
    let pathname
    if (action === 'BACK') {
      if (pageStack.length <= delta) pathname = location.url
      else return this.commit('BACK', null, { delta })
    } else if (action === 'PUSH' || action === 'REPLACE') {
      pathname = location.url
    }
    
    /* loadPage */
    if (!this.hasPage(pathname)) {
      fail && fail()
      complete && complete()
      return console.warn('page not found')
    }
    
    const pageComp = this.getPage(pathname)

    if (pageComp) {
      const comp = getWrappedComponent(pageComp)
      this.commit(action, comp, payload)
      success && success()
    } else {
      complete && complete()
      fail && fail()
    }
  }

  commit (action, el, payload) {
    const { delta } = payload
    switch (action) {
      case 'PUSH':
        pageStack.push(el)
        this.forceUpdate()
        break
      case 'REPLACE':
        pageStack.pop()
        pageStack.push(el)
        this.forceUpdate()
        break
      case 'BACK':
        if (el) {
          pageStack = [ el ]
        } else {
          pageStack.splice(-delta)
        }
        this.forceUpdate()
        break
      default:
        console.warn('wrong action')
    }
  }

  getPages () {
    const $router = history.now()
    pageInstStack = pageStack.map(Comp => {
      return Nerv.createElement(Comp, {
        _$router: $router
      })
    })
    return pageInstStack
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

const getCurrentPages = function () {
  return pageStack
}

Taro.navigateTo = navigateTo
Taro.navigateBack = navigateBack
Taro.redirectTo = redirectTo
Taro.getCurrentPages = getCurrentPages

export default {
  Router
}

export {
  Router
}

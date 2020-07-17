import Taro from '@tarojs/taro-h5'
import Nerv, { nextTick } from 'nervjs'
import toPairs from 'lodash/toPairs'

import { tryToCall } from '../utils'
import { Location, RouteObj } from '../utils/types'
import createWrappedComponent from './createWrappedComponent'

import * as Types from '../utils/types'

type RouteProps = RouteObj & {
  currentLocation: Location;
  k: number;
  collectComponent: Function;
  customRoutes: Types.CustomRoutes;
}

const getScroller = () => {
  const panel = document.querySelector('.taro-tabbar__panel')
  let res: {
    set: (number) => void;
    get: () => number;
  }
  if (panel) {
    res = {
      set: pos => { panel.scrollTop = pos },
      get: () => panel.scrollTop
    }
  } else {
    res = {
      set: pos => window.scrollTo(0, pos),
      get: () => window.pageYOffset
    }
  }
  return res
}
let scroller

type OriginalRoute = string;
type MappedRoute = string;

class Route extends Taro.Component<RouteProps, {}> {
  matched = false;
  wrappedComponent;
  componentRef;
  containerRef;
  isRoute = true;
  scrollPos = 0;
  customRoutes: [OriginalRoute, MappedRoute][] = [];

  state = {
    location: {}
  }

  constructor (props, context) {
    super(props, context)
    this.customRoutes = toPairs(this.props.customRoutes)
    this.matched = this.computeMatch(this.props.currentLocation)
    if (this.matched) {
      this.state = { location: this.props.currentLocation }
    }
  }

  computeMatch (currentLocation: Location, isIndex = this.props.isIndex, isTabBar = this.props.isTabBar) {
    let pathname = currentLocation.path;
    const key = currentLocation.state.key;

    const foundRoute = this.customRoutes.filter(([originalRoute, mappedRoute]) => {
      return currentLocation.path === mappedRoute
    })
    if (foundRoute.length) {
      pathname = foundRoute[0][0]
    }

    if (key !== undefined) {
      if (isTabBar) {
        return key === this.props.key && pathname === this.props.path
      } else {
        return key === this.props.key
      }
    } else {
      return isIndex && pathname === '/'
    }
  }

  getWrapRef = ref => {
    if (ref) this.containerRef = ref
  }

  getRef = ref => {
    if (ref) {
      if (ref.props.location !== this.state.location) {
        ref.props.location = this.state.location
      }
      this.componentRef = ref
      this.props.collectComponent(ref, this.props.key)
    }
  }

  updateComponent (props = this.props) {
    if (this.matched && this.componentRef) {
      this.setState({
        location: props.currentLocation
      }, () => {
        this.componentRef.props.location = this.state.location
      })
    }
    props.componentLoader()
      .then(({ default: component }) => {
        if (!component) {
          throw Error(`Received a falsy component for route "${props.path}". Forget to export it?`)
        }
        const WrappedComponent = createWrappedComponent(component)
        this.wrappedComponent = WrappedComponent
        this.forceUpdate()
      }).catch((e) => {
        console.error(e)
      })
  }

  componentDidMount () {
    scroller = scroller || getScroller()
    scroller.set(0)
    this.updateComponent()
  }

  componentWillReceiveProps (nProps: RouteProps) {
    const isRedirect = nProps.isRedirect
    const lastMatched = this.matched
    const nextMatched = this.computeMatch(nProps.currentLocation, nProps.isIndex, nProps.isTabBar)

    this.matched = nextMatched

    if (isRedirect) {
      this.updateComponent(nProps)
    } else if (lastMatched === nextMatched) {
      return
    }

    if (nextMatched) {
      nextTick(() => {
        this.showPage()
        scroller = scroller || getScroller()
        scroller.set(this.scrollPos)
      })
      tryToCall(this.componentRef.componentDidShow, this.componentRef)
    } else {
      scroller = scroller || getScroller()
      this.scrollPos = scroller.get()
      nextTick(() => {
        this.hidePage()
        tryToCall(this.componentRef.componentDidHide, this.componentRef)
      })
    }
  }

  shouldComponentUpdate () {
    /* 防止route的props变化导致组件重新渲染 */
    return false
  }

  showPage () {
    const dom = this.containerRef
    if (!dom) {
      return console.error(`showPage:fail Received a falsy component for route "${this.props.path}". Forget to export it?`)
    }
    dom.style.display = 'block'
  }

  hidePage () {
    const dom = this.containerRef
    if (!dom) {
      return console.error(`hidePage:fail Received a falsy component for route "${this.props.path}". Forget to export it?`)
    }
    dom.style.display = 'none'
  }

  render () {
    if (!this.wrappedComponent) return null

    const WrappedComponent = this.wrappedComponent

    return (
      <div
        className="taro_page"
        ref={this.getWrapRef}
        style={{ minHeight: '100%' }}>
        <WrappedComponent ref={this.getRef} location={this.state.location} />
      </div>
    )
  }
}

export default Route

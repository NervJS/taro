import Taro from '@tarojs/taro-h5'
import Nerv, { nextTick } from 'nervjs'

import { tryToCall } from '../utils'
import { Location, RouteObj } from '../utils/types'
import createWrappedComponent from './createWrappedComponent'

type RouteProps = RouteObj & {
  currentLocation: Location;
  k: number;
  collectComponent: Function;
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

class Route extends Taro.Component<RouteProps, {}> {
  matched = false;
  wrappedComponent;
  componentRef;
  containerRef;
  isRoute = true;
  scrollPos = 0;

  state = {
    location: {}
  }

  constructor (props, context) {
    super(props, context)
    this.matched = this.computeMatch(this.props.currentLocation)
    if (this.matched) {
      this.state = { location: this.props.currentLocation }
    }
  }

  computeMatch (currentLocation: Location) {
    const path = currentLocation.path;
    const key = currentLocation.state.key;
    const isIndex = this.props.isIndex;
    const isTabBar = this.props.isTabBar;

    if (key !== undefined) {
      if (isTabBar) {
        return key === this.props.key && path === this.props.path
      } else {
        return key === this.props.key
      }
    } else {
      return isIndex && path === '/'
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
    const nextMatched = this.computeMatch(nProps.currentLocation)

    if (isRedirect) {
      this.updateComponent(nProps)
    } else if (lastMatched === nextMatched) {
      return
    }

    this.matched = nextMatched

    if (nextMatched) {
      if (!isRedirect) {
        nextTick(() => {
          this.showPage()
          scroller = scroller || getScroller()
          scroller.set(this.scrollPos)
        })
        tryToCall(this.componentRef.componentDidShow, this.componentRef)
      }
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

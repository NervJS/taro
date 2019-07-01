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

  constructor (props, context) {
    super(props, context)
    this.matched = this.computeMatch(this.props.currentLocation)
  }

  computeMatch (currentLocation) {
    const path = currentLocation.path;
    const key = currentLocation.state.key;
    const isIndex = this.props.isIndex;
    if (key !== undefined) {
      return key === this.props.key
    } else {
      return isIndex && path === '/'
    }
  }

  getWrapRef = ref => {
    if (ref) this.containerRef = ref
  }

  getRef = ref => {
    if (ref) this.componentRef = ref
    this.props.collectComponent(ref, this.props.k)
  }

  updateComponent (props = this.props) {
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

  componentWillReceiveProps (nProps, nContext) {
    const lastMatched = this.matched
    const nextMatched = this.computeMatch(nProps.currentLocation)
    const isRedirect = nProps.isRedirect

    if (isRedirect) {
      this.updateComponent(nProps)
    } else if (lastMatched === nextMatched) {
      return
    }

    this.matched = nextMatched

    nextTick(() => {
      if (nextMatched) {
        this.showPage()
        if (!isRedirect) {
          scroller = scroller || getScroller()
          scroller.set(this.scrollPos)
          tryToCall(this.componentRef.componentDidShow, this.componentRef)
        }
      } else {
        scroller = scroller || getScroller()
        this.scrollPos = scroller.get()
        this.hidePage()
        tryToCall(this.componentRef.componentDidHide, this.componentRef)
      }
    })
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
        style={"min-height: 100%"}>
        <WrappedComponent ref={this.getRef} />
      </div>
    )
  }
}

export default Route

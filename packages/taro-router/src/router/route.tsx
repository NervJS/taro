import { Component } from '@tarojs/taro-h5';
import Nerv from 'nervjs';

import createWrappedComponent from './createWrappedComponent';
import { ComponentLoader, Location } from '../utils/types';
import { tryToCall } from '../utils/index';

interface RouteProps {
  path: string;
  componentLoader: ComponentLoader;
  currentLocation: Location;
  isIndex: boolean;
  key?: string;
  k: number;
  collectComponent: Function;
}

class Route extends Component<RouteProps, {}> {
  matched = false;
  wrappedComponent;
  componentRef;
  containerRef;
  isRoute = true;

  constructor (props, context) {
    super(props, context)
    this.matched = this.computeMatch(this.props.currentLocation)
  }

  computeMatch (currentLocation) {
    const pathname = currentLocation.pathname;
    const key = currentLocation.state.key;
    const isIndex = this.props.isIndex;
    if (isIndex && pathname === '/') return true
    return key === this.props.key
  }

  getWrapRef = (ref) => {
    this.containerRef = ref
  }

  getRef = (ref) => {
    this.componentRef = ref
    this.props.collectComponent(ref, this.props.k)
  }

  updateComponent () {
    this.props.componentLoader()
      .then(({ default: component }) => {
        let WrappedComponent = createWrappedComponent(component)
        this.wrappedComponent = WrappedComponent
        this.forceUpdate()
      })
  }

  componentWillMount () {
    this.updateComponent()
  }

  componentWillReceiveProps (nProps, nContext) {
    if (this.props.path !== nProps.path) this.updateComponent()

    const lastMatched = this.matched
    const nextMatched = this.computeMatch(nProps.currentLocation)

    if (lastMatched === nextMatched) return 

    this.matched = nextMatched

    if (nextMatched) {
      this.showPage()
      tryToCall(this.componentRef.componentDidShow, this.componentRef)
    } else {
      this.hidePage()
      tryToCall(this.componentRef.componentDidHide, this.componentRef)
    }
  }

  shouldComponentUpdate () {
    /* 防止route的props变化导致组件重新渲染 */
    return false
  }

  showPage () {
    const dom = this.containerRef
    dom.style.display = 'block'
  }

  hidePage () {
    const dom = this.containerRef
    dom.style.display = 'none'
  }

  render () {
    if (!this.wrappedComponent) return null

    const WrappedComponent = this.wrappedComponent
    return (
      <div className="taro_page" ref={this.getWrapRef}>
        <WrappedComponent ref={this.getRef} />
      </div>
    )
  }
}

export default Route

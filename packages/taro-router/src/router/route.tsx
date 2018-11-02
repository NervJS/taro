import { Component } from '@tarojs/taro-h5';
import Nerv, { PropTypes } from 'nervjs';

import createWrappedComponent from './createWrappedComponent';
import * as Types from '../utils/types';
import createLoadableComponent from './loadable';

interface RouteProps {
  path: string;
  component: Types.PageComponent;
  isIndex: boolean;
  key: string;
}

interface RouteState {
  match: boolean;
}

class Route extends Component<RouteProps, RouteState> {
  wrappedComponent;

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static childContextTypes = {
    router: PropTypes.object,
    store: PropTypes.object
  }

  state = {
    match: this.computeMatch(this.context.router)
  };

  getChildContext () {
    return {
      ...this.context
    }
  }

  computeMatch (router) {
    const pathname = router.location.pathname;
    const key = router.location.state.key;
    const isIndex = this.props.isIndex;
    if (isIndex && pathname === '/') return true
    return key === this.props.key
  }

  componentWillMount () {
    const LoadableComponent = createLoadableComponent({
      loader: this.props.component,
      loading: <div />
    })
    this.wrappedComponent = createWrappedComponent(LoadableComponent)
  }

  componentWillReceiveProps (nProps, nContext) {
    this.setState({
      match: this.computeMatch(nContext.router)
    });
  }

  render () {
    if (!this.wrappedComponent) return null

    const { match } = this.state;
    const { router } = this.context;
    const WrappedComponent = this.wrappedComponent
    return (
      <WrappedComponent {...{
        router: {
          matched: match,
          location: router.location
        }
      }} />
    )
  }
}

export default Route

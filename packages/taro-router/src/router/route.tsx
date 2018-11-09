import { Component } from '@tarojs/taro-h5';
import Nerv, { PropTypes } from 'nervjs';

import createWrappedComponent from './createWrappedComponent';
import { ComponentLoader } from '../utils/types';

interface RouteProps {
  path: string;
  componentLoader: ComponentLoader;
  isIndex: boolean;
  key?: string;
}

interface RouteState {
  matched: boolean;
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
    matched: this.computeMatch(this.context.router)
  };

  getChildContext () {
    return {
      router: {
        ...this.context.router,
        matched: this.state.matched
      }
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
    this.props.componentLoader()
      .then(({ default: component }) => {
        let WrappedComponent = createWrappedComponent(component)
        this.wrappedComponent = WrappedComponent
        this.setState({})
      })
    /**
     * <Router>
     *   <Route>
     *     <Loadable>
     *       <WrappedComponent>
     *         <Component />
     *       </WrappedComponent>
     *     </Loadable>
     *   </Route>
     * </Router>
    */
    // this.wrappedComponent = loadableComponent
  }

  componentWillReceiveProps (nProps, nContext) {
    this.setState({
      matched: this.computeMatch(nContext.router)
    });
  }

  render () {
    if (!this.wrappedComponent) return null
    const router = this.context.router
    const matched = this.state.matched

    const WrappedComponent = this.wrappedComponent
    return (
      <WrappedComponent {...{
        __router: {
          matched,
          location: router.location
        }
      }}/>
    )
  }
}

export default Route

import Taro, { Component } from '@tarojs/taro-h5';
import Nerv, { PropTypes } from 'nervjs';

import { createNavigateBack, createNavigateTo, createRedirectTo } from '../apis';
import Route from './route';
import * as Types from '../utils/types';

interface Props {
  history: Types.History;
  routes: Types.RouteObj[];
  children?: any[];
}

interface State {
  location: Types.Location;
  routeStack: Types.RouteObj[];
}

class Router extends Component<Props, State> {
  static childContextTypes = {
    router: PropTypes.object.isRequired
  }

  unlisten: () => void;
  lastLocation: Types.Location;
  currentPages: any[] = [];

  state = {
    location: this.props.history.location,
    routeStack: [] as Types.RouteObj[]
  };

  getChildContext () {
    return {
      router: {
        location: this.state.location
      }
    }
  }

  mountApis () {
    // 挂载Apis
    Taro.navigateTo = createNavigateTo(this.props.history)
    Taro.navigateBack = createNavigateBack(this.props.history)
    Taro.redirectTo = createRedirectTo(this.props.history)
    Taro.getCurrentPages = () => {
      return this.currentPages
    }
  }

  computeMatch (location: Types.Location): Types.RouteObj {
    // 找出匹配的路由组件
    const pathname = location.pathname;
    const matchedRoute = this.props.routes.find(({path, isIndex}) => {
      if (isIndex && pathname === '/') return true;
      return pathname === path;
    })

    return matchedRoute || {
      path: pathname,
      componentLoader: () => import('./page404'),
      isIndex: pathname === '/',
      key: location.state.key
    }
  }

  push (toLocation: Types.Location) {
    const routeStack: Types.RouteObj[] = [...this.state.routeStack]
    const matchedRoute = this.computeMatch(toLocation)
    routeStack.push(Object.assign({}, matchedRoute, {
      key: toLocation.state.key
    }))
    this.setState({ routeStack, location: toLocation })
  }

  pop (toLocation: Types.Location, fromLocation: Types.Location) {
    let routeStack: Types.RouteObj[] = [...this.state.routeStack]
    const fromKey = Number(fromLocation.state.key)
    const toKey = Number(toLocation.state.key)
    const delta = toKey - fromKey

    routeStack.splice(delta)

    if (routeStack.length === 0) {
      // 不存在历史栈, 需要重新构造
      const matchedRoute = this.computeMatch(toLocation)
      routeStack = [Object.assign({}, matchedRoute, {
        key: toLocation.state.key
      })]
    }

    this.setState({ routeStack, location: toLocation })
  }

  replace (toLocation: Types.Location) {
    const routeStack: Types.RouteObj[] = [...this.state.routeStack]
    const matchedRoute = this.computeMatch(toLocation)
    routeStack.splice(-1, 1, Object.assign({}, matchedRoute, {
      key: toLocation.state.key
    }))
    this.setState({ routeStack, location: toLocation })
  }

  collectComponent = (comp, k) => {
    this.currentPages[k] = comp
  }

  componentWillMount () {
    const { history } = this.props

    this.mountApis()

    this.unlisten = history.listen(({
      fromLocation,
      toLocation,
      action
    }) => {
      if (action === "PUSH") {
        this.push(toLocation);
      } else if (action === "POP") {
        this.pop(toLocation, fromLocation);
      } else {
        this.replace(toLocation);
      }

      this.lastLocation = history.location
      this.setState({
        location: history.location
      })
    })
    this.lastLocation = history.location
    this.push(this.lastLocation)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  render () {
    const router = this
    router.currentPages.length = this.state.routeStack.length
    return (
      <div className="taro_router">
        {this.state.routeStack.map(({ path, componentLoader, isIndex, key }, k) => {
          return (
            <Route
              path={path}
              componentLoader={componentLoader}
              isIndex={isIndex}
              key={key}
              k={k}
              collectComponent={this.collectComponent}
            />
          )
        })}
      </div>
    )
  }
}


export default Router

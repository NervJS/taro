import Taro from '@tarojs/taro-h5'
import invariant from 'invariant'
import assign from 'lodash/assign'
import toPairs from 'lodash/toPairs'
import Nerv from 'nervjs'

import * as Types from '../utils/types'
import Route from './route'

interface Props {
  history: Types.History;
  routes: Types.RouteObj[];
  children?: any[];
  customRoutes: Types.CustomRoutes;
}

interface State {
  location: Types.Location;
  routeStack: Types.RouteObj[];
}

type OriginalRoute = string;
type MappedRoute = string;

class Router extends Taro.Component<Props, State> {
  unlisten: () => void;
  lastLocation: Types.Location;
  currentPages: any[] = [];
  customRoutes: [OriginalRoute, MappedRoute][] = [];

  state = {
    location: this.props.history.location,
    routeStack: [] as Types.RouteObj[]
  };

  mountApis () {
    // 挂载Apis
    Taro.getCurrentPages = () => {
      return this.currentPages
    }
  }

  computeMatch (location: Types.Location): Types.RouteObj {
    // 找出匹配的路由组件
    const originalPathname = location.path;
    let pathname = originalPathname
    const foundRoute = this.customRoutes.filter(([originalRoute, mappedRoute]) => {
      return originalPathname === mappedRoute
    })
    if (foundRoute.length) {
      pathname = foundRoute[0][0]
    }
    const matchedRoute = this.props.routes.filter(({path, isIndex}) => {
      if (isIndex && pathname === '/') return true;
      return pathname === path;
    })

    invariant(matchedRoute[0], `Can not find proper registered route for '${pathname}'`)

    return matchedRoute[0]!
  }

  push (toLocation: Types.Location) {
    const routeStack: Types.RouteObj[] = [...this.state.routeStack]
    const matchedRoute = this.computeMatch(toLocation)
    routeStack.forEach(v => { v.isRedirect = false })
    routeStack.push(assign({}, matchedRoute, {
      key: toLocation.state.key,
      isRedirect: false
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
      routeStack = [assign({}, matchedRoute, {
        key: toLocation.state.key,
        isRedirect: false
      })]
    }

    this.setState({ routeStack, location: toLocation })
  }

  replace (toLocation: Types.Location) {
    const routeStack: Types.RouteObj[] = [...this.state.routeStack]
    const matchedRoute = this.computeMatch(toLocation)
    routeStack.splice(-1, 1, assign({}, matchedRoute, {
      key: toLocation.state.key,
      isRedirect: true
    }))
    this.setState({ routeStack, location: toLocation })
  }

  collectComponent = (comp, k) => {
    if(this.currentPages[k]){
      this.currentPages[k] = comp;
    }
    else{
      this.currentPages.push(comp);
    }
  }

  componentDidMount () {
    const { history, customRoutes } = this.props

    this.mountApis()
    this.customRoutes = toPairs(customRoutes)

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
    const currentLocation = Taro._$router
    return (
      <div
        className="taro_router"
        style={"min-height: 100%"}>
        {this.state.routeStack.map(({ path, componentLoader, isIndex, key, isRedirect }, k) => {
          return (
            <Route
              path={path}
              currentLocation={currentLocation}
              componentLoader={componentLoader}
              isIndex={isIndex}
              key={key}
              k={k}
              isRedirect={isRedirect}
              collectComponent={this.collectComponent}
            />
          )
        })}
      </div>
    )
  }
}

export default Router

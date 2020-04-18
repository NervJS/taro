import Taro from '@tarojs/taro-h5'
import invariant from 'invariant'
import assign from 'lodash/assign'
import toPairs from 'lodash/toPairs'
import Nerv from 'nervjs'

import * as Types from '../utils/types'
import Route from './route'

interface Props {
  history: Types.History;
  mode: 'multi' | 'hash' | 'browser';
  routes: Types.RouteObj[];
  tabBar?: Types.ITabBar;
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

    if (this.props.mode === 'multi') {
      return this.props.routes[0]
    } else {
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
      if (!matchedRoute[0] && Taro['_$app'] && Taro['_$app'].componentDidNotFound) {
        Taro['_$app'].componentDidNotFound.call(Taro['_$app'], {
          path: pathname,
          query: location.params
        })
      }

      invariant(matchedRoute[0], `Can not find proper registered route for '${pathname}'`)
      return matchedRoute[0]!
    }
  }

  isTabBar (path: string) {
    const tabBar = this.props.tabBar
    if (path && tabBar && tabBar.list && tabBar.list instanceof Array) {
      return tabBar.list.findIndex(e => e.pagePath === path) !== -1
    }
    return false
  }

  push (toLocation: Types.Location, isTabBar = false) {
    const routeStack: Types.RouteObj[] = [...this.state.routeStack]
    const matchedRoute = this.computeMatch(toLocation)
    routeStack.forEach(v => { v.isRedirect = false })
    routeStack.push(assign({}, matchedRoute, {
      key: toLocation.state.key,
      isRedirect: false,
      isTabBar
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

  switch (toLocation: Types.Location, isTabBar = false) {
    const routeStack: Types.RouteObj[] = [...this.state.routeStack]
    const matchedRoute = this.computeMatch(toLocation)
    const index = routeStack.findIndex(e => e.path === toLocation.path)
    if (index === -1) {
      routeStack.forEach(v => { v.isRedirect = false })
      routeStack.push(assign({}, matchedRoute, {
        key: toLocation.state.key,
        isRedirect: false,
        isTabBar
      }))
    }
    this.setState({ routeStack, location: toLocation })
  }

  collectComponent = (comp, index: string) => {
    this.currentPages[Number(index) || 0] = comp
  }

  componentDidMount () {
    const { history, customRoutes, mode } = this.props

    this.mountApis()
    this.customRoutes = toPairs(customRoutes)

    this.unlisten = history.listen(({
      fromLocation,
      toLocation,
      action
    }) => {
      if (action === "POP") {
        this.pop(toLocation, fromLocation);
      } else if (this.isTabBar(toLocation.path)) {
        this.switch(toLocation, true);
      } else {
        if (action === "PUSH") {
          this.push(toLocation);
        } else {
          this.replace(toLocation);
        }
      }

      this.lastLocation = history.location
      this.setState({
        location: history.location
      })
    })
    this.lastLocation = history.location
    this.push(this.lastLocation, this.isTabBar(this.lastLocation.path))
    if (mode === 'multi') {
      this.unlisten()
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (Taro._$router) {
      this.currentPages.length = Number(Taro._$router.state.key) + 1
    }
  }

  componentDidShow () {
    if (Taro._$router) {
      this.currentPages.length = Number(Taro._$router.state.key) + 1
    }
  }

  componentWillUnmount () {
    const { mode } = this.props
    if (mode === 'multi') return
    this.unlisten()
  }

  render () {
    const currentLocation = Taro._$router
    return (
      <div
        className="taro_router"
        style={{ height: '100%' }}>
        {this.state.routeStack.map(({ path, componentLoader, isIndex, isTabBar, key, isRedirect }, k) => {
          return (
            <Route
              path={path}
              currentLocation={currentLocation}
              componentLoader={componentLoader}
              isIndex={isIndex}
              key={key}
              k={k}
              isTabBar={isTabBar}
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

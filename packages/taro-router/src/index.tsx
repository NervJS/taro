import { Component } from '@tarojs/taro-h5';
import createHistory from './history/createHistory';
import Nerv from 'nervjs';
import * as Types from './utils/types'
import BaseRouter from './router/router';

interface Props {
  mode: 'hash' | 'browser'
  basename: string;
  routes: Types.RouteObj[];
  customRoutes: Types.CustomRoutes;
  children: any[];
}

class Router extends Component<Props> {

  history: Types.History;

  componentWillMount () {
    const { mode, routes, customRoutes } = this.props
    const firstPagePath = routes[0].path
    this.history = createHistory({ mode, basename: this.props.basename, firstPagePath, customRoutes })
  }
  render () {
    return (
      <BaseRouter
        history={this.history}
        routes={this.props.routes}
        customRoutes={this.props.customRoutes}
      />
    )
  }
}

export { Router }

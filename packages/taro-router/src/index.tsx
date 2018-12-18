import { Component } from '@tarojs/taro-h5';
import createHistory from './history/createHistory';
import Nerv from 'nervjs';
import * as Types from './utils/types'
import BaseRouter from './router/router';

interface Props {
  mode: 'hash' | 'browser'
  publicPath: string;
  routes: Types.RouteObj[];
  children: any[];
}

class Router extends Component<Props> {

  history: Types.History;

  componentWillMount () {
    const { mode, routes } = this.props
    const firstPagePath = routes[0].path
    this.history = createHistory({ mode, basename: this.props.publicPath, firstPagePath })
  }
  render () {
    return (
      <BaseRouter
        history={this.history}
        routes={this.props.routes}
      />
    )
  }
}

export { Router }

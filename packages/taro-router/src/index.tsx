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
    const { mode } = this.props
    this.history = createHistory({ mode, basename: this.props.publicPath })
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

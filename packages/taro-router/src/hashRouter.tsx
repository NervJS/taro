import { Component } from '@tarojs/taro-h5';
import createHistory from './history/createHashHistory';
import Nerv from 'nervjs';
import * as Types from './utils/types'

import Router from './router/router';

interface Props {
  routes: Types.RouteObj[];
  children: any[];
}

class HashRouter extends Component<Props> {
  history = createHistory()

  render () {
    return (
      <Router
        history={this.history}
        routes={this.props.routes}
      />
    )
  }
}

export default HashRouter

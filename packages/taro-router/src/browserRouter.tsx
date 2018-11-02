import Nerv from 'nervjs';
import { Component } from '@tarojs/taro-h5';
import createHistory from './history/createBrowserHistory';

import Router from './router/router';
import * as Types from './utils/types';

interface Props {
  routes: Types.RouteObj[];
  children: any[];
}

class BrowserRouter extends Component<Props> {
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

export default BrowserRouter

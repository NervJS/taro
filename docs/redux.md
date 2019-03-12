---
title: 使用 Redux
---

在 Taro 中可以自由地使用 `React` 生态中非常流行的数据流管理工具 [Redux](http://redux.js.org/) 来解决复杂项目的数据管理问题。而为了更方便地使用 `Redux` ，Taro 提供了与 [react-redux](https://redux.js.org/basics/usage-with-react) API 几乎一致的包 `@tarojs/redux` 来让开发人员获得更加良好的开发体验。

> 下文中示例代码均在 [taro-redux-sample](https://github.com/NervJS/taro-redux-sample)

首先请安装 `redux` 、 `@tarojs/redux` 和 `@tarojs/redux-h5`，以及一些需要用到的 `redux` 中间件

```bash
$ yarn add redux @tarojs/redux @tarojs/redux-h5 redux-thunk redux-logger
# 或者使用 npm
$ npm install --save redux @tarojs/redux @tarojs/redux-h5 redux-thunk redux-logger
```

随后可以在项目 `src` 目录下新增一个 `store` 目录，在目录下增加 `index.js` 文件用来配置 `store`，按自己喜好设置 `redux` 的中间件，例如下面例子中使用 `redux-thunk` 和 `redux-logger` 这两个中间件

```jsx
// src/store/index.js
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'

const middlewares = [
  thunkMiddleware,
  createLogger()
]

export default function configStore () {
  const store = createStore(rootReducer, applyMiddleware(...middlewares))
  return store
}
```

接下来在项目入口文件 `app.js` 中使用 `@tarojs/redux` 中提供的 `Provider` 组件将前面写好的 `store` 接入应用中

```jsx
// src/app.js
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import configStore from './store'
import Index from './pages/index'

import './app.scss'

const store = configStore()

class App extends Component {
  config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      navigationBarTitleText: 'Test'
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

```

然后就可以开始使用了。如 `redux` 推荐的那样，可以增加

- `constants` 目录，用来放置所有的 `action type` 常量
- `actions` 目录，用来放置所有的 `actions`
- `reducers` 目录，用来放置所有的 `reducers`

例如我们要开发一个简单的加、减计数器功能

新增 `action type`

```jsx
// src/constants/counter.js
export const ADD = 'ADD'
export const MINUS = 'MINUS'
```

新增 `reducer` 处理

```jsx
// src/reducers/counter.js
import { ADD, MINUS } from '../constants/counter'

const INITIAL_STATE = {
  num: 0
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        num: state.num + 1
      }
    case MINUS:
      return {
        ...state,
        num: state.num - 1
      }
    default:
      return state
  }
}
```

```jsx
// src/reducers/index.js
import { combineReducers } from 'redux'
import counter from './counter'

export default combineReducers({
  counter
})

```

新增 `action` 处理

```jsx
// src/actions/counter.js
import {
  ADD,
  MINUS
} from '../constants/counter'

export const add = () => {
  return {
    type: ADD
  }
}
export const minus = () => {
  return {
    type: MINUS
  }
}

// 异步的 action
export function asyncAdd () {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}

```

最后，我们可以在页面（或者组件）中进行使用，我们将通过 `tarojs/redux` 提供的 `connect` 方法将 `redux` 与我们的页面进行连接

```jsx
// src/pages/index/index.js
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'

import { add, minus, asyncAdd } from '../../actions/counter'

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  render () {
    return (
      <View className='todo'>
        <Button className='add_btn' onClick={this.props.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.dec}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <View>{this.props.counter.num}</View>
      </View>
    )
  }
}

export default Index
```

`connect` 方法接受两个参数 `mapStateToProps` 与 `mapDispatchToProps`

- `mapStateToProps`，函数类型，接受最新的 `state` 作为参数，用于将 `state` 映射到组件的 `props`
- `mapDispatchToProps`，函数类型，接收 `dispatch()` 方法并返回期望注入到展示组件的 `props` 中的回调方法

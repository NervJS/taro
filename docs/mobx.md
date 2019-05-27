---
title: 使用 MobX
---

> 自 `1.2.0-beta.1` 开始支持

[MobX](https://mobx.js.org/) 为复杂项目中状态管理提供了一种简单高效的机制；Taro 提供了 `@tarojs/mobx` 来让开发人员在使用 MobX 的过程中获得更加良好的开发体验。

> 下文中示例代码均在 [taro-mobx-sample](https://github.com/nanjingboy/taro-mobx-sample)

首先请安装 `mobx@4.8.0` 、 `@tarojs/mobx` 、 `@tarojs/mobx-h5` 和 `@tarojs/mobx-rn`

```bash
$ yarn add mobx@4.8.0 @tarojs/mobx @tarojs/mobx-h5 @tarojs/mobx-rn
# 或者使用 npm
$ npm install --save mobx@4.8.0 @tarojs/mobx @tarojs/mobx-h5 @tarojs/mobx-rn
```

随后可以在项目 `src` 目录下新增一个 `store/counter.js` 文件

```jsx
// src/store/counter.js
import { observable } from 'mobx'

const counterStore = observable({
  counter: 0,
  counterStore() {
    this.counter++
  },
  increment() {
    this.counter++
  },
  decrement() {
    this.counter--
  },
  incrementAsync() {
    setTimeout(() => {
      this.counter++
    }, 1000)
  }
})

export default counterStore
```

接下来在项目入口文件 `app.js` 中使用 `@tarojs/mobx` 中提供的 `Provider` 组件将前面写好的 `store` 接入应用中

```jsx
// src/app.js
import Taro, { Component } from '@tarojs/taro'
import { Provider, onError } from '@tarojs/mobx'
import Index from './pages/index'

import counterStore from './store/counter'

import './app.scss'

const store = {
  counterStore
}

onError(error => {
  console.log('mobx global error listener:', error)
})

class App extends Component {

  config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

```

然后，我们在页面中可通过 `@tarojs/mobx` 提供的 `inject` 以及 `observer` 方法将 `mobx` 与我们的页面进行关联

```jsx
// src/pages/index/index.js
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'

@inject('counterStore')
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () {
    console.log('componentWillMount')
  }

  /**
   * 该方法将在 observable 对象更新时触发
   */
  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () {
    console.log('componentDidMount')
  }

  componentWillUnmount () {
    console.log('componentWillUnmount')
  }

  componentDidShow () {
    console.log('componentDidShow')
  }

  componentDidHide () {
    console.log('componentDidHide')
  }

  increment = () => {
    const { counterStore } = this.props
    counterStore.increment()
  }

  decrement = () => {
    const { counterStore } = this.props
    counterStore.decrement()
  }

  incrementAsync = () => {
    const { counterStore } = this.props
    counterStore.incrementAsync()
  }

  render () {
    const { counterStore: { counter } } = this.props
    return (
      <View className='index'>
        <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text>
      </View>
    )
  }
}

export default Index

```

上例中 `Provider`、`inject`、 `observer`、`onError` 的使用方式基本上与 [mobx-react](https://github.com/mobxjs/mobx-react) 保持了一致，但也有以下几点需要注意：

* `Provider` 不支持嵌套，即全局只能存在一个 `Provider`
* 在 `mobx-react` 中，可通过以下方式设置 `store`：

  ```jsx
  <Provider store1={xxxx} store2={xxxx}>
    <XXX />
  </Provider>
  ```

  而在 `@tarojs/mobx` 中，我们需要使用以下方式设置：

  ```jsx
  const store = {
    store1: xxxx,
    store2: xxxx
  }
  <Provider store={store}>
    <XXX />
  </Provider>
  ```

* `inject`、 `observer` 不能在 stateless 组件上使用
* `observer` 不支持任何参数
* 按照以下方式使用 `inject` 时，不能省略 `observer` 的显式调用：

  ```jsx
  @inject((stores, props) => ({
    counterStore: stores.counterStore
  }))
  @observer //这个不能省略
  ```

注意事项：

* 在 `Component` 的 `render` 方法中，如果需要使用一个 `observable` 对象（该例中为 `counter`），您需要：

  ```js
  const { counterStore: { counter } } = this.props
  return (
    <Text>{counter}</Text>
  )
  ```

  而非：

  ```js
  const { counterStore } = this.props
  return (
    <Text>{counterStore.counter}</Text>
  )
  ```

* 如果使用 `@observable` 装饰器来定义可观察对象时，请确保该属性已经初始化（这是很多情况下属性值改变，页面没刷新的根源所在），比如：

  ```js
  @observable counter // 错误
  @observable counter = 0 // 正确
  ```

* 自 `1.2.0-beta.5` 后，`propTypes` 已从 `taro-mobx`、`taro-mobx-h5`、`taro-mobx-rn` 中剥离，如需使用，请单独进行安装：

  ```bash
  $ yarn add @tarojs/mobx-prop-types
  # 或者使用 npm
  $ npm install --save @tarojs/mobx-prop-types
  ```

  `propTypes` 使用与 [mobx-react](https://github.com/mobxjs/mobx-react#proptypes) 一致

  > 注：自 `1.2.27-beta.0` 后，`@tarojs/mobx-prop-types` 已被移除，请使用 [mobx-react](https://github.com/mobxjs/mobx-react#proptypes) 替代。

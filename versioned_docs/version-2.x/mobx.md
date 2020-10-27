---
title: 使用 MobX
---

> 自 `1.2.0-beta.1` 开始支持

[MobX](https://mobx.js.org/) 为复杂项目中状态管理提供了一种简单高效的机制；Taro 提供了 `@tarojs/mobx` 来让开发人员在使用 MobX 的过程中获得更加良好的开发体验。

## 安装

```bash
$ yarn add mobx@4.8.0 @tarojs/mobx @tarojs/mobx-h5 @tarojs/mobx-rn
# 或者使用 npm
$ npm install --save mobx@4.8.0 @tarojs/mobx @tarojs/mobx-h5 @tarojs/mobx-rn
```

## API

### onError

Mobx 异常监听。

```jsx
import { onError } from '@tarojs/mobx'

onError(error => {
  console.log('mobx global error listener:', error)
})
```

### isUsingStaticRendering

> 自 `1.3.6` 开始支持

判断是否开启了服务端渲染（该状态为全局状态）。

```jsx
import { isUsingStaticRendering } from '@tarojs/mobx'

if (isUsingStaticRendering()) {
  //...
}
```

### useStaticRendering

> 自 `1.3.6` 开始支持

服务端渲染状态设置（该状态为全局状态）。

```jsx
import { useStaticRendering } from '@tarojs/mobx'

useStaticRendering(false)
```

### useLocalStore

> 自 `1.3.6` 开始支持

将对象转换为 `observable` 对象，其中 `getter` 会被转换为 `computed` 属性，方法会与 `store` 进行绑定并自动执行
[mobx transactions](https://mobx.js.org/refguide/action.html)，比如：

```jsx
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { useLocalStore,  observer } from '@tarojs/mobx'

import './index.scss'

function Index() {
  const store = useLocalStore(() => ({
    counter: 0,
    increment() {
      store.counter++
    },
    decrement() {
      store.counter--
    },
    incrementAsync() {
      setTimeout(() => store.counter++, 1000)
    }
  }))

  const { counter, increment, decrement, incrementAsync } = store;
  return (
    <View>
      <Button onClick={increment}>+</Button>
      <Button onClick={decrement}>-</Button>
      <Button onClick={incrementAsync}>Add Async</Button>
      <Text>{counter}</Text>
    </View>
  )
}

export default observer(Index)
```

### useAsObservableSource

> 自 `1.3.6` 开始支持

与 `useLocalStore` 的区别是，它将纯（不包含 `getter` 或方法）对象转换为 `observable`，主要使用场景为：

* 如果对象某个属性的值需经过复杂运算才能获得，可通过该方法进行包装，这样在组件的生命周期中该运算只需要运算一次。
* 一般情况下 `useLocalStore` 仅用于组件内部，如果 `useLocalStore` 中的对象需要依赖外部传递的属性，那么可通过
  `useAsObservableSource` 将这些属性进行转换，而后在 `useLocalStore` 对象中进行引用，这样在外部属性改变时自动通知
  `useLocalStore` 对象对变化进行响应，比如：

  ```jsx
  import Taro from '@tarojs/taro'
  import { View, Button, Text } from '@tarojs/components'
  import { useAsObservableSource, useLocalStore, observer } from '@tarojs/mobx'

  function Multiplier(props) {
    const observableProps = useAsObservableSource(props)
    const store = useLocalStore(() => ({
      counter: 1,
      get multiplied() {
        return observableProps.multiplier * store.counter
      },
      increment() {
        store.counter += 1
      }
    }))
    const { multiplier } = observableProps
    const { multiplied, counter, increment } = store
    return (
      <View>
        <Text>multiplier({multiplier}) * counter({counter}) = {multiplied}</Text>
        <Button onClick={increment}>Increment Counter</Button>
      </View>
    )
  }

  export default observer(Multiplier)
  ```

  该场景也可直接使用 `useLocalStore` 中的第二种用法来实现：

  ```jsx
  import Taro from '@tarojs/taro'
  import { View, Button, Text } from '@tarojs/components'
  import { useLocalStore, observer } from '@tarojs/mobx'

  function Multiplier(props) {
    const store = useLocalStore(source => ({
      counter: 1,

      get multiplier() {
        return source.multiplier
      },

      get multiplied() {
        return source.multiplier * store.counter
      },
      increment() {
        store.counter += 1
      }
    }), props)
    const { multiplied, counter, increment, multiplier } = store
    return (
      <View>
        <Text>multiplier({multiplier}) * counter({counter}) = {multiplied}</Text>
        <Button onClick={increment}>Increment Counter</Button>
      </View>
    )
  }

  export default observer(Multiplier)
  ```

### observer

将组件设置为监听者，以便在可观察对象的值改变后触发页面的重新渲染。

注：

* 不要在 `JSX` 中对可观察对象进行引用，比如：

  ```jsx
  // 错误，在小程序中值改变后将无法触发重新渲染
  const { counterStore } = this.props
  return (
    <Text>{counterStore.counter}</Text>
  )

  // 正确
  const { counterStore: { counter } } = this.props
  return (
    <Text>{counter}</Text>
  )
  ```

  > 这是因为 `@tarojs/mobx` 通过监听组件的 `render`（小程序编译后为 `_createData`）方法来触发更新；在小程序中，`JSX`
  > 的代码会被编译到 `wxml` 文件中，此时对可观察对象的引用（比如：`counterStore.counter`）早已脱离了
  > `@tarojs/mobx` 的监控，故此对该属性的更改并不会触发更新操作。

* 如使用 `@observable` 装饰器来定义可观察对象时，请确保该属性已经初始化，比如：

  ```js
  @observable counter // 错误，值改变后将无法触发重新渲染
  @observable counter = 0 // 正确
  ```

* 如果 `isUsingStaticRendering` 为 `true`，该方法不做任何事情。

### Provider

全局 `store` 设置，比如：

```jsx
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import Index from './pages/index'
import counterStore from './store/counter'

const store = {
  counterStore
}

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

注：

* `Provider` 必须作用于入口文件（即：`src/app.js`），在其他地方使用无效。
* 不支持嵌套，即全局只能存在一个 `Provider`。
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


### inject

将 `Provider` 中设置的 `store` 提取到组件的 `props` 中，该 `API` 只适用于`类组件`，比如：

```jsx
import Taro, { Component } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'

@inject('counterStore')
@observer
class Index extends Component {
  //...
}

export default Index
```

或

```jsx
import Taro, { Component } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'

@inject((stores, props) => ({
  counterStore: stores.counterStore
}))
@observer
class Index extends Component {
  //...
}

export default Index
```

注：

* 无论以何种方式使用 `inject`，其后的 `observer` 均不能省略。
* 不要在 `inject` 中引用可观察对象，这将导致属性改变后页面不更新，比如：

  ```jsx
  // 错误
  @inject((stores, props) => ({
    counter: stores.counterStore.counter
  }))

  // 正确
  @inject((stores, props) => ({
    counterStore: stores.counterStore
  }))
  ```

### PropTypes

> 自 `1.3.6` 开始支持

`@tarojs/mobx` 提供了以下 `PropTypes` 来验证 Mobx 的结构：

* observableArray
* observableArrayOf
* observableMap
* observableObject
* arrayOrObservableArray
* arrayOrObservableArrayOf
* objectOrObservableObject

## 资源

示例：[taro-mobx-sample](https://github.com/nanjingboy/taro-mobx-sample)
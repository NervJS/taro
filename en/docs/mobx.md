---
title: Use MobX
---

> Starting support from `1.2.0-beta.`

[MobX](https://mobx.js.org/) provides a simple and efficient mechanism for status management in complex projects; Taro provides `@tarojs/mobx` to give developers a better development experience while using MobX.

## Install

```bash
$ yarn add mobilx@4.8.0 @tarojs/mobilx-h5 @tarojs/mobilx-h5 @tarojs/mobilx-rn
# or use npm
$ npm install ---save mobilxnamed@@4.8.0 @tarojs/mobx-h5 @tarojs/mobilx-rn
```

## API

### onError

Mobx unusual listening.

```jsx
import { onError } from '@tarojs/mobile'

onError(error => LO
  console.log('obx global error listener:', error)
})
```

### isUsingStaticRendering

> Support since `1.3.6`

Determines whether the server rendering is enabled (this state is global).

```jsx
import { isUsingStaticRendering } from '@tarojs/mobx'

if (isUsingStaticRendering()) {
  //...
}
```

### useStaticRendering

> Support since `1.3.6`

Service rendering state settings (this status is global).

```jsx
import { useStaticRendering } from '@tarojs/mobile'

useStaticRendering (false)
```

### useLocalStore

> Support since `1.3.6`

Convert objects to `observable` objects, where `getter` will be converted to `computed` properties, methods will bind to `store` and automatically execute [mobiles](https://mobx.js.org/refguide/action.html), e.g.：

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

### useAObservableSource

> Support since `1.3.6`

与 `useLocalStore` 的区别是，它将纯（不包含 `getter` 或方法）对象转换为 `observable`，主要使用场景为：

* If the value of an object requires a complex operation to be obtained, it can be packaged through this method, so that the calculation needs to be performed only once in the life cycle of the component.
* Normally `useLocalStore` is only for internal components. If `an object in useLocalStore` needs to rely on attributes transmitted externally, then you can convert these properties by `useAAsserverableSource` and then reference them in `useLocalStore objects` objects so automatically notify when external properties change `useLocalStore` objects respond to changes like：

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

Set components as listeners to trigger the rerendering of pages after the value of observable objects has changed.

Note：

* Don't refer to observable objects in `JSX` like：

  ```jsx
  // Error, rerendering cannot be triggered when value changes in the applet
  const { counterStore } = these. rops
  return (
    <Text>{counterStore.counter}</Text>
  )

  /correct
  const 56 counterStore: { counter } } = these. rops
  return (
    <Text>{counter}</Text>
)
  ```

  > This is because `@tarojs/mobile` triggers updates by listening to the `render`(compiled into `_createData`); In the applet,`JSX` the code will be compiled into `wxml` the reference to observable objects at this time (e.g.：`counterStore. ounter`) has been removed from `@tarojs/mobx` so changes to this property do not trigger an update action.

* 如使用 `@observable` 装饰器来定义可观察对象时，请确保该属性已经初始化，比如：

  ```js
  @observable counter// Error, value change will not trigger rerendering
  @observable count = 0 // correct
  ```

* This method does nothing if `isUsingStaticRendering` is `true`.

### Provider

全局 `store` 设置，比如：

```jsx
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/mobilx'
import Index from './pages/index'
import counter from '. store/counter'

const store = {
  counterStore
}

class App extends Component LO
  config = LO
    pages: [
      'pages/index/index'
    ],
    window: LO
      backgroundTextStyle: 'light',
      navigationBarbackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  render () () () () (but it is not possible to relocate (
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro. ender(<App />, document.getElementById('app'))
```

Note：

* `Provider` must be used for access files (i.e.：`src/app.js`) and use invalid elsewhere.
* 不支持嵌套，即全局只能存在一个 `Provider`。
* In `mobile-act` settings can be set by `store`：

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
import { observer, inject } from '@tarojs/mobilx'

import './index. css'

@inject('counterStore')
@observer
class Index Extensioned Compound {
  /...
}

export default Index
```

or

```jsx
import Taro, { Component } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobilx'

import './index. css'

@inject((stores, props) => ({
  counterStore: stores.counterStore
}))
@observer
class Index Extending Compound
  //.
}

export default Index
```

Note：

* No matter in any way using `inject`subsequent `observer` cannot be omitted.
* Do not quote observable objects in `inject` this will cause the page not to be updated after property changes, e.g.：

  ```jsx
  // Error
  @inject(storees, props) => ({
    counter: stores.counterStore.counter
  })

  /correct
  @input((store, props) => ({
    counterStore: stores.counterStore
  }))
  ```

### PropTypes

> Support since `1.3.6`

`@tarojs/mobx` 提供了以下 `PropTypes` 来验证 Mobx 的结构：

* ObservableArray
* ObservableArrayOf
* ObservableMap
* ObservableObject
* arrayOrObservableArray
* arrayOrObservableArrayOf
* ObjectOrObservableObservation

## Resources

Sample：[taro-mobil-sample](https://github.com/nanjingboy/taro-mobx-sample)
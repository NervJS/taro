---
title: Context
---

> 自 `v1.3.0-beta.5` 起支持
> 在 Taro 中没有对 React 15 的 [legacy context](https://zh-hans.reactjs.org/docs/legacy-context.html) 进行支持，无法使用 `getChildContext()` API。

在一个典型的 Taro 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的，但这种做法对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI 主题），这些属性是应用程序中许多组件都需要的。Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。


## API

### Taro.createContext

```jsx
const MyContext = Taro.createContext(defaultValue)
```
创建一个 Context 对象。当 Taro 渲染一个订阅了这个 Context 对象的组件，这个组件会从最先渲染的 `Provider` 中读取到 `Provider` 的 `value`。

> 在 Taro 中，即便在框架层面也无法知道组件的树结构，因此 Taro 无法像 React 一样往父组件找离自己最近的 Provider。因此创建的 Context 最好只在一个地方使用。


### Context.Provider

```jsx
<MyContext.Provider value={/* 某个值 */}>
```

每个 Context 对象都会返回一个 Provider Taro 组件，它允许消费组件订阅 context 的变化。

Provider 接收一个 `value` 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部包含 `contextType` 或使用 `useContext` 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

通过新旧值检测来确定变化，使用了与 `Object.is` 相同的算法。

> 由于现在 Taro 还没有 render props 的完整支持，所以无法使用 Context.Comsumer API，如果要消费 Context，可以使用 `ContextType` 或 `useContext` API。

### Class.contextType

```jsx
class MyClass extends Taro.Component {
  componentDidMount() {
    let value = this.context;
    /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* 基于 MyContext 组件的值进行渲染 */
  }
}
MyClass.contextType = MyContext;
```

挂载在 class 上的 `contextType` 属性会被重赋值为一个由 `Taro.createContext()` 创建的 Context 对象。这能让你使用 this.context 来消费 Context 上的那个值。你可以在任何生命周期中访问到它，包括 render 函数中。

> 注意：
> 你只通过该 API 订阅单一 context。如果你想订阅多个，阅读使用多个 Context 章节
> 如果你正在使用实验性的 public class fields 语法，你可以使用 static 这个类属性来初始化你的 contextType。

```jsx
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* 基于这个值进行渲染工作 */
  }
}
```

## 示例

### 动态 Context

```jsx
// counter-context.js
export const CounterContext = Taro.createContext(0);

// index.js
class Index extends Component {
  render () {
    const [ count, setCount ] = useState(0)
    return (
      <CounterContext.Provider value={count}>
        <View className='container'>
          <Test />
          <Button onClick={() => setCount(0)}>Reset</Button>
          <Button onClick={() => setCount(prevCount => prevCount + 1)}>+</Button>
          <Button onClick={() => setCount(prevCount => prevCount - 1)}>-</Button>
        </View>
      </CounterContext.Provider>
    )
  }
}

// child.js
class Child extends Taro.Component {
  shouldComponentUpdate () {
    // 即便返回 false 也不会阻止 CounterContext 更新消费它的组件
    return false
  }

  render () {
    return <Counter />
  }
}

// counter.js
import { CounterContext } from './counter-context.js'
class Counter extends Taro.Component {
  static contextType = CounterContext

  render () {
    const value = this.context
    return (
      <View>
        Count: {value}
      </View>
    )
  }
}
```

我们在这个例子中把计数器 `count` 的值通过 `CounterContext.Provider` 往下传递，`Child` 组件中虽然禁止了更新，但 `Counter` 组件在 `CounterContext.Provider` 的 `value` 每次变化之后，还是能够订阅更新，收到每次 `count` 的值。

### 消费多个 Context

```jsx
const ThemeContext = Taro.createContext('light');

// 用户登录 context
const UserContext = Taro.createContext({
  name: 'Guest',
});

class App extends Taro.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // 提供初始 context 值的 App 组件
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// 一个组件可能会消费多个 context
function Content() {
  const theme = useContext(ThemeContext)
  const user =  useContext(UserContext)
  return (
    <ProfilePage user={user} theme={theme} />
  )
}
```

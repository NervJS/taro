---
title: Context
---

> 自 `v1.3.0-beta.5` 起支持 在 Taro 中没有对 React 15 的 [legacy context](https://zh-hans.reactjs.org/docs/legacy-context.html) 进行支持，无法使用 `getChildContext()` API。

In a typical Taro app, data is passed from top down through props (parents and children) but this is very cumbersome for some types of attributes (e.g.：area preferences, UI themes), which are required by many components in the application.Context provides a way to share this value between components, without explicitly passing props through the hierarchy of component trees.


## API

### Taro.createContext

```jsx
const MyContext = Taro.createContext(defaultValue)
```
Create a Context object.当 Taro 渲染一个订阅了这个 Context 对象的组件，这个组件会从最先渲染的 `Provider` 中读取到 `Provider` 的 `value`。

> In Taro Taro the tree structure of the component cannot be known even at the framework level, so Taro cannot look like React to parent components to find their nearest ProviderThe text created is therefore best used in one place only.


### Context.Provider

```jsx
<MyContext.Provider value={/* 某个值 */}>
```

Every Context object returns a Provider Taro component, which allows consumer components to subscribe to changes

Provider accepts a `value` attribute, passed to consumer components.A Provider can be related to multiple consumer components.Multiple Provider can also be nested and inside will override outer data.

When the Provider's `value` value changes, all consumer components within it will re-render.Provider 及其内部包含 `contextType` 或使用 `useContext` 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

Determine changes with new and old values using the same algorithm as `Object.is`.

> Context.Comsumer API cannot be used by Taro now because it does not yet have the full support of render props. To purchase Context, use `ContextType` or `useContext` API.

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

The `contextType` attribute mounted on class will be reassigned to a Context object created by `Taro.createContext()`.This allows you to use this context to consume the value on ContextYou can access it in any life cycle, including the render function.

> Note that： you are only subscribed to a single context via this API.If you want to subscribe to more than one section, read using multiple Context chapter If you are using experimental public class syntax, you can use static this class attribute to initialize your contextType.

```jsx
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* 基于这个值进行渲染工作 */
  }
}
```

## Example

### Dynamic Context

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

### Consumer Multiple Context

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

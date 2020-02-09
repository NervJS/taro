---
title: Hooks
id: version-1.3.37-hooks
original_id: hooks
---

> 自 `v1.3.0-beta-0` 起支持

`Hooks` 是一套全新的 API，可以让你在不编写类，不使用 `state` 的情况下使用 Class 的状态管理，生命周期等功能。

关于 `Hooks` 的概述、动机和规则，我们强烈建议你阅读 React 的官方文档。和其它大部分 React 特性不同，Hooks 没有 RFC 介绍，相反，所有说明都在文档中：

* [Introducing Hooks(简介)](https://zh-hans.reactjs.org/docs/hooks-intro.html)
* [Hooks at a Glance(概览)](https://zh-hans.reactjs.org/docs/hooks-overview.html)
* [Rules of Hooks(规则)](https://zh-hans.reactjs.org/docs/hooks-rules.html)

本篇文档只会介绍在 Taro 中可用的 Hooks API 和部分与 React 不一致的行为，其它内容大体的内容和 [Hooks Reference](https://zh-hans.reactjs.org/docs/hooks-reference.html) 相同。

你还可以参考这两个使用 Hooks 的 Demo：

* [V2EX](https://github.com/NervJS/taro-v2ex-hooks)，主要展示与服务器通信

* [TodoMVC](https://github.com/NervJS/taro-todomvc-hooks)，主要展示组件间通信

## API

在 Taro 中使用 Hooks API 很简单，只需要从 `@tarojs/taro` 中引入即可。

```javascript
import { useEffect, useLayoutEffect, useReducer, useState, useContext, useRef, useCallback, useMemo } from '@tarojs/taro'
```

### `useState`

```js
const [state, setState] = useState(initialState);
```

返回一个 state，以及更新 state 的函数。

在初始渲染期间，返回的状态 (`state`) 与传入的第一个参数 (`initialState`) 值相同。

`setState` 函数用于更新 state。它接收一个新的 state 值并将组件的一次重新渲染加入队列。

```js
setState(newState);
```

在后续的重新渲染中，`useState` 返回的第一个值将始终是更新后最新的 state。

> 注意
>
>Taro 会确保 `setState` 函数的标识是稳定的，并且不会在组件重新渲染时发生变化。这就是为什么可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `setState`。

#### 函数式更新

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 `setState`。该函数将接收先前的 state，并返回一个更新后的值。下面的计数器组件示例展示了 `setState` 的两种用法：

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <View>
      Count: {count}
      <Button onClick={() => setCount(initialCount)}>Reset</Button>
      <Button onClick={() => setCount(prevCount => prevCount + 1)}>+</Button>
      <Button onClick={() => setCount(prevCount => prevCount - 1)}>-</Button>
    </View>
  );
}
```

“+” 和 “-” 按钮采用函数式形式，因为被更新的 state 需要基于之前的 state。但是“重置”按钮则采用普通形式，因为它总是把 count 设置回初始值。

> 注意
>
> 与 class 组件中的 `setState` 方法不同，`useState` 不会自动合并更新对象。你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果。
>
> ```js
> setState(prevState => {
>   // 也可以使用 Object.assign
>   return {...prevState, ...updatedValues};
> });
> ```
>
> `useReducer` 是另一种可选方案，它更适合用于管理包含多个子值的 state 对象。

#### 惰性初始 state

`initialState` 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用：

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

### `useEffect`

```js
useEffect(didUpdate);
```

该 Hook 接收一个包含命令式、且可能有副作用代码的函数。

在函数组件主体内（这里指在 Taro 渲染或创建数据的阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。

使用 `useEffect` 完成副作用操作。赋值给 `useEffect` 的函数会在组件渲染到屏幕之后执行。

默认情况下，effect 将在每轮渲染结束后执行，但你可以选择让它在只有某些值改变的时候才执行。

#### 清除 effect

通常，组件卸载时需要清除 effect 创建的诸如订阅或计时器 ID 等资源。要实现这一点，`useEffect` 函数需返回一个清除函数。以下就是一个创建订阅的例子：

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清除订阅
    subscription.unsubscribe();
  };
});
```

为防止内存泄漏，清除函数会在组件卸载前执行。另外，如果组件多次渲染（通常如此），则**在执行下一个 effect 之前，上一个 effect 就已被清除**。在上述示例中，意味着组件的每一次更新都会创建新的订阅。若想避免每次更新都触发 effect 的执行，请参阅下一小节。

#### effect 的执行时机

与 `componentDidMount`、`componentDidUpdate` 不同的是，Taro 会在 `setData` 完成之后的下一个 [macrotask](https://github.com/ccforward/cc/issues/47) 执行 effect 的回调函数，传给 `useEffect` 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如如设置订阅和事件处理等情况，因此不应在函数中执行渲染和更新。

然而，并非所有 effect 都可以被延迟执行。例如，在容器执行下一次绘制前，用户可见的 DOM 变更就必须同步执行，这样用户才不会感觉到视觉上的不一致。（概念上类似于被动监听事件和主动监听事件的区别。）Taro 为此提供了一个额外的 [`useLayoutEffect`](#uselayouteffect) Hook 来处理这类 effect。它和 `useEffect` 的结构相同，区别只是调用时机不同。

#### effect 的条件执行

默认情况下，effect 会在每轮组件渲染完成后执行。这样的话，一旦 effect 的依赖发生变化，它就会被重新创建。

然而，在某些场景下这么做可能会矫枉过正。比如，在上一章节的订阅示例中，我们不需要在每次组件更新时都创建新的订阅，而是仅需要在 `source` props 改变时重新创建。

要实现这一点，可以给 `useEffect` 传递第二个参数，它是 effect 所依赖的值数组。更新后的示例如下：

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

此时，只有当 `props.source` 改变后才会重新创建订阅。

>注意
>
>如果你要使用此优化方式，请确保数组中包含了**所有外部作用域中会发生变化且在 effect 中使用的变量**，否则你的代码会引用到先前渲染中的旧变量。
>
>如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（`[]`）作为第二个参数。这就告诉 Taro 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。这并不属于特殊情况 —— 它依然遵循输入数组的工作方式。
>
>如果你传入了一个空数组（`[]`），effect 内部的 props 和 state 就会一直拥有其初始值。尽管传入 `[]` 作为第二个参数有点类似于 `componentDidMount` 和 `componentWillUnmount` 的思维模式，但我们有 [更好的](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [方式](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) 来避免过于频繁的重复调用 effect。除此之外，请记得 Taro 会等待渲染完毕之后才会延迟调用 `useEffect`，因此会使得额外操作很方便。
>
>
>Taro 会在自带的 ESLint 中配置 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 规则。此规则会在添加错误依赖时发出警告并给出修复建议。


### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

[`useState`](#usestate) 的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其配套的 `dispatch` 方法。（如果你熟悉 Redux 的话，就已经知道它如何工作了。）

在某些场景下，`useReducer` 会比 `useState` 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为[你可以向子组件传递 `dispatch` 而不是回调函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down) 。

以下是用 reducer 重写 [`useState`](#usestate) 一节的计数器示例：

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter({initialState}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <View>
      Count: {state.count}
      <Button onClick={() => dispatch({type: 'increment'})}>+</Button>
      <Button onClick={() => dispatch({type: 'decrement'})}>-</Button>
    </View>
  );
}
```

>注意
>
> Taro 会确保 `dispatch` 函数的标识是稳定的，并且不会在组件重新渲染时改变。这就是为什么可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `dispatch`。

#### 指定初始 state

有两种不同初始化 `useReducer` state 的方式，你可以根据使用场景选择其中的一种。将初始 state 作为第二个参数传入 `useReducer` 是最简单的方法：

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>注意
>
> Taro 不使用 `state = initialState` 这一由 Redux 推广开来的参数约定。有时候初始值依赖于 props，因此需要在调用 Hook 时指定。如果你特别喜欢上述的参数约定，可以通过调用 `useReducer(reducer, undefined, reducer)` 来模拟 Redux 的行为，但我们不鼓励你这么做。

#### 惰性初始化

你可以选择惰性地创建初始 state。为此，需要将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 state 将被设置为 `init(initialArg)`。

这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利：

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <View>
      Count: {state.count}
      <Button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </Button>
      <Button onClick={() => dispatch({type: 'increment'})}>+</Button>
      <Button onClick={() => dispatch({type: 'decrement'})}>-</Button>
    </View>
  );
}
```

### `useCallback`

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

返回一个 [memoized](https://en.wikipedia.org/wiki/Memoization) 回调函数。

把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。


### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

返回一个 [memoized](https://en.wikipedia.org/wiki/Memoization) 值。

把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

记住，传入 `useMemo` 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 `useEffect` 的适用范畴，而不是 `useMemo`。

如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值。


### `useRef`

```js
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内保持不变。

一个常见的用例便是命令式地访问子组件：

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <View>
      <Input ref={inputEl} type="text" />
      <Button onClick={onButtonClick}>Focus the input</Button>
    </View>
  );
}
```

本质上，`useRef` 就像是可以在其 `.current` 属性中保存一个可变值的“盒子”。

你应该熟悉 ref 这一种[访问 DOM](/docs/refs.html) 的主要方式。如果你将 ref 对象以 `<View ref={myRef} />` Taro 都会将 ref 对象的 `.current` 属性设置为相应的 DOM 节点。

然而，`useRef()` 比 `ref` 属性更有用。它可以[很方便地保存任何可变值](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)，其类似于在 class 中使用实例字段的方式。

这是因为它创建的是一个普通 JavaScript 对象。而 `useRef()` 和自建一个 `{current: ...}` 对象的唯一区别是，`useRef` 会在每次渲染时返回同一个 ref 对象。

请记住，当 ref 对象内容发生变化时，`useRef` 并*不会*通知你。变更 `.current` 属性不会引发组件重新渲染。如果想要在 Taro 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用[回调 ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node) 来实现。

### `useLayoutEffect`

其函数签名与 `useEffect` 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，`useLayoutEffect` 内部的更新计划将被同步刷新。

尽可能使用标准的 `useEffect` 以避免阻塞视觉更新。

> 提示
>
> 如果你正在将代码从 class 组件迁移到使用 Hook 的函数组件，则需要注意 `useLayoutEffect` 与 `componentDidMount`、`componentDidUpdate` 的调用阶段是一样的。但是，我们推荐你**一开始先用 `useEffect`**，只有当它出问题的时再尝试使用 `useLayoutEffect`。


### `useContext`

```jsx
const value = useContext(MyContext)
```

接收一个 context (`Taro.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中最先渲染的 `<MyContext.Provider value={value}>` 的 `value`决定。

当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context `value` 值。

别忘记 `useContext` 的参数必须是 context 对象本身：

正确： `useContext(MyContext)`
错误： `useContext(MyContext.Consumer)`
错误： `useContext(MyContext.Provider)`
调用了 `useContext` 的组件总会在 context 值变化时重新渲染。

> 如果你在接触 Hook 前已经对 context API 比较熟悉，那应该可以理解，`useContext(MyContext)` 相当于 class 组件中的 `static contextType = MyContext` 或者 <MyContext.Consumer>。
> `useContext(MyContext)` 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 <MyContext.Provider> 来为下层组件提供 context。

### `useDidShow`

> 自 `1.3.14` 开始支持

```jsx
useDidShow(() => {
  console.log('componentDidShow')
})
```

`useDidShow` 是 Taro 专有的 Hook，等同于 `componentDidShow` 页面生命周期钩子

### `useDidHide`

> 自 `1.3.14` 开始支持

```jsx
useDidHide(() => {
  console.log('componentDidHide')
})
```

`useDidHide` 是 Taro 专有的 Hook，等同于 `componentDidHide` 页面生命周期钩子

### `usePullDownRefresh`

> 自 `1.3.14` 开始支持

```jsx
usePullDownRefresh(() => {
  console.log('onPullDownRefresh')
})
```

`usePullDownRefresh` 是 Taro 专有的 Hook，等同于 `onPullDownRefresh` 页面生命周期钩子

### `useReachBottom`

> 自 `1.3.14` 开始支持

```jsx
useReachBottom(() => {
  console.log('onReachBottom')
})
```

`useReachBottom` 是 Taro 专有的 Hook，等同于 `onReachBottom` 页面生命周期钩子

### `usePageScroll`

> 自 `1.3.14` 开始支持

```jsx
usePageScroll(res => {
  console.log(res.scrollTop)
})
```

`usePageScroll` 是 Taro 专有的 Hook，等同于 `onPageScroll` 页面生命周期钩子

### `useResize`

> 自 `1.3.14` 开始支持

```jsx
useResize(res => {
  console.log(res.size.windowWidth)
  console.log(res.size.windowHeight)
})
```

`useResize` 是 Taro 专有的 Hook，等同于 `onResize` 页面生命周期钩子

### `useShareAppMessage`

> 自 `1.3.14` 开始支持

```jsx
useShareAppMessage(res => {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res.target)
  }
  return {
    title: '自定义转发标题',
    path: '/page/user?id=123'
  }
})
```

`useShareAppMessage` 是 Taro 专有的 Hook，等同于 `onShareAppMessage` 页面生命周期钩子

### `useTabItemTap`

> 自 `1.3.14` 开始支持

```jsx
useTabItemTap(item => {
  console.log(item.index)
  console.log(item.pagePath)
  console.log(item.text)
})
```

`useTabItemTap` 是 Taro 专有的 Hook，等同于 `onTabItemTap` 页面生命周期钩子

### `useRouter`

> 自 `1.3.14` 开始支持

```jsx
const router = useRouter() // { path: '', params: { ... } }
```

`useRouter` 是 Taro 专有的 Hook，等同于页面为类时的 `this.$router`

### `useScope`

> 自 `1.3.20` 开始支持

```jsx
const scope = useScope()
```

`useScope` 是 Taro 专有的 Hook，等同于页面为类时的 `this.$scope`

## 页面及组件中相关属性设置

在 Taro 中，你可以为页面及组件设置一些属性来达到一些特殊的目的，例如 `config` 设置配置等等，在前面章节你已经学会如何在类中进行相关设置，同样的，使用 Hooks 时你也可以进行相关设置来达到和使用类一样的效果。

不同于使用类的写法，使用 Hooks 时，你需要将 `config` 或 `options` 等配置直接挂载在 Hooks 函数上，即可以达到想要的效果，例如

为页面设置 `config`

```jsx
export default function Index () {
  return <View></View>
}

Index.config = {
  navigationBarTitleText: '首页'
}
```

为组件设置 `options`

```jsx
export default function Com () {
  return <View></View>
}

Com.options = {
  addGlobalClass: true
}
```

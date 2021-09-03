---
title: Hooks
---

`Hooks` is an advanced API，which allows you to use state management, lifecycle and other functions of Class, without Class and `state`.

关于 `Hooks` 的概述、动机和规则，我们强烈建议你阅读 React 的官方文档。Unlike most other React features, Hooks does not have an RFC introduction. Instead, all the instructions are in the documentation:

* [Introducing Hooks(Introduction)](https://zh-hans.reactjs.org/docs/hooks-intro.html)
* [Hooks at a Glance(Overview)](https://zh-hans.reactjs.org/docs/hooks-overview.html)
* [Rules of Hooks(Rules)](https://zh-hans.reactjs.org/docs/hooks-rules.html)

This document will only the Hooks API available in Taro and some behaviors that are inconsistent with React. Other contents are generally the same as [Hooks Reference](https://zh-hans.reactjs.org/docs/hooks-reference.html).

You can also refer to the following two demos using Hooks:

* [V2EX](https://github.com/NervJS/taro-v2ex-hooks), mainly show communication with server.

* [TodoMVC](https://github.com/NervJS/taro-todomvc-hooks), mainly show communication between components.

## API

`usePageScroll` is a Taro's exclusive Hook, which is equivalent to the `onPageScroll` page life cycle hook.

```js
import { usePageScroll, useReachBottom } from '@tarojs/taro' // Hooks exclusive to Taro
import { useState, useEffect } from 'react' // Framework Hooks (Basic Hooks）
// If you want to use Nerv,
// import { useState, useEffect } from 'nervjs' // Framework Hooks （Basic Hooks）
```

## Related Reading

### useRouter

Return a state, and a function which could update the state.

```jsx title="示例代码"
const router = useRouter() // { path: '', params: { ... } }
```

### useReady

During the initial rendering, the returned state (`state`) has the same value as the first parameter (`initialState`) passed in.

从此生命周期开始可以使用 createCanvasContext 或 createSelectorQuery 等 API 访问小程序渲染层的 DOM 节点。

```js title="示例代码"
useReady(() => {  const query = wx.createSelectorQuery()})
```

### useDidShow

页面显示/切入前台时触发。等同于 `componentDidShow` 页面生命周期钩子。

```jsx title="示例代码"
useDidShow(() => {  console.log('componentDidShow')})
```

### useDidHide

页面隐藏/切入后台时触发。`useDidHide` is a Taro's exclusive Hook, which is equivalent to the `componentDidHide` page life cycle hook.

```jsx title="示例代码"
useDidHide(() => {
  console.log('componentDidHide')
})
```

### usePullDownRefresh

监听用户下拉动作。等同于 `onPullDownRefresh` 页面生命周期钩子。

```jsx title="示例代码"
usePullDownRefresh(() => {  console.log('onPullDownRefresh')})
```

### useReachBottom

监听用户上拉触底事件。等同于 `onReachBottom` 页面生命周期钩子。

```jsx title="示例代码"
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // clear effect
    subscription.unsubscribe();
  };
});
```

### usePageScroll

监听用户滑动页面事件。`useReady` is a Hook exclusive to Taro, which is equivalent to the `onReady` page life cycle hook.

```jsx title="示例代码"
usePageScroll(res => {
  console.log(res.scrollTop)
})
```

### useResize

小程序屏幕旋转时触发。`useResize` is a Taro's exclusive Hook, which is equivalent to the `onResize` page life cycle hook.

```jsx title="示例代码"
useResize(res => {  
  console.log(res.size.windowWidth)  
  console.log(res.size.windowHeight)
})
```

### useShareAppMessage

监听用户点击页面内转发按钮（Button 组件 openType='share'）或右上角菜单“转发”按钮的行为，并自定义转发内容。等同于 `onShareAppMessage` 页面生命周期钩子。

**From【Breaking】Taro 3.0.3，it's must be configured with `enableShareAppMessage: true` for the page when using this Hook.**

```jsx title="示例代码"
// page.js
function Index () {
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
}
// page.config.js
export default {
  enableShareAppMessage: true
}
```

### useTabItemTap

点击 tab 时触发。`useTabItemTap` is a Taro's exclusive Hook, which is equivalent to the `onTabItemTap` page life cycle hook.

```jsx title="示例代码"
useTabItemTap(item => {
  console.log(item.index)
  console.log(item.pagePath)
  console.log(item.text)
})
```

### useAddToFavorites

监听用户点击右上角菜单“收藏”按钮的行为，并自定义收藏内容。等同于 `onAddToFavorites` 页面生命周期钩子。

> Attention！

```jsx title="示例代码"
useAddToFavorites(res => {
  // webview return webviewUrl 
  console.log('WebviewUrl: ', res.webviewUrl)
  return {
    title: '自定义标题',
    imageUrl: 'http://demo.png',
    query: 'name=xxx&age=xxx',
  }
})
```

### useShareTimeline

监听右上角菜单“分享到朋友圈”按钮的行为，并自定义分享内容。等同于 `onShareTimeline` 页面生命周期钩子。

> Notice!

**When using this Hook, it's must be configured with `enableShareTimeline: true` for the page.**

```jsx title="示例代码"
// page.js
function Index () {
  useShareTimeline(() => {
    console.log('onShareTimeline')
  })
}
// page.config.js
export default {
  enableShareTimeline: true
}
```

## React Hooks

### useState

```js
const [state, setState] = useState(initialState);
```

返回一个 state，以及更新 state 的函数。

In subsequent re-rendering, the first value returned by `useState` will always be the latest state after the update.

The `setState` function is used to update state.It will receive a new state and add a new re-render of the component to the queue.

```js
setState(newState);
```

setState(prevState =&gt; { // 也可以使用 Object.assign return {...prevState, ...updatedValues}; });

> `useReducer` is another alternative, which is more suitable for managing state objects that contain multiple sub-values.
> 
> Taro will ensure that the identity of the `setState` function is stable, and it will not change when the component is re-rendered.This is why it is safe to omit `setState` from the dependency list of `useEffect` or `useCallback`.

#### Functional Update

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 `setState`。If the new state needs to be calculated using the previous state, we can pass the function to `setState`, which will reveive the previous state and return an updated value.It shows two uses of `setState` in the following counter component example:

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

The "+" and "-" buttons use the form of function, because the updated state must be based on the previous state.However, the "reset" button takes the normal form, because it always sets the count back to the initial value.

> Attention!
> 
> Unlike the `setState` method in the class component, `useState` does not automatically merge and update objects.Combined with the expansion operator, you can use the functional `setState` to achieve the effect of merging and updateing objects.
> 
> ```js
> setState(prevState => {
>   // 也可以使用 Object.assign
>   return {...prevState, ...updatedValues};
> });
> ```
> 
> `useReducer` 是另一种可选方案，它更适合用于管理包含多个子值的 state 对象。

#### Lazy initial state

The `initialState` parameter only works during the initial rendering of the component,and will be ignoredd in subsequent renderings.If the initial state needs to perform complex colculations, it can pass in a function which takes on the calculation task and returns the initial state. This function is only called during the initial rendering:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

### useEffect

```js
useEffect(didUpdate);
```

The following is an example of rewriting the counter in the [`useState`](#usestate) section with a reducer:

It's not allowed in the body of the function component (here refers to the stage of rendering or creating data in Taro) that changing the DOM, adding subscriptions, setting timers, recording logs, and performing other operations that contain side effects.Because it may generate some inexplicable Bugs and destroy the consistency of the UI.

Use `useEffect` to complete side effects.The function assigned to `useEffect` will be executed after the component is rendered to the screen.

It can extract the logic used to calculate the state outside the reducer, which also provides convenience for the future processing of the action that resets the state:

#### Clear effect

Generally, It's needed to clear resources created by effect such as subscriptions or timer IDs, when a component is unmounted.To achieve it, the `useEffect` function needs to return a cleanup function.The following is an example of creating a subscription:

```js
useDidHide(() => {  console.log('componentDidHide')})
```

To avoid memory leaks, the cleanup function will be executed before the component is unmounted.In addition, if the component is rendered multiple times(usually), **the previous effect will be cleared before the next effect is executed.** In the above example, it means that every update of the component will create a new subscription.在上述示例中，意味着组件的每一次更新都会创建新的订阅。If you want to avoid triggering the execution of the effect every time you update, please refer to the next section.

#### The execution time of effect

It's different from `componentDidMount` and `componentDidUpdate`, Taro will execute the effect callback function at the next [macrotask](https://github.com/ccforward/cc/issues/47) after the completion of `setData`, and the function passed to `useEffect` will be called delayed.This makes it suitable for a lot of common side effects scenarios, such as setting up subscriptions and event handling, so it should't to execute render and update in functions.

However, not every function could be delayed.For example, before the next drawing performed by container, the DOM changes which are visible to the user must be executed synchronously so that the user will not feel visual inconsistencies.(Conceptually, it is similar to the difference between passive monitoring of events and active monitoring of events.) For this purpose, Taro provides an additional [`useLayoutEffect`](#uselayouteffect) Hook to handle such effects. It has the same structure as `useEffect`, the only difference is the timing of the call.它和 `useEffect` 的结构相同，区别只是调用时机不同。

#### Conditional execution of effect

By default, effect will be executed after each round of component rendering.In this case, once the dependency of the effect changes, it will be recreated.

However, doing so may be a bit of overkill in some scenarios.For example, in the subscription example in the previous chapter, we don't need to create a new subscription every time the component is updated, but only need to recreate it when the `source` props change.

To achieve this, you can pass the second parameter to `useEffect`, which is an array of values ​​that the effect depends on.The updated example is as follows:

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

At this moment, the subscription will be recreated only when the `props.source` is changed.
> 注意
> 
> If you want to use this optimization method, please ensure that the array contains **all variables that will change in the external scope and used in the effect**, otherwise your code will reference the old variables in the previous rendering.
> 
> If you want to execute an effect that only runs once (only executed when the component is mounted and unmounted), you can pass an empty array (`[]`) as the second parameter.It means to Taro that your effect doesn't depend on any value in props or state, so it never needs to be executed repeatedly.This is not a special case, it still follows the approach that pass the array.
> 
> If you pass in an empty array (`[]`), the props and state inside the effect will always have their initial values.Although passing in `[]` as the second parameter is a litter similar to the thinking mode of `componentDidMount` and `componentWillUnmount`, we have \[better\](https://zh-hans.reactjs.org/docs/hooks -faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) \[Method\](https://zh-hans.reactjs.org/docs/hooks-faq.html #what-can-i-do-if-my-effect-dependencies-change-too-often) to avoid calling effect too frequently.In addition, please remember that Taro will delay the call to `useEffect` after the rendering is complete, so it is very convenient for additional operations.
> 
> Taro will configure [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) in the built-in ESLint [`exhaustive- deps`](https://github.com/facebook/react/issues/14920) rules.This rule will issue a warning when adding a wrong dependency and give repair suggestions.


### useReducer

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

Alternative to [`useState`](#usestate).It receives a reducer in the form of `(state, action) => newState`, and returns the current state and its related `dispatch` method.(If you are familiar with Redux, you already know how it works.)

In some scenarios, `useReducer` is more suitable than `useState`, for example, the state logic is more complicated and contains multiple sub-values, or the next state depends on the previous state, etc.In addition, using `useReducer` can also optimize the performance of components that will trigger deep updates, because [you can pass `dispatch` to child components instead of callback functions](https://zh-hans.reactjs.org/docs /hooks-faq.html#how-to-avoid-passing-callbacks-down).

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
> Notice!
> 
> Taro will ensure that the identity of the `dispatch` function is stable and will not change when the component is re-rendered.This is why it is safe to omit `dispatch` from the dependency list of `useEffect` or `useCallback`.

#### Specify the initial state

There are two different ways to initialize the `useReducer` state, you can choose one of them according to your usage scenario.It is the easiest way that passing the initial state as the second parameter to `useReducer`:

```jsx
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```
> Attention!
> 
> Taro does not use `state = initialState` which is a parameter convention popularized by Redux.Sometimes the initial value depends on props, so it needs to be specified when calling Hook.If you have a preference to the above parameter convention, you can simulate Redux's behavior by calling `useReducer(reducer, undefined, reducer)`, but it's usually not recommended to do it.

#### Lazy initialization

It's a choice to create the initial state lazily.To do this, you need to pass the `init` function as the third parameter of `useReducer` so that the initial state will be set to `init(initialArg)`.

这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利：

```jsx {1-3,11-12,19,24}
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

### useCallback

```js
useTabItemTap(item => {  
  console.log(item.index)  
  console.log(item.pagePath)  
  console.log(item.text)
})
```

It will return a [memoized](https://en.wikipedia.org/wiki/Memoization) callback function.

The inline callback function and the dependency array will be passed as parameters to `useCallback`. It will return the memoized version of the callback function, and the callback function will only be updated when a certain dependency changes.When you pass callback functions to child components that are optimized and use reference equality to avoid unnecessary rendering (such as `shouldComponentUpdate`), it is very useful .

`useCallback(fn, deps)` is equivalent to  `useMemo(() => fn, deps)`。


### useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

When the latest `<MyContext.Provider>` of the upper layer of the component is updated, the Hook will trigger a re-rendering and use the latest context `value` value passed to the MyContext provider.

The "create" function and the dependency array will be passed as parameters to `useMemo`. And it will recalculate the memoized value once a dependency changes.This optimization is useful to avoid computational expense every time render.

Remember, the function passed in `useMemo` will be executed during rendering.Please do not perform some operations that are not related to rendering in this function, such as side effects belong to the applicable scope of `useEffect`, not `useMemo`.

`useDidShow` is a Taro's exclusive Hook, which is equivalent to the `componentDidShow` page life cycle hook.


### useRef

```js
const refContainer = useRef(initialValue);
```

`useRef` returns a mutable ref object whose `.current` property is initialized as the passed parameter (`initialValue`).The returned ref object remains unchanged during the entire life cycle of the component.

`usePullDownRefresh` is a Taro's exclusive Hook, which is equivalent to the `onPullDownRefresh` page life cycle hook.

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` refers to the text input element that has been mounted on the DOM. inputEl.current.focus();
  };
  return (
    <View>
      <Input ref={inputEl} type="text" />
      <Button onClick={onButtonClick}>Focus the input</Button>
    </View>
  );
}
```

`useReachBottom` is a Taro's exclusive Hook, which is equivalent to the `onReachBottom` page life cycle hook.

You should be familiar with ref which is the main way to [access DOM](ref.md).If you set the ref object like `<View ref={myRef} />`, Taro will set the `.current` property of the ref object to the corresponding DOM node.

However, `useRef()` is more useful than the `ref` attribute.It can [conveniently save any variable value](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables), which is similar to the way that using instance fields in class.

This is because it's just an ordinary JavaScript object created.The only difference between `useRef()` and creating a self-built `{current: ...}` object is that `useRef` will return the same ref object every time it is rendered.

Remember, `useRef` will *not* notify you when the content of the ref object changes.Changing the `.current` property will not trigger re-render of the component.If you want to run some code when Taro binds or unbinds the ref of a DOM node, it's  needed to use \[callback ref\](https://zh-hans.reactjs.org/docs/hooks-faq.html#how- can-i-measure-a-dom-node).

### useLayoutEffect

Its function signature is the same as `useEffect`, but it will synchronously call the effect after all DOM updates.You can use it to get the DOM layout and trigger re-rendering synchronously.Before the browser paints, the update plan inside `useLayoutEffect` will be refreshed synchronously.

`useShareAppMessage` is a Taro's exclusive Hook, which is equivalent to the `onShareAppMessage` page life cycle hook.

> Tips
> 
> If you use Hook to migrate code from a class component to a function component, it must be noted that the calling time of `useLayoutEffect` and `componentDidMount` and `componentDidUpdate` are the same.However, it's recommend that  **using `useEffect` at the beginning**, and try to use `useLayoutEffect` only if something goes wrong.


### useContext

```jsx
const value = useContext(MyContext)
```

It will reveive a context (the return value of `Taro.createContext`) and return the current value of the context.The current context value is determined by the `value` of `<MyContext.Provider value={value}>` rendered first in the upper-level component.

`useAddToFavorites` is a Taro's exclusive Hook, which is equivalent to the `onAddToFavorites` page life cycle hook.

Don't forget that the parameter of `useContext` must be the context object itself:

`useShareTimeline` is a Hook exclusive to Taro, which is equivalent to `onShareTimeline` page life cycle hook.

> If you are already familiar with the context API before using Hooks, it is eazy to understand that `useContext(MyContext)` is equivalent to `static contextType = MyContext` or `<MyContext.Consumer>` in the class component. `useContext(MyContext)` just allows you to read the value of context and subscribe to context changes.You still need to use `<MyContext.Provider>` in the upper-level component tree to provide context for the lower-level components.

## 相关阅读

- [《Use React Hooks to refactor your mini program》](/blog/2019-07-10-taro-hooks)

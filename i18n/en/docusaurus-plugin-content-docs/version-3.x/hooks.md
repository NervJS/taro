---
title: Hooks

---

`Hooks` is an advanced API，which allows you to use state management, lifecycle and other functions of Class, without Class and `state`.

About the overview, motivation and rules of `Hooks`, we strongly recommend that you read the official React documentation. Unlike most other React features, Hooks does not have an RFC introduction. Instead, all the instructions are in the documentation:

* [Introducing Hooks(Introduction)](https://zh-hans.reactjs.org/docs/hooks-intro.html)
* [Hooks at a Glance(Overview)](https://zh-hans.reactjs.org/docs/hooks-overview.html)
* [Rules of Hooks(Rules)](https://zh-hans.reactjs.org/docs/hooks-rules.html)

This document will only the Hooks API available in Taro and some behaviors that are inconsistent with React. Other contents are generally the same as [Hooks Reference](https://zh-hans.reactjs.org/docs/hooks-reference.html).

You can also refer to the following two demos using Hooks:

* [V2EX](https://github.com/NervJS/taro-v2ex-hooks), mainly show communication with server.

* [TodoMVC](https://github.com/NervJS/taro-todomvc-hooks), mainly show communication between components.

## API

It's eazy to use Hooks API in Taro. Import Hooks exclusive to Taro(such as usePageScroll, useReachBotto) from @tarojs/taro, and import hooks owing to framework(such as useEffect, useState) from the corresponding framework.

```js
import { usePageScroll, useReachBottom } from '@tarojs/taro' // Hooks exclusive to Taro
import { useState, useEffect } from 'react' // Framework Hooks (Basic Hooks）
// If you want to use Nerv,
// import { useState, useEffect } from 'nervjs' // Framework Hooks （Basic Hooks）
```

### `useState`

```js
const [state, setState] = useState(initialState);
```

Return a state, and a function which could update the state.

During the initial rendering, the returned state (`state`) has the same value as the first parameter (`initialState`) passed in.

The `setState` function is used to update state. It will receive a new state and add a new re-render of the component to the queue.


```js
setState(newState);
```

In subsequent re-rendering, the first value returned by `useState` will always be the latest state after the update.

> Attention！
>
> Taro will ensure that the identity of the `setState` function is stable, and it will not change when the component is re-rendered. This is why it is safe to omit `setState` from the dependency list of `useEffect` or `useCallback`.

#### Functional Update

If the new state needs to be calculated using the previous state, we can pass the function to `setState`, which will reveive the previous state and return an updated value. It shows two uses of `setState` in the following counter component example:


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

The "+" and "-" buttons use the form of function, because the updated state must be based on the previous state. However, the "reset" button takes the normal form, because it always sets the count back to the initial value.

> Notice!
>
> Unlike the `setState` method in the class component, `useState` does not automatically merge and update objects. Combined with the expansion operator, you can use the functional `setState` to achieve the effect of merging and updateing objects.

>
> ```js
> setState(prevState => {
> // 也可以使用 Object.assign
> return {...prevState, ...updatedValues};
> });
> ```
>
> `useReducer` is another alternative, which is more suitable for managing state objects that contain multiple sub-values.

#### Lazy initial state

The `initialState` parameter only works during the initial rendering of the component,and will be ignoredd in subsequent renderings. If the initial state needs to perform complex colculations, it can pass in a function which takes on the calculation task and returns the initial state. This function is only called during the initial rendering:

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

The Hook receives a function that contains imperative and possibly side-effect code.

It's not allowed in the body of the function component (here refers to the stage of rendering or creating data in Taro) that changing the DOM, adding subscriptions, setting timers, recording logs, and performing other operations that contain side effects.Because it may generate some inexplicable Bugs and destroy the consistency of the UI.

Use `useEffect` to complete side effects. The function assigned to `useEffect` will be executed after the component is rendered to the screen.

By default, effect will be executed after each round of render. But it's alternative to execute it when only some certain values change.


#### Clear effect

Generally, It's needed to clear resources created by effect such as subscriptions or timer IDs, when a component is unmounted. To achieve it, the `useEffect` function needs to return a cleanup function. The following is an example of creating a subscription:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // clear effect
    subscription.unsubscribe();
  };
});
```

To avoid memory leaks, the cleanup function will be executed before the component is unmounted. In addition, if the component is rendered multiple times(usually), **the previous effect will be cleared before the next effect is executed.** In the above example, it means that every update of the component will create a new subscription. If you want to avoid triggering the execution of the effect every time you update, please refer to the next section.


#### The execution time of effect

It's different from `componentDidMount` and `componentDidUpdate`, Taro will execute the effect callback function at the next [macrotask](https://github.com/ccforward/cc/issues/47) after the completion of `setData`, and the function passed to `useEffect` will be called delayed. This makes it suitable for a lot of common side effects scenarios, such as setting up subscriptions and event handling, so it should't to execute render and update in functions.

However, not every function could be delayed. For example, before the next drawing performed by container, the DOM changes which are visible to the user must be executed synchronously so that the user will not feel visual inconsistencies. (Conceptually, it is similar to the difference between passive monitoring of events and active monitoring of events.) For this purpose, Taro provides an additional [`useLayoutEffect`](#uselayouteffect) Hook to handle such effects. It has the same structure as `useEffect`, the only difference is the timing of the call.

#### Conditional execution of effect

By default, effect will be executed after each round of component rendering. In this case, once the dependency of the effect changes, it will be recreated.

However, doing so may be a bit of overkill in some scenarios. For example, in the subscription example in the previous chapter, we don't need to create a new subscription every time the component is updated, but only need to recreate it when the `source` props change.

To achieve this, you can pass the second parameter to `useEffect`, which is an array of values ​​that the effect depends on. The updated example is as follows:


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

> Attention!
>
>If you want to use this optimization method, please ensure that the array contains **all variables that will change in the external scope and used in the effect**, otherwise your code will reference the old variables in the previous rendering.
>
>If you want to execute an effect that only runs once (only executed when the component is mounted and unmounted), you can pass an empty array (`[]`) as the second parameter. It means to Taro that your effect doesn't depend on any value in props or state, so it never needs to be executed repeatedly. This is not a special case, it still follows the approach that pass the array.
>
>
>If you pass in an empty array (`[]`), the props and state inside the effect will always have their initial values. Although passing in `[]` as the second parameter is a litter similar to the thinking mode of `componentDidMount` and `componentWillUnmount`, we have [better](https://zh-hans.reactjs.org/docs/hooks -faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [Method](https://zh-hans.reactjs.org/docs/hooks-faq.html #what-can-i-do-if-my-effect-dependencies-change-too-often) to avoid calling effect too frequently. In addition, please remember that Taro will delay the call to `useEffect` after the rendering is complete, so it is very convenient for additional operations.

>Taro will configure [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) in the built-in ESLint [`exhaustive- deps`](https://github.com/facebook/react/issues/14920) rules. This rule will issue a warning when adding a wrong dependency and give repair suggestions.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

Alternative to [`useState`](#usestate). It receives a reducer in the form of `(state, action) => newState`, and returns the current state and its related `dispatch` method. (If you are familiar with Redux, you already know how it works.)

In some scenarios, `useReducer` is more suitable than `useState`, for example, the state logic is more complicated and contains multiple sub-values, or the next state depends on the previous state, etc. In addition, using `useReducer` can also optimize the performance of components that will trigger deep updates, because [you can pass `dispatch` to child components instead of callback functions](https://zh-hans.reactjs.org/docs /hooks-faq.html#how-to-avoid-passing-callbacks-down).

The following is an example of rewriting the counter in the [`useState`](#usestate) section with a reducer:

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

>Notice!
>
>Taro will ensure that the identity of the `dispatch` function is stable and will not change when the component is re-rendered. This is why it is safe to omit `dispatch` from the dependency list of `useEffect` or `useCallback`.

#### Specify the initial state

There are two different ways to initialize the `useReducer` state, you can choose one of them according to your usage scenario. It is the easiest way that passing the initial state as the second parameter to `useReducer`:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```


>Attention!
>
>Taro does not use `state = initialState` which is a parameter convention popularized by Redux. Sometimes the initial value depends on props, so it needs to be specified when calling Hook. If you have a preference to the above parameter convention, you can simulate Redux's behavior by calling `useReducer(reducer, undefined, reducer)`, but it's usually not recommended to do it.

#### Lazy initialization

It's a choice to create the initial state lazily. To do this, you need to pass the `init` function as the third parameter of `useReducer` so that the initial state will be set to `init(initialArg)`.

It can extract the logic used to calculate the state outside the reducer, which also provides convenience for the future processing of the action that resets the state:

```js
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
const memoizedCallback = useCallback(  () => {    doSomething(a, b);  },  [a, b],);
```
It will return a [memoized](https://en.wikipedia.org/wiki/Memoization) callback function.

The inline callback function and the dependency array will be passed as parameters to `useCallback`. It will return the memoized version of the callback function, and the callback function will only be updated when a certain dependency changes. When you pass callback functions to child components that are optimized and use reference equality to avoid unnecessary rendering (such as `shouldComponentUpdate`), it is very useful .

`useCallback(fn, deps)` is equivalent to  `useMemo(() => fn, deps)`。


### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

It will return a [memoized](https://en.wikipedia.org/wiki/Memoization).

The "create" function and the dependency array will be passed as parameters to `useMemo`. And it will recalculate the memoized value once a dependency changes. This optimization is useful to avoid computational expense every time render.

Remember, the function passed in `useMemo` will be executed during rendering. Please do not perform some operations that are not related to rendering in this function, such as side effects belong to the applicable scope of `useEffect`, not `useMemo`.

If no dependency array is provided, `useMemo` will calculate a new value each time it is rendered.

### `useRef`

```js
const refContainer = useRef(initialValue);
```

`useRef` returns a mutable ref object whose `.current` property is initialized as the passed parameter (`initialValue`). The returned ref object remains unchanged during the entire life cycle of the component.

A common use case is to access subcomponents imperatively:


```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` refers to the text input element that has been mounted on the DOM. 
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


Essentially, `useRef` is like a "box" that can store a variable value in its `.current` property.

You should be familiar with ref which is the main way to [access DOM](ref.md). If you set the ref object like `<View ref={myRef} />`, Taro will set the `.current` property of the ref object to the corresponding DOM node.

However, `useRef()` is more useful than the `ref` attribute. It can [conveniently save any variable value](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables), which is similar to the way that using instance fields in class.

This is because it's just an ordinary JavaScript object created. The only difference between `useRef()` and creating a self-built `{current: ...}` object is that `useRef` will return the same ref object every time it is rendered.

Remember, `useRef` will *not* notify you when the content of the ref object changes. Changing the `.current` property will not trigger re-render of the component. If you want to run some code when Taro binds or unbinds the ref of a DOM node, it's  needed to use [callback ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#how- can-i-measure-a-dom-node).


### `useLayoutEffect`

Its function signature is the same as `useEffect`, but it will synchronously call the effect after all DOM updates. You can use it to get the DOM layout and trigger re-rendering synchronously. Before the browser paints, the update plan inside `useLayoutEffect` will be refreshed synchronously.

Try to use standard `useEffect` whenever possible to avoid blocking visual updates.

> Tips
>
> If you use Hook to migrate code from a class component to a function component, it must be noted that the calling time of `useLayoutEffect` and `componentDidMount` and `componentDidUpdate` are the same. However, it's recommend that  **using `useEffect` at the beginning**, and try to use `useLayoutEffect` only if something goes wrong.


### `useContext`

```jsx
const value = useContext(MyContext)
```

It will reveive a context (the return value of `Taro.createContext`) and return the current value of the context. The current context value is determined by the `value` of `<MyContext.Provider value={value}>` rendered first in the upper-level component.

When the latest `<MyContext.Provider>` of the upper layer of the component is updated, the Hook will trigger a re-rendering and use the latest context `value` value passed to the MyContext provider. 

Don't forget that the parameter of `useContext` must be the context object itself:

Correct: `useContext(MyContext)`
Error: `useContext(MyContext.Consumer)`
Error: `useContext(MyContext.Provider)`
The component that calls `useContext` will always re-render when the context value changes.

> If you are already familiar with the context API before using Hooks, it is eazy to understand that `useContext(MyContext)` is equivalent to `static contextType = MyContext` or `<MyContext.Consumer>` in the class component.
> `useContext(MyContext)` just allows you to read the value of context and subscribe to context changes. You still need to use `<MyContext.Provider>` in the upper-level component tree to provide context for the lower-level components.

### `useDidShow`

```jsx
useDidShow(() => {  console.log('componentDidShow')})
```

`useDidShow` is a Taro's exclusive Hook, which is equivalent to the `componentDidShow` page life cycle hook.

### `useDidHide`

```jsx
useDidHide(() => {  console.log('componentDidHide')})
```

`useDidHide` is a Taro's exclusive Hook, which is equivalent to the `componentDidHide` page life cycle hook.

### `usePullDownRefresh`

```jsx
usePullDownRefresh(() => {  console.log('onPullDownRefresh')})
```

`usePullDownRefresh` is a Taro's exclusive Hook, which is equivalent to the `onPullDownRefresh` page life cycle hook.

### `useReachBottom`

```jsx
useReachBottom(() => {  console.log('onReachBottom')})
```

`useReachBottom` is a Taro's exclusive Hook, which is equivalent to the `onReachBottom` page life cycle hook.

### `usePageScroll`

```jsx
usePageScroll(res => {
  console.log(res.scrollTop)
})
```

`usePageScroll` is a Taro's exclusive Hook, which is equivalent to the `onPageScroll` page life cycle hook.

### `useResize`

```jsx
useResize(res => {  
  console.log(res.size.windowWidth)  
  console.log(res.size.windowHeight)
})
```

`useResize` is a Taro's exclusive Hook, which is equivalent to the `onResize` page life cycle hook.

### `useShareAppMessage`

**From【Breaking】Taro 3.0.3，it's must be configured with `enableShareAppMessage: true` for the page when using this Hook.**

`useResize` is a Taro's exclusive Hook, which is equivalent to the `onResize` page life cycle hook.

### `useShareAppMessage`

**From【Breaking】Taro 3.0.3, you must configure `enableShareAppMessage: true` for the page when using this Hook.**

```jsx
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

`useShareAppMessage` is a Taro's exclusive Hook, which is equivalent to the `onShareAppMessage` page life cycle hook.

### `useTabItemTap`

```jsx
useTabItemTap(item => {  
  console.log(item.index)  
  console.log(item.pagePath)  
  console.log(item.text)
})
```

`useTabItemTap` is a Taro's exclusive Hook, which is equivalent to the `onTabItemTap` page life cycle hook.


### `useAddToFavorites`

>It will be supported from Taro 3.0.3.
>It's only the WeChat small program that is supported,and this interface is a Beta versoin, supported from Android 7.0.15, which is only supported on the Android platform for the time being.

```jsx
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

`useAddToFavorites` is a Taro's exclusive Hook, which is equivalent to the `onAddToFavorites` page life cycle hook.

### `useShareTimeline`

> It will be supported from Taro 3.0.3.
> It's only the WeChat small program that is supported,the basic library 2.11.3 started to support, and this interface is a Beta versoin, which is only supported on the Android platform for the time being.


**When using this Hook, it's must be configured with `enableShareTimeline: true` for the page.**

```jsx
// page.jsfunction Index () {  useShareTimeline(() => {    console.log('onShareTimeline')  })}// page.config.jsexport default {  enableShareTimeline: true}
```

```jsx
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


`useShareTimeline` is a Hook exclusive to Taro, which is equivalent to `onShareTimeline` page life cycle hook.

### `useRouter`

```jsx
const router = useRouter() // { path: '', params: { ... } }
```

`useRouter` is a Hook exclusive to Taro, which is equivalent to `getCurrentInstance().router`.

### `useReady`

```js
useReady(() => {  const query = wx.createSelectorQuery()})
```

`useReady` is a Hook exclusive to Taro, which is equivalent to the `onReady` page life cycle hook.

## Related Reading

- [《Use React Hooks to refactor your mini program》](/blog/2019-07-10-taro-hooks)

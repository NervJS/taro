---
title: Hooks
---

`Hooks` is a new set of APIs that allow you to use Class status management, life cycle and so on without writing classes, without using `state`.

With respect to the overview, motivations and rules of `Hooks` , we strongly recommend that you read React official documents.Unlike most other React features, Hooks do not have RFC presentations, but all notes are in documents：

* [Introducing Hooks (briefing)](https://zh-hans.reactjs.org/docs/hooks-intro.html)
* [Hooks at a Glance (overview)](https://zh-hans.reactjs.org/docs/hooks-overview.html)
* [Rules of Hooks(Rules)](https://zh-hans.reactjs.org/docs/hooks-rules.html)

This document will only describe the hooks API available in Taro and some of the actions that are inconsistent with React, the other contents being the same as [Hooks Reference](https://zh-hans.reactjs.org/docs/hooks-reference.html).

You can also refer to both Demo： using Hooks

* [V2EX](https://github.com/NervJS/taro-v2ex-hooks), Main display with server communication

* [TodoMVC](https://github.com/NervJS/taro-todomvc-hooks), Main display of inter-component communication

## Usage

Using Hooks API in Taro is easy, Taro Proprietary Hooks (e.g. `usePageScroll`, `useReachBottom`) was introduced from `@tarojs/taro` , Split your own Hooks (e.g. `useEffect`, `useState`) is imported from the corresponding framework.

```js
import { usePageScroll, useReachBottom } from '@tarojs/taro' // Taro Proprietary Hooks
import { useState, useEffect } from 'react' // Framework Hooks (base Hooks)
// If you use Nerv location
// import { useState, useEffect } from 'nervjs' / / Framework Hooks (basic Hooks)
```

## Taro Hooks

### useRouter

Equivalent to class `getCurrentInstance().router`.

```jsx title="示例代码"
//um path: '', params: { ... } }
const router = useRouter()
```

### useReady

`onReady` lifecycle hooks equal to the page.

From this lifecycle you can access the DOM node of the rendering layer using createCanvasContext or createSelectorQuery APIs.

```js title="示例代码"
useReady() => LOs
  const query = wx.createSelectorQuery()
})
```

### useDidShow

Triggers when pages show/switch into the frontendequivalent to `componentDidhow` page lifecycle hook.

```jsx title="示例代码"
useDidShow() => LO
  console.log('componentDidShow')
})
```

### useDidHide

Triggers when pages are hidden/cut into the background.equivalent to `componentDidHome` page lifecycle hook.

```jsx title="示例代码"
useDidHide() => LO
  console.log('componentDidHide')
})
```

### usePullDownRefresh

Listen to the user to pull down.equivalent to `onPullDownRefresh` page lifecycle hook.

```jsx title="示例代码"
usePullDownResh() => \
  console.log('onPullDownResh')
})
```

### useReachBottom

Listen to the user to pull down the event.equivalent to `onReachBottom` page lifecycle hook.

```jsx title="示例代码"
useReachBottom() => {
  console.log('onReachBottom')
})
```

### usePageScroll

Listen for user sliding on the page.equivalent to `onPageScroll` page lifecycle hook.

```jsx title="示例代码"
usePageScroll(res => LO
  console.log(res.scrollTop)
})
```

### useResize

Trigger when the applet is rotated.equivalent to `onResize` page lifecycle hook.

```jsx title="示例代码"
useResize(res => LO
  console.log(res.size.windowWidth)
  console.log(res.size.windowHeight)
})
```

### useShareAppMessage

Listen to the actions of the user by clicking the Forwarding button (Button Component openType='share') or the top right menu 'Forward' button, and customize the Forward.equivalent to `onShareAppMessage` page life-cycle hook.

**'Breaking' Taro 3.0.3 Starts, using this Hook must be configured for page `enableShareAppMessage: true`**

```jsx title="示例代码"
// page.js
Function Index () {\
  useShareAppMessage(res => LO
    if (res). From ==== 'button') Fit
      // From in-page forward button
      console.log(res). arget)
    }
    return {
      title: 'Custom Forward Title',
      path: '/page/user? d=123'
    }
  })
}
// page. onfig.js
export default {
  enableShareAppMessage: true
}
```

### useTabItemTap

Triggers when tapping tab.equivalent to `onTabItemTap` page life-cycle hook.

```jsx title="示例代码"
useTabItemTap(item => LO
  console.log(item.index)
  console.log(item.pagePath)
  console.log(item.text)
})
```

### useAddToFavorites

Listen to the actions of the user by clicking on the favorite button in the top right menu and customize the favorite content.equivalent to `onAddToFavorites` page life-cycle hooks.

> Taro 3.0.3 started to support only micromessenger app. This interface is Beta version, Android 7.0.15 is supported and only for Android

```jsx title="示例代码"
useAddToFavorites(res => LO
  // webview page returns webviewUrl
  console.log('WebviewUrl:', ress. ebviewUrl)
  return {
    title: 'Custom title',
    imageUrl: 'http://demo. ng',
    query: 'name=xxx&age=xxx',
  }
})
```

### useShareTimeline

Listen to the action of the "Share to the circle of friends" button in the top right menu and customize sharing of content.equivalent to `onShareTimeline` page life-cycle hooks.

> Taro 3.0.3 started to support only micromessaging, base library 2.11.3 started, this interface is Beta version, only for Android

**When used, must be configured for page `enableShareTimeline: true`**

```jsx title="示例代码"
// page.js
Function Index () {
  useShareTimeline() => {
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
const [state, setState] = useState (initialState);
```

Returns a state, and updated state functions.

Returns the status (`state`) during the initial rendering period is the same as the first parameter (`initialState`)

`setState` functions to update state.It receives a new state value and adds a rerender of the component to the queue.

```js
setState(newState);
```

In the subsequent rerender,`useState` returns the first value that will always be the newest after updating.

> Note
> 
> Taro will make sure the `setState` function identifier is stable and will not change when the component rerenders.This is why you can safely omit `useEffect` or `useCallback` from the dependency list `setState`.

#### Function Update

If the new state needs to be calculated using the previous state, then the function can be passed to `setState`.This function will receive the previous state and return an updated value.下面的计数器组件示例展示了 `setState` 的两种用法：

```js
Function Counter ({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <View>
      Council: {count}
      <Button onClick={() => setCount (initialCount)}>Reset</Button>
      <Button onClick={() => setCount(prevCount => prevCount + 1)}>+</Button>
      <Button onClick={() => setCount(prevCount => prevCount - 1)>-</Button>
    </View>
  );
}
```

The "+" and "-" buttons are in function form, because the updated state needs to be based on the previous state.However, the "Reset button" button is in normal form, as it always sets count back to the initial value.

> Note
> 
> Unlike the `setState` method in class components,`useState` does not automatically merge update objects.You can use the function `setState` to merge and update objects in combination with expanded operators.
> 
> ```js
> setState(prevState => LO
>   // can also use Object.assign
>   return {...prevState, ...updatedValues};
> });
> ```
> 
> `useReducer` is another option that is better suited to manage state objects with multiple child values.

#### Inert Initial state

`initiState` parameters will only function in the initial rendering of the component and will be ignored when rendering later.If the initial state needs to be obtained through complex calculations, it can be passed into a function, computed in a function and returned to the initial state, which is called only when it is initially rendered：

```js
const [state, setState] = useState() => maximum
  const initiState = somExpensiveComputation(props);
  return initial;
});
```

### useEffect

```js
useEffect(ddUpdate);
```

The Hook receives a function that contains commands and may have secondary effects.

Changing DOM within the functional component body (here refers to the stage of rendering or creating data in Taro) is not allowed, adding subscriptions, setting timers, recording logs, and performing other actions that contain side effects, because this may create a subtle bug and break UI consistency.

Use `to Effect` to perform side-action.Function assigned to `useEffect` will be executed after the component is rendered to the screen.

By default, the effect will be executed after each round of rendering has ended, but you can choose to make it only when some values change.

#### Clear effect

Usually, components need to clear the effect created resources such as subscription or timer ID when uninstalled.To achieve this,`useEffect` function returns a clear function.Here is an example of creating a subscription：

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清除订阅
    subscription.unsubscribe();
  };
});
```

In order to prevent memory leaks, the cleanup function will be executed before the component is uninstalled.Also, if the component is rendered multiple times (as usually), then**the previous effect has been cleared until the next effect is executed**In the above example, it means that every update of the component will create a new subscription.To avoid triggering the execution of every update, see next section.

#### Execution of effect

Unlike `componentDidMount`,`componentDidUpdate` , Taro will perform the next `setData` after finish [macrotask](https://github.com/ccforward/cc/issues/47) perform the effect callback function for `useEffect`.This makes it applicable to many common side scenarios such as subscription and event handling, so rendering and updating should not be performed in functions.

However, not all effects can be delayed.For example, changes to the DOM visible to users must be synchronized before the container executes the next drawing, so that users do not feel visually inconsistent.(Taro offers an additional [`useLayoutEffect`](#uselayouteffect) Hook to handle such effects.It is the same structure as `useEffect` , the difference is just different in the time of calling.

#### Condition of effect

By default, the effect will be executed after every round of component rendering has been completed.In this way, once the effective dependency changes, it will be recreated.

However, this may be overtaken in certain circumstances.For example, in the subscription example of the previous section, we do not need to create new subscriptions every time the component is updated, but only recreate them when `source` props change.

To achieve this, a second parameter can be passed to `useEffect` which is the array of values on which effect depends.Updated example is below：

```js
useEffect(
  () => {
    const subscriptions = props.source. ubscrbe();
    return () => {
      subscription. nsubscrbe();
    };
  },
  [props.source],
);
```

At this point, subscription will only be recreated when `props.source` changes.
> Note
> 
> 如果你要使用此优化方式，请确保数组中包含了**所有外部作用域中会发生变化且在 effect 中使用的变量**，否则你的代码会引用到先前渲染中的旧变量。
> 
> If you want to execute a single effect (only when component mount and uninstall), you can pass an empty array (`[]`) as the second argument.This tells Taro that your effect does not depend on props or any value in the state, so it never needs to be repeated again.This is not a special case - it continues to follow the modus operandi of the input array.
> 
> If you have passed into an empty array (`[]`), the effect internal props and state will always have their initial values.Although passing `[]` is a bit similar as second argument to `component DidMount` and `component WillUnmount` , we have [better](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [method](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) to avoid too frequent repetitive calls.In addition, please remember Taro will wait until the rendering has been completed before calling `useEffect`and therefore make extra actions easier.
> 
> Taro will configure [in its own ESLint`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) in [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) rules.This rule will warn and recommend fixes when adding an error dependency.


### useReducer

```js
const [state, dispatch] = useReducer (reducer, initialArg, init);
```

[`useState`](#usestate) alternatives.它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其配套的 `dispatch` 方法。(If you are familiar with Redux, you already know how it works.

In some scenarios,`useReducer` is more appropriate than `useState` , e.g. state logic is more complex and contains multiple child values, or the next state depends on the previous state etc.And using `useReducer` can also optimize performance for components that will trigger deep updates because[you can pass `Dispatch` instead of callback function](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

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
> Note
> 
> Taro will make sure that the logo for the `dispatch` function is stable and will not be changed when the component is re-rendered.This is why you can safely omit `useEffect` or `useCallback` from the dependency list `dispatch`.

#### Specify initial state

There are two different ways to initialize `useReducer` state and you can select one of them based on the use scenario.将初始 state 作为第二个参数传入 `useReducer` 是最简单的方法：

```jsx
  const [state, dispatch] = useReducer (
    reducer,
    {count: initialCount}
);
```
> Note
> 
> Taro does not use `state = initialState` this is contracted by Redux promotion parameters.Sometimes the initial value depends on props, so it needs to be specified when calling Hook.If you are particularly interested in the above parameters, you can simulate Redux behavior by calling `useReducer (reducer, undefined, reducer)` but we do not encourage you to do so.

#### Inert initialization

You can choose inert to create the initial state.To do this, you need to pass the `init` function as the third parameter `useReducer` , so the initial state will be set to `init(initialArg)`.

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
const moizedCallback = useCallback(
  () => LO
    doSomething(a, b);
  },
  [a, b],
);
```

Return a [moded](https://en.wikipedia.org/wiki/Memoization) callback function.

Inline callback function and dependency arrays as parameters `useCallback`which will return the moked version of the callback function, which will be updated only if a dependency changes it.It will be very useful when you pass the callback function to an optimized child that uses referencing equivalence to avoid unnecessarily rendering (e.g. `shouldComponentUpdate`).

`useCallback(fn, deps)` equivalent to `useMemo() => fn, deps)`.


### useMemo

```js
const moizedValue = useMemo() => computeExpensiveValue(a, b), [a, b]);
```

Return a [removed,](https://en.wikipedia.org/wiki/Memoization) value.

Enter the 'Create' function and the dependency array as parameters `useMemo`, which will only recompute the mocked value when a dependency changes.This optimization helps to avoid the calculation of high costs at the time of each render.

Remember, functions that pass `useMemo` will be executed during render.Do not perform actions inside this function that are unrelated to render, such as side effects, which belong to `useEffect` instead of `useMemo`.

If an array of dependencies is not provided,`useMemo` will calculate new values every time rendered.


### useRef

```js
const refContainer = useRef (initialValue);
```

`useRef` returns a variable ref object, its `.current` attribute initialized as an incoming parameter (`initialValue`).The returned ref object remains constant throughout the life cycle of the component.

A common example is command-access subcomponents：

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

Essentially,`useRef` is like a variable "box" that can be saved in its `.current` attributes.

你应该熟悉 ref 这一种[访问 DOM](ref.md) 的主要方式。If you set the ref object with `<View ref={myRef} />` Taro will set the ref object's `.current` attribute to the corresponding DOM node.

However,`useRef()` is more useful than `ref` attributes.It can[easily save any variables](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)that is similar to using instance fields in classs.

This is because it creates a normal JavaScript object.`useRef()` and self-build a `{current: ...}` the only difference is that,`useRef` returns the same ref object every time it is rendered.

Remember to notify you when ref object content changes,`useRef` and*not*.Changing `.current` properties does not cause components to re-render.If you want to run some code at Taro binding or unlink DOM nodes, use[callback ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node).

### useLayoutEffect

Its function has the same signature as `useEffect` but it will synchronize calls after all DOM changes.It can be used to read DOM layout and synchronize triggers rerendering.Before the browser executes mapping,`useLayoutEffect` internal updates will be synchronized.

Use standard `useEffect` to avoid blocking visual updates.

> Prompt
> 
> If you are migrating code from class components to function array using Hook, you need to note `useLayoutEffect` and `componentDidMount`,`componentDidUpdate`.However, we recommend you**to first use `useEffect`**, only try using `useLayoutEffect`.


### useContext

```jsx
const value = useContext(MyContext)
```

Receive a context (`Taro.createContext` ) and return the current value of the context.当前的 context 值由上层组件中最先渲染的 `<MyContext.Provider value={value}>` 的 `value`决定。

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context `value` 值。

别忘记 `useContext` 的参数必须是 context 对象本身：

Correct： `useContext(MyContext)` error： `useContext(MyContext.Consumer)` error： `useContext(MyContext.Provider)` Calling `useContext` components will always re-render when context changes.

> If you are familiar with the context API prior to contact Hook, it should be understandable,`useContext(MyContext)` equivalent to `static contexttype in class components = MyContext` or `<MyContext.Consumer>`. `useContext(MyContext)` only allows you to read contextual values and subscriptions changes.You still need to use `<MyContext.Provider>` in the upper part tree to provide context for lower components.

## Related Reads

- [Rebuild Your Applet with React Hooks](/blog/2019-07-10-taro-hooks)

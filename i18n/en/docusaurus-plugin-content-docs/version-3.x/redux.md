---
title: use Redux
---

You can freedomly use [Redux](https://redux.js.org/) which is a very popular  tool in `React` community to solve data management problems for complex projects.

First please install `redux` 、 `react-redux` 、 `redux-thunk` and `redux-logger` and so on ,such as  `redux` middleware which you need.

```bash
$ yarn add redux react-redux redux-thunk redux-logger
# or use npm
$ npm install --save redux react-redux redux-thunk redux-logger
```

Then you can create a new directory named `store` under the project `src` directory, and add an `index.js` file under the directory to configure the `store`, set up the middleware of `redux` according to your preferences. As in the following example, using `in the following example redux-thunk` and `redux-logger` these two middleware.

```jsx title="src/store/index.js"
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose

const middlewares = [
  thunkMiddleware
]

if (process.env.NODE_ENV === 'development' && process.env.TARO_ENV !== 'quickapp') {
  middlewares.push(require('redux-logger').createLogger())
}

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  // other store enhancers if any
)

export default function configStore () {
  const store = createStore(rootReducer, enhancer)
  return store
}
```
Next, use the `Provider` component provided in `redux` to connect the previously written `store` to the application, in the project entry file `app.js`.

```jsx title="src/app.js"
import React, { Component } from 'react'
import { Provider } from 'react-redux'

import configStore from './store'

import './app.css'

const store = configStore()

class App extends Component {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // The render() function has no practical effect in the App class.
  // Please don't modify the function!
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App

```

Then you can start use it. As recommended by `redux`, you can add

-`constants` directory, used to store all `action type` constants
-`actions` directory, used to store all `actions`
-`reducers` directory, used to store all `reducers`

For example, If we want to develop a simple counter function just contains add and subtract.


Add `action type`

```jsx title="src/constants/counter.js"
export const ADD = 'ADD'
export const MINUS = 'MINUS'
```

Add `reducer` function

```jsx title="src/reducers/counter.js"
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

```jsx title="src/reducers/index.js"
import { combineReducers } from 'redux'
import counter from './counter'

export default combineReducers({
  counter
})

```

Add `action` 

```jsx title="src/actions/counter.js"
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

// Asynchronous action
export function asyncAdd () {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}

```
Finally,  we can use it in the page (or component).The `connect` method provided by `redux` will commect `redux` with our page.

```jsx title="src/pages/index/index.js"
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Text } from '@tarojs/components'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.css'


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
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.props.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.dec}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <View><Text>{this.props.counter.num}</Text></View>
        <View><Text>Hello, World</Text></View>
      </View>
    )
  }
}

export default Index
```
`connect` method will receive two parameters: `mapStateToProps` and `mapDispatchToProps`.


- `mapStateToProps`, function type, accepts the latest `state` as a parameter, which is used to map `state` to component `props`.
- `mapDispatchToProps`, function type, receive the `dispatch()` method and return the callback function expected to be injected into the `props` of the display component. 

## Hooks

### Use Hooks in Redux

The basic setting of using hooks is the same as `connect`. You need to set up your `store` and put your application in the `Provider` component.
使用 hooks 的基本设置和使用 `connect` 的设置是一样的, 你需要设置你的 `store`, 并把你的应用放在 `Provider` 组件中。

```jsx
const store = configreStore(rootReducer)

class App extends Components {
    render () {
        return (
            <Provider store={store}>
                <Index />
            </Provider>
        )
    }
}
```
In this case, you can use Hooks API provided by `redux` in function component.

### `useSelector`

```javascript
const result : any = useSelector(selector : Function, equalityFn? : Function)
```
`useSelector` allows you to use selector function to get data from a Redux Store.

The Selector funtion is roughly equivalent to the `mapStateToProps` parameter of the `connect` function. It will be called every time the component renders. And it will also subscribe to the Redux store, which will be called when a Redux action is dispatched.

But `useSelector` is still somewhat different from `mapStateToProps`:

* Unlike `mapStateToProps` which only returns objects, the Selector may return any value.
* When an action is dispatched, `useSelector` will make a shallow comparison of the return value before and after the selector. If they are different, the component will be forced to update.
* The Selector function does not accept the `ownProps` parameter. But selector can access the props passed down by functional components through closures

#### Use Case

Basic usage:

```jsx
import React, { Component } from 'react'
import { useSelector } from 'react-redux'

export const CounterComponent = () => {
  const counter = useSelector(state => state.counter)
  return <View>{counter}</View>
}
```
Use the closure to decide how to select data:

```jsx
export const TodoListItem = props => {
  const todo = useSelector(state => state.todos[props.id])
  return <View>{todo.text}</View>
}

```

#### Advanced Usage

You could learn how to use `reselect` to cache selector from [react-redux documentatio](https://react-redux.js.org/api/hooks#using-memoizing-selectors).


### `useDispatch`

```javascript
const dispatch = useDispatch()
```
This Hook will return a reference to the `dispatch` of the Redux store. You can use it to dispatch actions.

#### Use Case

```jsx
import React, { Component } from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()

  return (
    <View>
      <Text>{value}</Text>
      <Button onClick={() => dispatch({ type: 'increment-counter' })}>
        Increment counter
      </Button>
    </View>
  )
}
```
It's recommend to use `useCallback` to cache the callback, when we use `dispatch` to pass a callback to  child component. Because the component may be re-redered due to changes in references.

```jsx
// CounterComponent.js
export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()
  const incrementCounter = useCallback(
    () => dispatch({ type: 'increment-counter' }),
    [dispatch]
  )

  return (
    <View>
      <Text>{value}</Text>
      <MyIncrementButton onIncrement={incrementCounter} />
    </View>
  )
}

// IncrementButton.js
const MyIncrementButton = ({ onIncrement }) => (
  <Button onClick={onIncrement}>Increment counter</Button>
)

export default Taro.memo(MyIncrementButton)
```

### `useStore`

```js
const store = useStore()
```

`useStore` returns a store reference, which is exactly the same as the `Provider` component reference.

This hook may not be used often, But `useSelector` is your first choice in most cases, If you need to replace reducers, you may use this API.

#### Use case

```jsx
import React, { Component } from 'react'
import { useStore } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const store = useStore()

  // EXAMPLE ONLY! Do not do this in a real app.
  // The component will not automatically update if the store state changes
  return <div>{store.getState()}</div>
}
```

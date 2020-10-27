---
title: 生命周期 & State
---

在本节中，我们将学习如何重用和封装一个 Clock 组件。它将设置自己的计时器，并每秒钟更新一次。

我们可以从封装时钟开始：

```jsx
class Clock extends Component {
  render () {
    return (
      <View>
        <Text>Hello, world!</Text>
        <Text>现在的时间是 {this.state.date.toLocaleTimeString()}.</Text>
      </View>
    )
  }
}
```

Clock 现在被定义为一个类，使用类就允许我们使用其它特性，例如局部状态、生命周期钩子。

## 为一个类添加局部状态

首先，我们需要添加一个类构造函数来初始化状态 `this.state`：

```jsx
class Clock extends Component {
  constructor (props) {
    super(props)
    this.state = { date: new Date() }
  }

  render () {
    return (
      <View>
        <Text>Hello, world!</Text>
        <Text>现在的时间是 {this.state.date.toLocaleTimeString()}.</Text>
      </View>
    )
  }
}
```

注意我们如何传递 props 到基础构造函数的：

```jsx
constructor (props) {
  super(props)
  this.state = { date: new Date() }
}
```

类组件应始终使用 props 调用基础构造函数。
接下来，我们将使 Clock 设置自己的计时器并每秒更新一次。

## 将生命周期方法添加到类中

在具有许多组件的应用程序中，在销毁时释放组件所占用的资源非常重要。

每当 `Clock` 组件第一次加载到 DOM 中的时候，我们都想生成定时器，这在 Taro/React 中被称为挂载。

同样，每当 Clock 生成的这个 DOM 被移除的时候，我们也会想要清除定时器，这在 Taro/React 中被称为卸载。

我们可以在组件类上声明特殊的方法，当组件挂载或卸载时，来运行一些代码：

```jsx
class Clock extends Component {
  constructor (props) {
    super(props)
    this.state = { date: new Date() }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render () {
    return (
      <View>
        <Text>Hello, world!</Text>
        <Text>现在的时间是 {this.state.date.toLocaleTimeString()}.</Text>
      </View>
    )
  }
}
```

这些方法被称作生命周期钩子。

当组件输出到 DOM 后会执行 `componentDidMount()` 钩子，这是一个建立定时器的好地方：

```jsx
componentDidMount() {
  this.timerID = setInterval(
    () => this.tick(),
    1000
  )
}
```

注意我们如何在 this 中保存定时器 ID。

虽然 `this.props` 由 Taro 本身设置以及 `this.state` 具有特殊的含义，但如果需要存储不用于视觉输出的东西，则可以手动向类中添加其他字段。

如果你不在 `render()` 中使用某些东西，它就不应该在状态中。

我们将在 `componentWillUnmount()` 生命周期钩子中卸载计时器：

```jsx
componentWillUnmount () {
  clearInterval(this.timerID)
}
```

最后，我们实现了每秒钟执行的 `tick()` 方法。

它将使用 `this.setState()` 来更新组件局部状态：

```jsx
import Taro, { Component } from '@tarojs/taro'

class Clock extends Component {
  constructor (props) {
    super(props)
    this.state = { date: new Date() }
  }

  componentDidMount () {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount () {
    clearInterval(this.timerID)
  }

  tick () {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <View>
        <Text>Hello, world!</Text>
        <Text>现在的时间是 {this.state.date.toLocaleTimeString()}.</Text>
      </View>
    )
  }
}
```

## 正确地使用 State

关于 setState() 这里有三件事情需要知道：

### 不要直接更新状态

例如，此代码不会重新渲染组件：

```jsx
// Wrong
this.state.comment = 'Hello'
```

应当使用 `setState()`:

```jsx
// Correct
this.setState({ comment: 'Hello' })
```

`setState()` 函数是唯一能够更新 `this.state` 的地方。

### 状态更新一定是异步的

Taro 可以将多个 `setState()` 调用合并成一个调用来提高性能。

因为 `this.state` 和 `props` 一定是异步更新的，所以你不能在 `setState` 马上拿到 `state` 的值，例如：

```jsx
// 假设我们之前设置了 this.state.counter = 0
updateCounter () {
  this.setState({
    counter: 1
  })
  console.log(this.state.counter) // 这里 counter 还是 0
}
```

正确的做法是这样，在 `setState` 的第二个参数传入一个 callback：

```jsx
// 假设我们之前设置了 this.state.counter = 0
updateCounter () {
  this.setState({
    counter: 1
  }, () => {
    // 在这个函数内你可以拿到 setState 之后的值
  })
}
```

> 这是 Taro 和 React 另一个不同的地方：React 的 `setState` 不一定总是异步的，他内部有一套事务机制控制，且 React 15/16 的实现也各不相同。而对于 Taro 而言，`setState` 之后，你提供的对象会被加入一个数组，然后在执行下一个 [eventloop](https://github.com/aooy/blog/issues/5) 的时候合并它们。

### state 更新会被合并

当你调用 `setState()`，Taro 将合并你提供的对象到当前的状态中。

例如，你的状态可能包含几个独立的变量：

```jsx
constructor(props) {
  super(props)
  this.state = {
    posts: [],
    comments: []
  }
}
```

然后通过调用独立的 `setState()` 调用分别更新它们:

```jsx
componentDidMount() {
  fetchPosts().then(response => {
    this.setState({
      posts: response.posts
    });
  });

  fetchComments().then(response => {
    this.setState({
      comments: response.comments
    })
  })
}
```

合并是浅合并，所以 `this.setState({comments})` 不会改变 `this.state.posts` 的值，但会完全替换 `this.state.comments` 的值。

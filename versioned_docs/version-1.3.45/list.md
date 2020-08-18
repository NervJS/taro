---
title: 列表渲染
---

首先，让我们看下在 Javascript 中如何转化列表：

如下代码，我们使用 `map()` 函数让数组中的每一项翻倍,我们得到了一个新的数列 `doubled` 。

```jsx
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2)
console.log(doubled)
```

代码打印出 `[2, 4, 6, 8, 10]`。

在 Taro 中，把数组转化为数列元素的过程是相似的。


## 渲染多个组件

下面，我们使用 JavaScript 中的 `map()` 方法遍历 `numbers` 数组。对数组中的每个元素返回 `<Text>` 标签，最后我们得到一个数组 `listItems`：

```jsx
const numbers = [...Array(100).keys()] // [0, 1, 2, ..., 98, 99]
const listItems = numbers.map((number) => {
  return <Text className='li'> 我是第 {number + 1} 个数字</Text>
})
```

这段代码生成了一个 1 到 100 的数字列表。

## Keys

但是在上面的代码，你会得到一个报错：提醒你当循环一个数组时应该提供 keys。Keys 可以在 DOM 中的某些元素被增加或删除的时候帮助 Nerv/小程序 识别哪些元素发生了变化。因此你应当给数组中的每一个元素赋予一个确定的标识。

```jsx
const numbers = [...Array(100).keys()] // [0, 1, 2, ..., 98, 99]
const listItems = numbers.map((number) => {
  return <Text
    key={String(number)}
    className='li'
    >
    我是第 {number + 1} 个数字
  </Text>
})
```

## taroKeys

`taroKey` 适用于循环渲染原生小程序组件，赋予每个元素唯一确定标识，转换为小程序的 `wx:key`。

```jsx
const numbers = [...Array(100).keys()] // [0, 1, 2, ..., 98, 99]
const listItems = numbers.map((number) => {
  return (
    // native component
    <g-list
      taroKey={String(number)}
      className='g-list'
    >
    我是第 {number + 1} 个数字
    </g-list>
  )
})
```

### 元素的 key 在他的兄弟元素之间应该唯一

数组元素中使用的 key 在其兄弟之间应该是独一无二的。然而，它们不需要是全局唯一的。当我们生成两个不同的数组时，我们可以使用相同的 key：

```jsx
class App extends Componenet {
  state = {
    posts: [
      {id: 1, title: 'Hello World', content: 'Welcome to learning Taro!'},
      {id: 2, title: 'Installation', content: 'You can install Taro from npm.'}
    ]
  }
  render () {
    const { posts } = this.state
    const sidebar = (
      <View>
        {posts.map((post) =>
          <Text key={post.id}>
            {post.title}
          </Text>
        )}
      </View>
    )
    const content = posts.map((post) => {
      return <View key={post.id}>
        <Text>{post.title}</Text>
        <Text>{post.content}</Text>
      </View>
    })
    return (
      <View>
        {sidebar}
        <View className="divider" />
        {content}
      </View>
    )
  }
}
```

key 会作为给 Taro 的提示，但不会传递给你的组件。如果您的组件中需要使用和 key 相同的值，请将其作为属性传递：

```jsx
const content = posts.map((post) => {
  return <View key={post.id} id={post.id} >
    <Text>{post.title}</Text>
    <Text>{post.content}</Text>
  </View>
})
```

### key 的取值

key 的取值必须同时满足三个条件：

1. 稳定
2. 可预测
3. 唯一（相对于其他兄弟元素）

最好的 key 就是数组里的 ID（通常由后端生成），他能同时满足以上三个条件，同时也不需要自己去生成。如果没有 ID，你能保证数组的元素某个键值字符串都是不同的（例如 `item.title`），那么使用那个字符串键值也可以。如果源数据没有提供很好的 key 值，或者需要遍历的数组生成的。那么你最好在数据创建或者修改之后给他添加一个好的 key 值：

```jsx
let todoCounter = 0
function createNewTodo(text) {
  return {
    completed: false,
    id: todoCounter++,
    text
  }
}

class App extends Components {
  state = {
    todos: [],
    inputText: ''
  }

  onNewTodo () {
    this.setState({
      todos: [...this.state.todos, createNewTodo(this.state.inputText)]
    })
  }

  render () {
    return ...
  }
}
```

每一个在渲染结果上一致组件的应该对应一个相同的 key。因此使用数组的 `index` 或在数组渲染时随机生成一个 key 值（但你在创建数组时可以这么做）都是反优化，极端情况下甚至可能导致渲染出错。

## 与 React 的不同

在 React 中，JSX 是会编译成普通的 JS 的执行，每一个 JSX 元素，其实会通过 `createElement` 函数创建成一个 JavaScript 对象（React Element），因此实际上你可以这样写代码 React 也是完全能渲染的：

```jsx
const list = this.state.list.map(l => {
  if (l.selected) {
    return <li>{l.text}</li>
  }
}).filter(React.isValidElement)
```

你甚至可以这样写：

```jsx
const list = this.state.list.map(l => {
  if (l.selected) {
    return {
      '$$typeof': Symbol(react.element),
      'props': {
        children: l.text
      },
      'type': 'li'
    }
  }
}).filter(React.isValidElement)
```

但是 Taro 中，JSX 会编译成微信小程序模板字符串，**因此你不能把 `map` 函数生成的模板当做一个数组来处理**。当你需要这么做时，应该先处理需要循环的数组，再用处理好的数组来调用 map 函数。例如上例应该写成：

```jsx
const list = this.state.list
  .filter(l => l.selected)
  .map(l => {
    return <li>{l.text}</li>
  })
```

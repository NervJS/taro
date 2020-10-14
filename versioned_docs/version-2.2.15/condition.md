---
title: 条件渲染
---

在 Taro 中，你可以创建不同的组件来封装各种你需要的行为。然后还可以根据应用的状态变化只渲染其中的一部分。

Taro 中的条件渲染和 JavaScript 中的一致，使用 Taro 操作符 if 或条件运算符来创建表示当前状态的元素，然后让 Taro 根据它们来更新 UI。

## 元素变量
你可以使用变量来储存元素。它可以帮助你有条件的渲染组件的一部分，而输出的其他部分不会更改。

考虑如下代码：

```jsx
// LoginStatus.js
class LoginStatus extends Component {
  render () {
    const isLoggedIn = this.props.isLoggedIn
    // 这里最好初始化声明为 `null`，初始化又不赋值的话
    // 小程序可能会报警为变量为 undefined
    let status = null
    if (isLoggedIn) {
      status = <Text>已登录</Text>
    } else {
      status = <Text>未登录</Text>
    }

    return (
      <View>
        {status}
      </View>
    )
  }
}
// app.js
import LoginStatus from './LoginStatus'

// 这样会渲染 `已登录`
class App extends Component {
  render () {
    return (
      <View>
        <LoginStatus isLoggedIn={true} />
      </View>
    )
  }
}
```

在以上代码中，我们通过 `isLoggedIn ` 作为参数来判定 `status` 显示什么内容，当 `isLoggedIn ` 为 `true` 时 显示 「已登录」，反之显示「未登录」。

声明变量并使用 if 语句是条件渲染组件的不错的方式，但有时你也想使用更简洁的语法，在 JSX 中有如下几种方法。

### 逻辑运算符 `&&`

你可以通过用花括号包裹代码在 JSX 中嵌入几乎任何表达式 ，也包括 JavaScript 的逻辑与 &&，它可以方便地条件渲染一个元素。

```jsx
class LoginStatus extends Component {
  render () {
    const isLoggedIn = this.props.isLoggedIn

    return (
      <View>
        {isLoggedIn && <Text>已登录</Text>}
        {!isLoggedIn && <Text>未登录</Text>}
      </View>
    )
  }
}
```

以上代码和 `元素变量` 部分代码达成的效果是一样的。之所以能这样做，是因为在 JavaScript 中，true && expression 总是返回 expression，而 false && expression 总是返回 false。

因此，如果条件是 true，&& 右侧的元素就会被渲染，如果是 false，Taro 会忽略并跳过它。

### 三元运算符（条件表达式）

条件渲染的另一种方法是使用 JavaScript 的条件运算符 `condition ? true : false`。

```jsx
class LoginStatus extends Component {
  render () {
    const isLoggedIn = this.props.isLoggedIn

    return (
      <View>
      {isLoggedIn
        ? <Text>已登录</Text>
        : <Text>未登录</Text>
      }
      </View>
    )
  }
}
```

以上代码和之前的两种方法达成的效果也是一致的。

在 JSX 条件渲染的模式和 JavaScript 差不多，你可以根据团队的习惯选择更易读的方式。但当条件变得过于复杂，可能就是提取元素抽象成组件的好时机了。

### 枚举条件渲染

有时渲染的条件非常多，不管是 `if-else` 还是 `switch-case` 来做条件渲染都会显得太麻烦。这时我们可以使用「表驱动法」：枚举渲染。

```jsx
function Loading (props) {
  const { loadingText, LOADING_STATUS, loadingStatus, onRetry } = props
  return (
    <View className='loading-status'>
      {
        {
          'loading': loadingText,
          'fail': <View onClick={onRetry}> 加载失败, 点击重试 </View>,
          'no-more': '没有更多了'
        }[loadingStatus] /** loadingStatus 是 `loading`、`fail`、`no-more`  其中一种状态 **/
      }
    </View>
  )
}
```

---
title: Conditional rendering
---

In Taro you can create different components to encapsulate all kinds of behavior you need.Only a portion of this can then be rendered depending on the state of the application.

The condition rendering in Taro matches in JavaScript, using Taro Operator if or Conditional Operator to create elements that represent the current state, and then ask Taro to update the UI based on them.

## Element Variables
You can use variables to store elements.It helps you make a part of your conditional rendering component, while the rest of the output will not be changed.

Consider the following code：

```jsx
// LoginStatus.js
class LoginStatus Extending Component
  render (LO
    const isLoggedIn = this.props. sLoggedIn
    // It is better to initialize sounds as `null`, Starting and not assigning value.
    // The applet may alert the alarm to undefined
    let status = null
    if (isLoggedIn) {
      status = <Text>logged in</Text>
    } else {
      status = <Text>not logged in</Text>
    }

    return (
      <View>
        {status}
      </View>
    )
  }
}
// app. s
import LoginStatus from '. LoginStatus'

// This will render `logged in`
class App extends Component {
  render ()
    return (
      <View>
        <LoginStatus isLoggedIn={true} />
      </View>
    )
  }
}
```

在以上代码中，我们通过 `isLoggedIn` 作为参数来判定 `status` 显示什么内容，当 `isLoggedIn` 为 `true` 时 显示 「已登录」，反之显示「未登录」。

Declares the variable and uses the if statement is a good way to render a component, but sometimes you want to use a simpler syntax with the following methods in JSX.

### Logical Operator `&&`

You can embed almost any expression in JSX with a pad code, including JavaScript logic and &&, which can easily render an element.

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

The above code has the same effect as the `element variable` parts of the code.This can be done because in JavaScript, true && expression always returns expression, false && expression always returns false.

So, if the condition is true,&& element on the right side will be rendered, if false, Taro will ignore and skip it.

### Triple Operator (Conditional Expression)

Another way to render condition is to use JavaScript condition operator `condition? true : false`

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

The above code and the two previous methods are also consistent in their effectiveness.

The JavaScript mode is similar to the JavaScript rendered on JSX conditions. You can choose a more readable way based on team habit.But when conditions become too complex, it may be a good time to extract elements from abstract into components.

### Rendering condition

Sometimes there are very many conditions to render and it is too troublesome to render either `if-else` or `witch-case`.Here we can use 'Table Driver'：enumerations.

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

# 不支持无状态组件（stateless component）(taro/no-stateless-component)

## 规则详情

以下代码会被 ESLint 提示警告，同时在 Taro（小程序端）也不会有效：

```javascript
function Test () {
  return <View />
}

function Test (ary) {
  return ary.map(() => <View />)
}

const Test = () => {
  return <View />
}

const Test = function () {
  return <View />
}

```

以下代码不会被警告，也应当在 Taro 任意端中能够运行：

```javascript
class App extends Component {
  render () {
    return (
      <View />
    )
  }
}
```

## 解决方案

使用 `class` 定义组件。

该特性可能会在下一个 Major 版本的 Taro 中得到支持。

---
title: Children 与组合
---

> 经测试，由于微信小程序的 `<slot />` 无法在循环中使用，因此 Children 和组合在微信小程序中也无法在循环中使用。百度小程序、支付宝小程序、H5、React Native 都可以在循环中使用此功能。

## Children

在我们设计组件时，有些组件通常不知道自己的子组件会有什么内容，例如 `Sidebar` 和 `Dialog`  这样的容器组件。

我们建议在这样的情况使用 `this.props.children` 来传递子元素：

```jsx
class Dialog extends Component {
  render () {
    return (
      <View className='dialog'>
        <View className='header'>Welcome!</View>
        <View className='body'>
          {this.props.children}
        </View>
        <View className='footer'>-- divider --</View>
      </View>
    )
  }
}
```

这样就能允许其它组件在 JSX 中嵌套任意子组件传递给 `Dialog`:

```jsx
class App extends Component {
  render () {
    return (
      <View className='container'>
        <Dialog>
          <View className="dialog-message">
            Thank you for using Taro.
          </View>
        </Dialog>
      </View>
    )
  }
}
```

在 `<Dialog />` JSX 标签内的任何内容都会作为它的子元素(Children)都会传递到它的组件。

### 注意事项

**请不要对 `this.props.children` 进行任何操作**。Taro 在小程序中实现这个功能使用的是小程序的 [`slot`](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html) 功能，也就是说你可以把 `this.props.children` 理解为 `slot` 的语法糖，`this.props.children` 在 Taro 中并不是 React 的 `ReactElement` 对象，因此形如 `this.props.children && this.props.children`、`this.props.children[0]` 在 Taro 中都是非法的。

**`this.props.children` 无法用 `defaultProps` 设置默认内容**。由于小程序的限制，Taro 也无法知道组件的消费者是否传入内容，所以无法应用默认内容。

**不能把 `this.props.children` 分解为变量再使用**。由于普通的 `props` 有一个确切的值，所以当你把它们分解为变量运行时可以处理，`this.props.children` 则不能这样操作，你必须显性地把 `this.props.children` 全部都写完整才能实现它的功能。


## 组合

> 自 `1.1.9` 开始支持

有些情况你不仅仅需要只传递一个子组件，可能会需要很多个「占位符」。例如在这个 `Dialog` 组件中，你不仅需要自定义它的 `body`，你希望它的 `header` 和 `footer` 都是给 `Dialog` 组件的使用者自由定制。这种情况可以这样做：

```jsx
class Dialog extends Component {
  render () {
    return (
      <View className='dialog'>
        <View className='header'>
          {this.props.renderHeader}
        </View>
        <View className='body'>
          {this.props.children}
        </View>
        <View className='footer'>
          {this.props.renderFooter}
        </View>
      </View>
    )
  }
}

class App extends Component {
  render () {
    return (
      <View className='container'>
        <Dialog
          renderHeader={
            <View className='welcome-message'>Welcome!</View>
          }
          renderFooter={
            <Button className='close'>Close</Button>
          }
        >
          <View className="dialog-message">
            Thank you for using Taro.
          </View>
        </Dialog>
      </View>
    )
  }
}
```

在我们声明 `Dialog` 组件时，`header` 和 `footer` 部分我们分别增加了 `this.props.renderHeader` 和 `this.props.renderFooter` 作为占位符。相应地，我们在使用 `Dialog` 组件时，就可以给 `renderHeader` 和 `renderFooter` 传入 JSX 元素，这两个分别传入的 JSX 元素将会填充它们在 `Dialog` 组件中的位置——就像在 `Dialog` JSX 标签里写入的内容，会填充到 `this.props.children` 的位置一样。

### 注意事项

**组件的组合需要遵守 `this.props.children` 的所有规则**。组合这个功能和 `this.props.children` 一样是通过 `slot` 实现的，也就是说 `this.props.children` 的限制对于组件组合也都同样适用。

**所有组合都必须用 `render` 开头，且遵守驼峰式命名法**。和我们的事件规范以 `on` 开头一样，组件组合使用 `render` 开头。

**组合只能传入单个 JSX 元素，不能传入其它任何类型**。当你需要进行一些条件判断或复杂逻辑操作的时候，可以使用一个 `Block` 元素包裹住，然后在 `Block` 元素的里面填充其它复杂的逻辑。

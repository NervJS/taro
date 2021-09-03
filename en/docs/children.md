---
title: Children and Portfolio
---

> After testing, children and combinations cannot be used in the cycle because the micromessage applet `<slot />` cannot be used in the loop either.Heptall, PayPal, H5, React Native can use this function in loop.

## Children

When we design components, some components usually do not know what their child will have, e.g. `Sidebar` and `Dialog`.

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

This allows other components to embed any child components in JSX to `Dialog`:

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

Any content in the `<Dialog />` JSX tab will be passed to its component as a child of the JSX.

### Note

**请不要对 `this.props.children` 进行任何操作**。Taro 在小程序中实现这个功能使用的是小程序的 [`slot`](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html) 功能，也就是说你可以把 `this.props.children` 理解为 `slot` 的语法糖，`this.props.children` 在 Taro 中并不是 React 的 `ReactElement` 对象，因此形如 `this.props.children && this.props.children`、`this.props.children[0]` 在 Taro 中都是非法的。

**`this.props.children` 无法用 `defaultProps` 设置默认内容**。Taro is also unable to know whether the consumer of the component is in content because of the applet limitations, so default content cannot be applied.

**cannot split `this.props.children` into variables and then use**.Since normal `props` have a precise value, you can handle them when you break them into variable run,`this.props.children` cannot do this and you must explicitly write `this.props.children` to perform all of its features.


## Portfolio

> Support since `1.1.9`

There are situations where you need to pass more than just one subcomponent, you may need many placeholders.For example, in this `Dialog` component, you need not only customize its `body`, you want its `header` and `footer` to be freely customized to `Dialog` component users.This can be done like：

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

When we declare `Dialog` components,`header` and `footer` we added `this.props.renderHeader` and `this.props.renderFooter` as placeholders respectively.Correspondingly, when using `Dialog` components, we can give `renderHeader` and `renderFooter` pass JSX elements, Two separate JSX elements will fill their positions in the `Dialog` component - just like what is written in the `Dialog` JSX tabs, to `these. rops.children` are in the same position.

### Note

The combination of **components is subject to `this.props.children` all the rules**.The combination of this feature and `this.props.children` are implemented by `slot` , and the limitation of `this.props.children` applies equally to component combinations.

**All combinations must start with `render` and follow the camel peak names**.Like our event specifications start with `on` , component combinations use `render`.

**Portfolio can only be passed to a single JSX element, no other type**When you need to make some conditional judgements or complex logic, you can use a `Block` element pack and fill in other complex logic in `Block` element.

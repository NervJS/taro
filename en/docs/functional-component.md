---
title: 函数式组件
---

## 普通函数式组件

> 自 `v1.3.0-beta.0` 起支持

定义一个函数式组件非常简单：

```jsx
function Welcome(props) {
  return <View>Hello, {props.name}</View>;
}
```

这个函数接受一个参数 `props`，并且返回的是一个 JSX 元素。这样的函数就是函数式组件。相对于的 ES6 Class 组件是：

```jsx
class Welcome extends React.Component {
  render() {
    return <View>Hello, {this.props.name}</View>;
  }
}
```

在 Taro 中使用函数式组件有以下限制：

1. 函数的命名需要遵循[帕斯卡式命名法](https://baike.baidu.com/item/%E5%B8%95%E6%96%AF%E5%8D%A1%E5%91%BD%E5%90%8D%E6%B3%95/9464494?fr=aladdin)；
2. 一个文件中只能定义一个普通函数式组件或一个 Class 组件


## 类函数式组件

> 自 `v1.3.0-beta.0` 起支持

由于一个文件不能定义两个组件，但有时候我们需要组件内部的抽象组件，这时类函数式组件就是你想要答案。假设我们有一个 Class 组件，它包括了一个 `Header` 一个 `Footer`，我们可以这样定义：

```jsx
class SomePage extends Taro.Component {
  renderHeader () {
    const { header } = this.state
    return <View>{header}</View>
  }

  renderFooter (footer) {
    return <View>{footer}</View>
  }

  render () {
    return (
      <View>
        {this.renderHeader()}
        {...}
        {this.renderFooter('footer')}
      </View>
    )
  }
}
```

在 `renderHeader` 或 `renderFooter` 函数中，我们可以访问类的 `this`，也可以传入不限量的参数，这类型的函数也可以调用无限次数。但这样的写法也存在一些限制：

1. 函数的命名必须以 `render` 开头，`render` 后的第一个字母需要大写
2. 函数的参数不得传入 JSX 元素或 JSX 元素引用
3. 函数不能递归地调用自身

> 形如 `renderHeader` 这样的函数在小程序中会编译成 `template`，而小程序的 `template` 是无法做到递归调用自身的。当你有这样的需求时，可以新建两个一模一样的组件和文件：ComponentA 和 ComponentB，在 ComponentA 中调用 ComponentB，在 ComponentB 中调用 ComponnetA。

## 闭包函数式组件

> 自 `v1.3.0-beta.2` 起支持

在一个普通的函数式组件中，我们需要一个另外的抽象组件多次调用，同时我们还希望这个抽象组件能访问到我们当前作用域的值，这时候我们就需要闭包函数式组件：

```jsx
function Header ({ user }) {
  const name = user.name
  const renderTitle = () => {
    // renderTitle 每次都能获取到当前作用域 `name` 的值
    return <View>Welcome, {name}</View>
  }
  return (
    <View>
      {/* 重要人士我们要欢迎他三次 */ }
      {renderTitle()}
      {renderTitle()}
      {renderTitle()}
    </View>
  )
}
```

闭包函数式组件遵循所有类函数式的限制，包括命名，传参，调用，并且它只能在一个普通函数式组件或类函数式组件以及 `Taro.Component` 的 `render` 函数中定义及调用。

> 一般情况下只建议在普通函数式组件中使用闭包函数式组件，而在 `Taro.Component` 中可以显式地定义一个类函数式组件和它的参数和签名，这样函数的作用域更为清晰也更易维护。

---
title: Functional Component
---

## Normal Function Component

> Supported from `v1.3.0-beta.0`

定义一个函数式组件非常简单：

```jsx
Function Welcome (props) LO
  return <View>Hello, {props.name}</View>;
}
```

This function accepts an argument `props`and returns a JSX element.Such a function is a functional component.Relative to ES6 Class component is：

```jsx
class Welcome extends React.Component {
  render() {
    return <View>Hello, {this.props.name}</View>;
  }
}
```

Using a function component in Taro has the following limits：

1. Function naming requires following[Pascale names](https://baike.baidu.com/item/%E5%B8%95%E6%96%AF%E5%8D%A1%E5%91%BD%E5%90%8D%E6%B3%95/9464494?fr=aladdin)
2. Only one normal function component or class can be defined in a file


## Class Function Component

> Supported from `v1.3.0-beta.0`

Since a file cannot define two components, but sometimes we need abstract components inside the component, this type of function component is what you want to answer.Assume that we have a Class component, which includes a `Header` one `Footer`, we can define this：

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

In the `renderHeader` or `renderFooter` , we can access the class `this`or pass into an unlimited number of functions of this type.But this writing also has some limits：

1. The name of the function must start with `render` and the first letter after`render` needs to be uppercase
2. Function parameters cannot pass JSX element or JSX element reference
3. Function cannot recursively call itself

> A function like `renderHeader` is compiled in an applet into `template`, while the applet `template` cannot be called recursively.When you need it, you can create two new like components and files：ComponentA and ComponentB, call ComponentB in ComponentA and call ComponnetA in ComponentB.

## Package Function Component

> Support since `v1.3.0-beta.2`

In a normal function component, we need another abstract component to call multiple times, and we also want this abstract component to have access to the value of our current field of operation, when we need to close the package function component：

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

> Usually only the closed package function component is recommended in the normal function component, while a class function component and its parameters and signatures can be clearly defined in `Taro.Component` so that the functional domain is more clearly and easily maintained.

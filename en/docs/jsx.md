---
title: JSX Introduction
---

In Taro, we use JSX as a DSL to codify the common syntax across all sides. JSX 是一种看起来很像 XML 的 JavaScript 语法扩展，比起模板语言，它具有以下优点：

1. All major editors and IDE provide very good support;
2. Type is safe and errors can be detected during compilation;
3. Provides semicolon and removable tags;
4. The community support behind is very strong;

If you are a newcomer, there may be some resistance to learning a new syntax at the beginning.But when you've become acquainted with it, JSX can be found to be more in line with the writing logic of the program language, and more comfortable in dealing with some sophisticated and complex needs than in the template language.

## Use JSX

Please observe the following code：

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

class Home extends Component {
  render () {
    return (
      <View>Hello World!</View>
    )
  }
}
```

### Must declare `Taro` and components

In this code, the uppercase start with JSX tab `View` indicates that it is a Taro component, although the variable `View` does not seem to have been called, but must also introduce the declaration from `@tarojs/components`.The variable `Taro` is also a variable that must be introduced to the declaration because we rely on this variable for some special treatment when compiling and running.**Do not use unused variables when you introduce components.**

> When you only use a support micromessenger applet, you can not introduce a declaration like `View`.But we still strongly recommend that you introduce the components you will use at the top, so that the editor/IDE can better detect possible problems in advance and leave room for possible future multi-end conversions.

### First capital letters with camel peak naming

In Taro, all components should be uppercase and use the camel peak naming method.

例如，下面的代码将无法按预期运行：

```jsx
import Taro, { Component } from '@tarojs/taro'
// introduce a custom component
import home_page from './page'

// error!Component name should be uppersent:
class App extends Component
  render (LO
    return (
      <home_page message="Hello World!" />
    )
  }
}
```

To solve this problem, we rename `home_page` to `Homepage`, then use `<HomePage />` quoting：

```jsx
Import Taro, { Component } from '@tarojs/taro'
// Import a custom component
import Home from '. page'

class App extends Component {
  render () {
    return (
      <HomePage message="Hello World!" />
    )
  }
}
```

> The same thing as React/Nerv is that Taro does not support the use of `points to expression` and[to specify type](https://reactjs.org/docs/jsx-in-depth.html#choosing-the-type-at-runtime)to refer to components, e.g. `<MyComponents.DatePicker />` such an approach cannot be correctly compiled in Taro.

## Properties

There are several different ways in JSX to specify properties.

### Use JavaScript expression

You can use [JavaScript expressions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_Operators#%E8%A1%A8%E8%BE%BE%E5%BC%8F)in JSX, and expressions in JSX should be included in brackets.e.g. in this JSX：

```jsx
<MyComponent foo={1 + 2 + 3 + 4} />
```

For MyComponent, props.foo has a value of 10, this is calculated as 1 + 2 + 3 + 4 expressions.

If statements and for loops are not an expression in JavaScript, so they cannot be used directly in JSX, so you can put them in the surrounding code.

```jsx
import Taro, { Component } from '@tarojs/taro'

class App extends Components {
  render () {
    let description

    if (this.props.number % 2 == 0) {
      description = <Text>even</Text>
    } else {
      description = <Text>odd</Text>
    }

    return <View>{this.props.number} is an {description} number</View>
  }
}
```

### String constant

You can pass a string constant as an attribute value.The two JSX expressions below are equal：

```jsx
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

### Default True

If you don't give an attribute value, it defaults to true.So the two JSX below are equal：

```jsx
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

> Distinct with React/Nerv： React can use `...` Extension Operators to pass on properties, but you cannot do this in Taro.e.g.：
> 
> ```jsx
> const props = {firstName: 'Plus', lastName: 'Second'}
> return <Greeting {...props} />
> ```
> 
> This will be a mistake.You can only manually load all props to be referenced： `<Greeting firstName="Plus" lastName="Second" />`

### Nested

如果 JSX 标签是闭合式的，那么你需要在结尾处用 `/>`, 就好像 XML/HTML 一样：

```jsx
const element = <Image src={user.avatarUrl} />;
```

JSX tabs can also be nested with each other：

```jsx
const element = (
  <View>
    <Text>Hello!</Text>
    <Text>Good to see you here.</Text>
  </View>
)
```

JavaScript expression can also nested：

```jsx
render ()
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos. ap(todo) => <Text>{todo}</Text>)}
    </ul>
  )
}
```

### Boolean, Null and Undefined are ignored

`false`、`null`、`undefined` 和 `true` 都是有效的 children，但它们不会直接被渲染。The expression below is an equivalent：

```jsx
<View />

<View></View>

<View>{false}</View>

<View>{null}</View>

<View>{undefined}</View>

<View>{true}</View>
```

This is very useful when determining whether or not to render elements according to the conditions.JSX below will only render `<Header />` components when showHeader is true

```jsx
<View>
  {showHeader && <Header />}
  <Content />
</View>
```

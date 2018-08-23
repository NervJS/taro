# Refs 引用

> Refs 提供了一种访问在 render 方法中创建的 DOM 节点（小程序原生组件）或 Taro 组件实例的方式。

在常规的 Taro 数据流中，props 是父组件与子组件交互的唯一方式。要修改子元素，你需要用新的 props 去重新渲染子元素。然而，在少数情况下，你需要在常规数据流外强制修改子元素。被修改的子元素可以是 Taro 组件实例，或者是一个 DOM 元素。在这种情况下，Taro 提供了解决办法。


## 不要过度使用 Refs
你可能首先会想到在你的应用程序中使用 refs 来更新组件。如果是这种情况，请花一点时间，更多的关注在组件层中使用 state。在组件层中，通常较高级别的 state 更为清晰。例如，相比于在 `Dialog` 组件中暴露 `open()` 和 `close()` 方法，最好传递 `isOpen` 属性。


## 创建 Refs

Taro 支持使用字符串和函数两种方式创建 Ref。

### 使用字符串创建 ref

通过字符串创建 ref 只需要把一个字符串的名称赋给 `ref` prop。然后就通过 `this.refs` 访问到被定义的组件实例或 DOM 元素（小程序原生组件）。在微信小程序中，如果 `ref` 的是小程序原生组件，那么相当于使用 `createSeletorQuery` 取到小程序原生组件实例，如果是在 `H5(Web)` 环境中使用，那访问到的将是 `@tarojs/components` 对应组件的组件实例。

```javascript
class MyComponent extends Component {

  componentDidMount () {
    // 如果 ref 的是小程序原生组件，那只有在 didMount 生命周期之后才能通过
    // this.refs.input 访问到小程序原生组件
    if (process.env.TARO_ENV === 'weapp') {
      // 这里 this.refs.input 访问的时候通过 `wx.createSeletorQuery` 取到的小程序原生组件
    } else if (process.env.TARO_ENV === 'h5') {
      // 这里 this.refs.input 访问到的是 `@tarojs/components` 的 `Input` 组件实例
    }
  }

  render () {
    return <Input ref='input' />
  }
}
```

### 通过函数创建 ref

你也可以通过传递一个函数创建 ref, 在函数中被引用的组件会作为函数的第一个参数传递。如果是被引用的组件是自定义组件，那可以在任意的生命周期访问引用。

*不管在任何情况下，Taro 都推荐你使用函数的方式创建 ref。*

```javascript
class MyComponent extends Component {

  roar () {
    // 会打印 `miao, miao, miao~`
    this.cat.miao()
  }

  refCat = (node) => this.cat = node // `this.cat` 会变成 `Cat` 组件实例的引用

  render () {
    return <Cat ref={this.refCat} />
  }
}

class Cat extends Components {
  miao() {
    console.log('miao, miao, miao~')
  }

  render () {
    return <View />
  }
}
```
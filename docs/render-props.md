---
title: Render Props
---

> 自 1.3.5 起支持

`render props` 是指一种在 Taro 组件之间使用一个值为函数的 prop 共享代码的简单技术。

具有 render prop 的组件接受一个函数，该函数返回一个 Taro 元素并调用它而不是实现自己的渲染逻辑。


举个例子，假设我们有一个组件，它可以呈现一张在屏幕上追逐鼠标的猫的图片。我们或许会使用 <Cat mouse={{ x, y }} prop 来告诉组件鼠标的坐标以让它知道图片应该在屏幕哪个位置。

我们可以提供一个带有函数 prop 的 `<Mouse>` 组件，它能够动态决定什么需要渲染的，而不是将 `<Cat>` 硬编码到 `<Mouse>` 组件里，并有效地改变它的渲染结果。

```jsx
class Cat extends Taro.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends Taro.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleClick.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleClick(event) {
    const { x, y }  = event.detail
    this.setState({
      x,
      y
    });
  }

  render() {
    return (
      <View style={{ height: '100%' }} onClick={this.handleClick}>

        {/*
          我们可以把 prop 当成一个函数，动态地调整渲染内容。
        */}
        {this.props.renderCat(this.state)}
      </View>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <View>
        <View>点击鼠标!</View>
        {/*
          这
        */}
        <Mouse renderCat={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </View>
    );
  }
}
```

现在，我们提供了一个 render 方法 让 `<Mouse>` 能够动态决定什么需要渲染，而不是克隆 `<Mouse>` 组件然后硬编码来解决特定的用例。

更具体地说，**render prop 是一个用于告知组件需要渲染什么内容的函数 prop**。

这项技术使我们共享行为非常容易。要获得这个行为，只要渲染一个带有 render prop 的 `<Mouse>` 组件就能够告诉它当前鼠标坐标 (x, y) 要渲染什么。


### 注意事项

**`render props` 是基于小程序 `slot` 机制实现的。** 因此它受到的限制和 `children 与组合`的限制一样多，更多详情请查看文档[Children与组合
](./taro/docs/children.html#注意事项)。

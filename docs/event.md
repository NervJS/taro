---
title: 事件处理
---

Taro 元素的事件处理和 DOM 元素的很相似。但是有一点语法上的不同:

Taro 事件绑定属性的命名采用驼峰式写法，而不是小写。
如果采用 JSX 的语法你需要传入一个函数作为事件处理函数，而不是一个字符串 (DOM 元素的写法)。
例如，传统的微信小程序模板：

```html
<button onclick="activateLasers">
  Activate Lasers
</button>
```

Taro 中稍稍有点不同：

```jsx
<button onClick={this.activateLasers}>
  Activate Lasers
</button>
```

在 Taro 中另一个不同是你不能使用 `catchEvent` 的方式阻止事件冒泡。你必须明确的使用 `stopPropagation`。例如，阻止事件冒泡你可以这样写：

```jsx
class Toggle extends Component {
  constructor (props) {
    super(props)
    this.state = {isToggleOn: true}
  }

  onClick = (e) => {
    e.stopPropagation()
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }))
  }

  render () {
    return (
      <button onClick={this.onClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    )
  }
}
```

## 向事件处理程序传递参数

通常我们会为事件处理程序传递额外的参数。例如，传入欲删除行的 `id`：

```jsx
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

当你通过 bind 方式向监听函数传参，在类组件中定义的监听函数，事件对象 `e` 要排在所传递参数的后面。

```jsx
class Popper extends Component {
  constructor () {
    super(...arguments)
    this.state = { name:'Hello world!' }
  }

  // 你可以通过 bind 传入多个参数
  preventPop (name, test, e) {    //事件对象 e 要放在最后
    e.stopPropagation()
  }

  render () {
    return <Button onClick={this.preventPop.bind(this, this.state.name, 'test')}></Button>
  }
}
```

### 使用匿名函数

> 自 v1.2.9 开始支持

> 注意：在各小程序端，使用匿名函数，尤其是在 **循环中** 使用匿名函数，比使用 `bind` 进行事件传参占用更大的内存，速度也会更慢。

除了 `bind` 之外，事件参数也可以使用匿名函数进行传参。直接写匿名函数不会打乱原有监听函数的参数顺序：

```jsx
class Popper extends Component {
  constructor () {
    super(...arguments)
    this.state = { name: 'Hello world!' }
  }

  render () {
    const name = 'test'
    return (
      <Button onClick={(e) => {
        e.stopPropagation()
        this.setState({
          name
        })
      }}>
        {this.state.name}
      </Button>
    )
  }
}
```

## 任何组件的事件传递都要以 `on` 开头

> 在 v1.3.0-beta.0 之后，自定义组件间的事件传递可以不用 `on` 开头，但内置组件的事件依然是以 `on` 开头的，为了一致性我们仍然推荐你以 `on` 开头命名你的事件。

在微信小程序中，可能你会看到像 `bindTap` 这样的用法，但在 Taro 中，事件参数(props)都以 `on` 开头:

```jsx
// 错误
const element = <View bindtap={this.onTag} />
const element2 = <Input bindfocus={this.onFocus} />
const element3 = <CustomElement animationEnd={this.props.onAnimationEnd} />
```

只要当 JSX 组件传入的参数是函数，参数名就必须以 `on` 开头：

```jsx
// 正确
const element = <View onClick={this.onTag} />
const element2 = <Input onFocus={this.onFocus} />
const element3 = <CustomElement onAnimationEnd={this.props.onAnimationEnd} />
```

---
title: Event Handling
---

The Taro element is very similar to the DOM element.But there is a little difference in syntax:

The naming of Taro event binding properties is based on a camel peak rather than an lowercase. If using JSX syntax you need to pass a function as event handler instead of a string (writing DOM element). For example, traditional micromessage applet template：

```html
<button onclick="activateLasers">
  Activate Lasers
</button>
```

slightly different in Taro：

```jsx
<button onClick={this.activateLasers}>
  Activate Lasers
</button>
```

Another difference in Taro is that you cannot prevent an event from blowing using `catchEvent`.You must clearly use `stopPropagation`.例如，阻止事件冒泡你可以这样写：

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

## Send parameters to event handler

Normally we'll pass additional parameters for the event handler.For example, incoming `id to delete line`：

```jsx
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

The event object `e` will be placed behind the passed parameter when you pass on arguments to the listener function defined in the class component.

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

### Use anonymous functions

> Start support from v1.2.9

> Note that：uses anonymous functions at various applets, especially in the **loop** use anonymous functions and takes larger memory and slower speed than using `bind`.

In addition to `bind` , the event parameter can also be used as an anonymous function.Writing anonymous functions directly does not disturb the parameter order of the original listener function：

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

> 注意： 使用通过 `usingComponents` 的第三方组件不支持匿名函数

### Curitification

> Start support from v1.3.0-beta

> At each applet, using Curified Taro will generate an additional anonymous function after compilation.

In addition to `lind` and anonymous functions, event arguments can also be used[Collined](https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96).

```jsx
class Title extends Component{

  handleClick = (index) => (e) => {
    e.stopPropagation()
    this.setState({
      currentIndex: index
    })
  }

  render() {
    const { currentIndex } = this.props;
    return (
      {/* 调用 `this.handleClick(currentIndex)` 会返回一个函数，这个函数可以访问到 `currentIndex` 同时也能满足 `onClick` 的签名 */}
      <View onClick={this.handleClick(currentIndex)}>
      </View>
    )
  }
 }
```

> 注意： 使用通过 `usingComponents` 的第三方组件不支持匿名函数

### Functional Component

In the function component, the event sender can bring an event reference or an anonymous function. Below is an example of the function component that works with [`useCallback`](hooks.md#usecallback)：

```jsx
const App = () => {
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);

  const increment = c => c + 1

  // 只有 useCallback 对应的 c1 或 c2 的值改变时，才会返回新的函数
  const increment1 = useCallback(() => setC1(increment), [c1]);
  const increment2 = useCallback(() => setC2(increment), [c2]);

  return (<View>
    <Text> Counter 1 is {c1} </Text>
    <Text> Counter 2 is {c2} </Text>
    <Text> Counter 3 is {c3} </Text>
    <View>
      <Button onClick={increment1}>Increment Counter 1</Button>
      <Button onClick={increment2}>Increment Counter 2</Button>
      <Button onClick={() => setC3(increment)}>Increment Counter 3</Button>
    </View>
  </View>)
}
```

## Any component passes on events starting with `on`

> After v1.3.0-beta.0, the custom components can be passed around `on` but the built-in component event starts with `on` , we still recommend your event beginning with `on`.

In the micromessaging applet, you may see usage like `bindTap` , but in Taro, event parameters (props) start with `on`:

```jsx
// Error
const element = <View bindtap={this.onTag} />
const element2 = <Input bindfocus={this.onFocus} />
const element3 = <CustomElement animationEnd={this.props.onAnimationEnd} />
```

As long as the JSX component is a function, the parameter name must start with `on`：

```jsx
// Correct
const element = <View onClick={this.onTag} />
const element2 = <Input onFocus={this.onFocus} />
const element3 = <CustomElement onAnimationEnd={this.props.onAnimationEnd} />
```

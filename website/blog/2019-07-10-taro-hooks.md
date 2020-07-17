---
title: 使用 React Hooks 重构你的小程序 
author:yuche
authorURL: https://github.com/yuche
authorImageURL: https://static.geekbang.org/ck/5cb53de0e50c0.jpeg?imageView2/0/w/800
---

![image](http://storage.360buyimg.com/taro-club-img/b42116392c909d0680788853011c70db)

> 本文由余澈在 GMTC 全球大前端技术 2019 的演讲：[《使用 React Hooks 重构你的小程序》](https://gmtc.infoq.cn/2019/beijing/presentation/1706)整理而成。

<!--truncate-->


## 背景

一直关注小程序开发的朋友应该会注意到，最开始小程序就是为了微型创新型业务打造的一个框架，最多只能运行 1m 的包。可是后来发现很多厂商把越来越多的业务搬到了小程序上，小程序的能力也在不断地开放，变得越来越强大。于是后来打包限制上升到了 2m，然后引入了分包，现在已经已经可以上传 8m 的小程序。其实这个体积已经可以实现非常巨型非常复杂的业务了。就从 Taro 的用户来看，例如京东购物小程序和 58 同城小程序不管从代码的数量还是复杂度都不亚于 PC 端业务，所以我们可以说前端开发的复杂度正在向小程序端转移。

而小程序开发其实也是前端开发的一个子集，在整个前端业界，我们又是怎么解决复杂度这个问题的呢？

首先我们看看 React：React Core Team 成员，同时也是 Redux 的作者 Dan Abramov 在 2018 年的 ReactConf 向大家首次介绍了 React Hooks。React Hooks 是为了解决 Class Component 的一些问题而引入的：

* Class Component 组件间的逻辑难以复用。因为  JavaScript 不像 Go 或 C++ 一样，Class 可以多重继承，类的逻辑的复用就成了一个问题；
* 复杂组件难以理解。Class Component 经常会在生命周期做一些数据获取事件监听的副作用函数，这样的情况下我们就很难把组件拆分为更小的力度；
* Class 令人迷惑。很多新手应该会被 Class 组件绑定事件的 `this` 迷惑过，绑定事件可以用 bind，可以直接写箭头函数，也可以写类属性函数，但到底哪种方法才是最好的呢？而到了 ES 2018，class 还有多种语法，例如装饰器，例如 private fileds 这些奇奇怪怪的语法也为新手增加了更多的困惑。

而对于 Vue 而言也有相同的问题，Vue 的作者尤玉溪老师在 VueConf China 2019 也给 Vue 3.0 引入了一个叫 *Functional-based API* 的概念，它是受 React Hooks 启发而增加的新 API。由于 Vue 2.0 组件组合的模式是对象字面量形式，所以 *Functional-based API* 可以作为 Mixins 的替代，配合新的响应式 API 作为新的组件组合模式。那么对于 Vue 3.0 我们还知之甚少，以后的 API 也有可能改变，但或许是英雄所见略同，React 和 Vue 对于降低前端开发复杂度这一问题都不约而同地选择了 Hooks 这一方案，这到底是为什么呢？


![why_hooks.png](https://i.loli.net/2019/07/02/5d1af3a5e84b022890.png)


我们可以一下之前的组件组合方案，首先是 *Mixins*，红色圈的 *Mixins*，黄色的是组件，我们知道 *Mixins* 其实就是把多个对象组合成一个对象，*Mixins* 的过程就有点像调用 `Object.assgin` 方法。那 *Mixins* 有什么问题呢？首先是命名空间耦合，如果多个对象同名参数，这些参数就会耦合在一起；其次由于 *Mixins* 必须是运行时才能知道具体有什么参数，所以是 TypeScript 是无法做静态检查的；第三是组件参数不清晰，在 *Mixins* 中组件的 props 和其他参数没什么两样，很容易被其它的 *Mixins* 覆盖掉。

为了解决 *Mixins* 的问题，后来发展出了高阶组件（*HOC*）的方式，高阶组件就和图里一样，一个组件嵌套着另外的组件。它的确解决了 *Mixins* 的一些问题，例如命名空间解耦，由于每次都会生成新组件，就不存在命名空间问题了；其次它也能很好地做静态检查；但它依然没有办法处理组件 props 的问题，props 还是有可能会在高阶组件中被更改；而且它还有了新的问题，每多用一次高阶组件，都会多出一个组件实例。

最后我们来看一下 Hooks，紫色的圈圈是 Hooks，就像图里一样，Hooks 都在同一个组件里，Hooks 之间还可以相互调用。因为 Hooks 跑在一个普通函数式组件里，所以他肯定是没有命名空间的问题，同时 TypeScript 也能对普通函数做很好的静态检查，而且 Hooks 也不能更改组件的 Props，传入的是啥最后可用的就是啥；最后 Hooks 也不会生成新的组件，所以他是单组件实例。

![taroxhooks.png](https://i.loli.net/2019/07/02/5d1af4ef2dd5a56009.png)

在 Taro 1.3 版本，我们实现了一大堆特性，其中的重头戏就是 React Hooks 的支持。虽然 React Hooks 正式稳定的时间并不长，但我们认为这个特性能有效地简化开发模式，提升开发效率和开发体验。即便 Hooks 的生态和最佳实践还尚未完善，但我们相信未来 Hooks 会成为 React 开发模式的主流，也会深刻地影响其它框架未来的 API 构成。所以在 Taro 的规划中我们也把 Hooks 放在了很重要的位置。

## 什么是 Hooks？

相信笔者扯了那么多，大家对 Hooks 应该产生了一些兴趣，那什么是 Hooks 呢？简单来说，Hooks 就是一组在 React 组件中运行的函数，让你在不编写 Class 的情况下使用 state 及其它特性。具体来说，Hooks 可以表现为以下的形式：

### `useState` 与内部状态

我们可以看一个原生小程序的简单案例，一个简单计数器组件，点击按钮就 + 1，相信每位前端开发朋友都可以轻松地写一个计数器组件。但我们可以稍微改一下代码，把事件处理函数改为箭头函数。如果是这样代码就跑不了了。事实上在原生开发中 `this` 的问题是一以贯之的，所以我们经常要开个新变量把 `this` 缓存起来，叫做 `self` 什么的来避免类似的问题。我们之前也提到过，如果采用 ES6 的 Class 来组织组件同样也会遇到 `this` 指向不清晰的问题。

```js
Page({
  data: {
    count: 0
  },
  increment: () => { // 这里写箭头函数就跑不了了
    this.setData({
      count: this.data.count + 1
    })
  }
})
```

再来看看我们的 hooks 写法，我们引入了一个叫 useState 的函数，它接受一个初始值参数，返回一个元组，如果是写后端的同学应该对这个模式比较熟悉，就像 Koa 或者 Go 一样，一个函数返回两个值或者说叫一个元组，不过我们返回的第一个参数是当前的状态，一个是设置这个状态的函数，每次调用这个设置状态的 `setState` 函数都会使得整个组件被重新渲染。然后用 ES6 的结构语法把它俩解构出来使用。

然后我们在定义一个增加的函数，把他绑定到 `onClick` 事件上。

```jsx
function Counter () {
  // 返回一个值和一个设置值的函数              
  // 每次设置值之后会重新渲染组件
  const [ count, setCount ] = useState(0)

  function increment () {
    setCount(count + 1)
  }

  return (
    <View>
      <Text>You clicked {count} times</Text>
      <Button onClick={increment}>
        Click me
      </Button>
    </View>
  )
}
```

同样是非常简单的代码。如果你熟悉 Taro 之前的版本的话就会知道这样的代码在以前的 Taro 是跑不了的，不过 Taro 1.3 之后事件传参可以传入任何合法值，你如果想直接写箭头函数或者写一个柯里化的函数也是完全没有问题的。

大家可以发现我们使用的 Hooks 就是一个非常简单非常 normal 的函数，没有 `this` 没有 class，没有类构造函数，没有了 `this`，再也不会出现那种 `this`、`self` 傻傻分不清楚的情况。

大家可以记住这个简单的计数器组件，以后之后讲的很多案例是基于这个组件做的。

### `useEffect` 与副作用

接下来我们看一个稍微复杂一些的例子，一个倒计时组件，我们点击按钮就开始倒计时，再点击就停止倒计时。在我们这个组件里有两个变量，`start` 用于控制是否开始计时，`time` 就是我们的倒计时时间。这里注意我们需要多次清除 `interval`，而在现实业务开发中，这个 `touchStart` 函数可能会复杂得多，一不小心就会提前清除 `interval` 或忘记清除。

```js
Page({
  data: {
    time: 60
  },
  start: false,
  toggleStart () {
    this.start = !this.start
    if (this.start) {
      this.interval = setInterval(() => {
        this.setData({
          time: this.data.time - 1
        })
      }, 1000)
    } else {
      clearInterval(this.interval)
    }
  },
  onUnload () {
    clearInterval(this.interval)
  }
})
```

```html
<view>
  <button bindtap="toggleStart">
    {{time}} 
  </button>
</view>
```

而我们 Hooks 的例子会是这样：我们引入了一个 `useEffect` 函数。之前我们提到过，每次调用 `useState` 返回的 `setState` 函数都会重新调用整个函数，其实就包括了 `useEffect` 函数，`useEffect` 接受两个参数。第一个就是副作用，也就是 `effect` 函数，他不接受也不返回任何参数。
第二个参数是依赖数组，当数组中的变量变化时就会调用，第一个参数 `effect` 函数。
`Effect` 函数还可以返回一个函数，这个函数在下一次 `effect` 函数被调用时或每次组件被注销时或者就会调用，我们可以在这里清楚掉一些事件的订阅或者 interval 之类可能会导致内存泄露的行为。
在我们这个例子中，当 `start` 每次变化就会重新跑一次 `effect` 函数，每隔一秒会设置一次 `time` 的值让它减一，但这样的写法是有问题的。

```jsx
function Counter () {
  const [ start, setStart ] = useState(false)
  const [ time, setTime ] = useState(60)
  
  useEffect(() => { // effect 函数，不接受也不返回任何参数
    let interval
    if (start) {
      interval = setInterval(() => {
        // setTime(time - 1) ❌ time 在 effect 闭包函数里是拿不到准确值的
        setTime(t => t -1) // ✅ 在 setTime 的回调函数参数里可以拿到对应 state 的最新值
      }, 1000)
    }
    return () => clearInterval(interval) // clean-up 函数，当前组件被注销时调用
  }, [ start ]) // 依赖数组，当数组中变量变化时会调用 effect 函数
  
  return (
    <View>
      <Button onClick={() => setStart(!start)}>{time}</Button>
    </View>
  )
}
```

因为我们在 `setInterval` 这个函数的闭包中，我们捕捉到 `time` 这个变量的值不能和最新的值对应得上，`time` 的值有可能在我们意料之外地被更改了多次。解决的方案也很简单，之前我们提到过 `useState` 返回的 `setState` 方法，可以接受一个函数作为参数，而这个函数的参数，就是 `state` 最新的值，所以只要我们传入一个函数就好了。这是其中一种方法。

还有另一种方法是使用 `useRef` Hooks，`useRef` 可以返回一个可变的引用，它会生成一个对象，对象里这个有 `current` 属性，而 `current` 的值是可变的。在我们这个例子里，每次更改 `currentTime.current` 都是同步的，而且 `currentTime` 是一个引用，所以 `currentTime.current` 一定是可控的。

```jsx
function Counter () {
  const [ start, setStart ] = useState(false)
  const [ time, setTime ] = useState(60)
  const currentTime = useRef(time) // 生成一个可变引用
  
  useEffect(() => { // effect 函数，不接受也不返回任何参数
    let interval
    if (start) {
      interval = setInterval(() => {
        setTime(currentTime.current--) // currentTime.current 是可变的
      }, 1000)
    }
    return () => clearInterval(interval) // clean-up 函数，当前组件被注销时调用
  }, [ start ]) // 依赖数组，当数组中变量变化时会调用 effect 函数
  
  return (
    <View>
      <Button onClick={() => setStart(!start)}>{time}</Button>
    </View>
  )
}
```

虽然说我们可以 `useRef` 来解决这个问题，但是没必要这样做。因为 `setTime` 传递一个回调函数的方法显然可读性更高。真正有必要的是把我们的 `interval` 变量作为一个 ref，我们在函数最顶层的作用域把 `interval` 作为一个 ref，这样我们就可以在这个函数的任何一个地方把他清除，而原来的代码中我们把 `interval` 作为一个普通的变量放在 effect 函数里，这样如果我们有一个事件也需要清除 interval，这就没法做到了。但是用 `useRef` 生成可变引用就没有这个限制。

```jsx
function Counter () {
  const [ start, setStart ] = useState(false)
  const [ time, setTime ] = useState(60)
  const interval = useRef() // interval 可以在这个作用域里任何地方清除和设置
  
  useEffect(() => { // effect 函数，不接受也不返回任何参数
    if (start) {
      interval.current = setInterval(() => {
        setTime(t => t - 1) // ✅ 在 setTime 的回调函数参数里可以拿到对应 state 的最新值
      }, 1000)
    }
    return () => clearInterval(interval.current) // clean-up 函数，当前组件被注销时调用
  }, [ start ]) // 依赖数组，当数组中变量变化时会调用 effect 函数
  
  return (
    <View>
      <Button onClick={() => setStart(!start)}>{time}</Button>
    </View>
  )
}
```

### `useContext` 与跨组件通信

接下来我们再来看一个跨组件通信的例子，例如我们有三个组件，*page* 组件有一个 *child* 组件，*child* 组件有一个 *counter* 组件，而我们 *counter* 组件的 `count` 值和 `setCount` 函数，是由 *page* 组件传递下来的。这种情况在一个复杂业务的开发中也经常能遇到，在原生小程序开发中我们应该怎么做呢？

我们需要手动的把我们 `counter` 的值和函数手动地依次地传递下去，而这样的传递必须是显式的，你需要在 JavaScript 中设置 props 的参数，也需要在 WXML 里设置 props 的参数，一个也不能少，少了就跑不动。我们还注意到即便 child 组件没有任何业务逻辑，他也必须要设置一个 `triggerEvent` 的函数和 props 的类型声明。这样的写法无疑是非常麻烦而且限制很大的。

```html
<!-- page.wxml -->

<view>
  <child />
</view>

<!-- child.wxml -->
<view>
  <counter />
</view>

<!-- counter.wxml -->
<view>
  <text>
    You clicked {{count}} times
  </text>
  <butto bindtap="increment">
    Click me
  </button>
</view>
```

```js
// page.js
Page({
  data: {
    count: 0
  },
  increment () {
    this.setData({
      count: this.data.count + 1
    })
  }
})

// child.js
Component({
  properties: {
    count: Number
  },
  methods: {
    increment () {
      this.triggerEvent('increment')
    }
  }
})

// counter.js
Component({
  properties: {
    count: Number
  },
  methods: {
    increment () {
      this.triggerEvent('increment')
    }
  }
})
```

而我们可以看看 Hooks 的写法，首先我们用 `Taro.createContext` 创建一个 `context` 对象，在我们 *page* 组件里把我们的 `count` 和 `setCount` 函数作为一个对象传入到 `Context.Provider` 的 `value` 里。然后在我们的 *Counter* 组件，我们可以使用 `useContext` 这个 Hooks 把我们的 `count` 和 `setCount` 取出来，就直接可以使用了。

```jsx
export const CounterContext = Taro.createContext(null);

// page.js
const Page = () => {
  const [ count, setCount ] = useState(0)

  return (
    <CounterContext.Provider value={{ count, setCount }}>
      <Child />
    </CounterContext.Provider>
  );
};

// child.js
const Child = () => (
  <View>
    <Counter />
  </View>
);

// counter.js
const Counter = () => {
  const { count, setCount } = useContext(CounterContext)
  return (
    <View>
      <Text>
        You clicked {count} times
      </Text>
      <Button onClick={() => setCount(count + 1)}>
        Click me
      </Button>
    </View>
  )
}
```

大家可以发现使用 Context 的代码比原来的代码精简了很多，参数不需要一级一级地显式传递，*child* 组件也和事实一样，没有一行多余的逻辑。但精简不是最大的好处。最大的好处是大家可以发现我们的 Context 可以传递一个复杂的对象，熟悉小程序原生开发的同学可能会知道，所有 props 的传递都会被小程序序列化掉，如果传递了一个复杂的对象最终会变成一个 JSON。但是用 Taro 的 context 则没有这层限制，你可以传入一个带有函数的对象，也可以传入像是 `imutabale` 或者 `obserable` 这样复杂的对象。在 taro 1.3 我们对 props 系统进行了一次重构，Taro 的 context 和 props 一样，属性传递没有任何限制，想传啥就传啥。

另外一个值得注意的点的是，context 的传递可以无视父级组件的更新策略，在这个例子中即便我们通过 `shouldComponentUpdate()` 禁止了 *child* 组件的更新，但 *counter* 作为它的子组件依然是可以更新的。这个特性可以让我们做性能优化的时候更为灵活一些。

## Hooks 在小程序实战

讲完了 Hooks 的基本使用，有些同学会觉得：咦，我怎么觉得你这几个东西感觉平平无奇，没什么特别的。但实际上这些基础的 Hooks 单独拿出来看的确不能玩出什么花样，但他们组合起来却能迸发强大的力量。

### 自定义 Hooks

大家在业务开发可能会遇到这样的需求，实现一个双击事件，如果你是从 H5 开发过来的可能会直接写 `onDoubleClick`，但很遗憾，小程序组件是没有 `doubleClick` 这个事件的。当然，如果你使用 Taro 又用了 TypeScript 就不会犯这样的错误，编辑器就回直接给你报错 `Text` 组件没有这个属性。

于是你就自己实现了一个双击事件，代码大概是这样，有一个上次点击的时间作为状态，每次触发单机事件的时候和上次点击的时间做对比，如果间隔过小，那他就是一个双击事件。代码非常简单，但我们不禁就会产生一个问题问题，每一次给一个组件加单击事件，我们就每次都加这么一坨代码吗？

```jsx
function EditableText ({ title }) {
  const [ lastClickTime, setClickTime ] = useState(0)
  const [ editing, setEditing ] = useState(false)

  return (
    <View>
      {
        editing
          ? <TextInput editing={editing} />
          : <Text
            onClick={e => {
              const currentTime = e.timeStamp
              const gap = currentTime - lastClickTime
              if (gap > 0 && gap < 300) { // double click
                setEditing(true)
              }
              setClickTime(currentTime)
            }}
          >
            {title}
          </Text>
      }
    </View>
  )
}
```

这个时候我们就可以写一个自定义 Hooks，代码和原来的代码也差不多，`useDoubleClick` 不接受任何参数，但当我们调用 `useDoubleClick` 时候返回一个名为 `textOnDoubleClick` 的函数，在在 Text 组件的事件传参中，我们再在 `textOnDoubleClick` 函数中传入一个回调函数，这个回调函数就是触发双击条件时候的函数。当我们给这个自定义 Hooks 做了柯里化之后，我们就可以做到知道 Hook 使用时才暴露回调函数:

```jsx
function useDoubleClick () {
  const [ lastClickTime, setClickTime ] = useState(0)

  return (callback) => (e) => {
    const currentTime = e.timeStamp
    const gap = currentTime - lastClickTime
    if (gap > 0 && gap < 300) {
      callback && callback(e)
    }
    setClickTime(currentTime)
  }
}

function EditableText ({ title }) {
  const [ editing, setEditing ] = useState(false)
  const textOnDoubleClick = useDoubleClick()

  return (
    <View>
      {
        editing
          ? <TextInput editing={editing} />
          : <Text
            onClick={textOnDoubleClick(() =>
              setEditing(true)
            )}
          >
            {title}
          </Text>
      }
    </View>
  )
}
```

柯里化函数好像有一点点绕，但一旦我们完成了这一步，这种我们的自定义 hooks 就可以像多次调用：

```jsx
function EditableText ({ title }) {
  const textOnDoubleClick = useDoubleClick()
  const buttonOnDoubleClick = useDoubleClick()
  // 任何实现单击类型的组件都有自己独立的双击状态


  return (
    <View>
      <Text onClick={textOnDoubleClick(...)}>
        {title}
      </Text>
      <Button onClick={buttonOnDoubleClick(...)} />
    </View>
  )
}
```

每一个大家不妨试想如果按照我们传统的 render props 实现，每次都要多写一个 container 组件，如果用 Mixins 或高阶组件来实现就更麻烦，我们需要基于每个不同类型的组件创造一个新的组件。而使用 Hooks，任何一个实现了单机类型的组件都可以通过我们的自定义 Hook 实现双击效果，不管从它的内部实现来看，还是从它暴露的 API 来看都是非常优雅的。

### 性能优化

接下来我们谈一下性能优化，相信大家也有过这种情况，有一个数组，他只需拿到他的 props 要渲染一次，从此之后他就再也不需要更新了。对于传统而言的 Class Component 我们可以设置 `shouldComponentUpdate()` 返回 `false`。

```js
class Numbers extends Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return <View>
      {
       expensive(this.props.array).map(i => <View>{i}</View>)
      }
    </View>
  }
}
```

而对于函数式组件而言，我们也可以做一样的事情。Taro 和 React 一样提供 `Taro.memo` API，他的第一个参数接受一个函数式组件，第二个参数和我们的 `shouldComponentUpdate()` 一样，判断组件在什么样的情况下需要更新。如果第二个参数没有传入的话，`Taro.memo` 的效果就和 `Taro.PureComponent` 一样，对新旧 props 做一层浅对比，如果浅对比不相等则更新组件。

```js
function Numbers ({ array }) {
  return (
    <View>
      {
       expensive(array).map(
         i => <View>{i}</View>
       )
      }
    </View>
  )
}

export default Taro.memo(Numbers, () => true)
```

第二种情况我们可以看看我们的老朋友，计数器组件。但是这个计数器组件和老朋友有两点不一样：第一是每次点击 + 1，计数器需要调用 `expensive` 函数循环 1 亿次才能拿到我们想要的值，第二点是它多了一个 `Input` 组件。在我们真实的业务开发中，这种情况也很常见：我们的组件可能需要进行一次昂贵的数据处理才能得到最终想要的值，但这个组件又还有多个 state 控制其它的组件。在这种情况下，我们如果正常书写业务逻辑是有性能问题的：

```js
function Counter () {
  const [ count, setCount ] = useState(0)
  const [val, setValue] = useState('')
  function expensive() {
    let sum = 0
    for (let i = 0; i < count * 1e9; i++) {
      sum += i
    }
    return sum
  }

  return (
    <View>
      <Text>You clicked {expensive()} times}</Text>
      <Button onClick={() => setCount(count + 1)}>
        Click me
      </Button>
      <Input value={val} onChange={event => setValue(event.detail.value)} />
    </View>
  )
}
```

因为我们 `count` 的值跟 `Input` 的值没有关系，但我们每次改变 `Input` 的值，就会触发这个组件重新渲染。也就是说这个循环一亿次的 `expensive()` 函数就会重新调用。这样情况显然是不能接受的。为了解决这个问题，我们可以使用 `useMemo` API。`useMemo` 的签名和 `useEffect` 有点像，区别就在于 `useMemo` 的第一个函数有返回值，这个函数返回的值同时也是 `useMemo` 函数的返回值。而第二个参数同样是依赖数组，只有当这个数组的数据变化时候，`useMemo` 的函数才会重新计算，如果数组没有变化，那就直接从缓存中取数据。在我们这个例子里我们只需要 `count` 变化才进行计算，而 Input value 变化无需计算。

```js
function Counter () {
  const [ count, setCount ] = useState(0)
  const [val, setValue] = useState('')
  const expensive = useMemo(() => {
    let sum = 0
    for (let i = 0; i < count * 100; i++) {
      sum += i
    }
    return sum
  }, [ count ]) // ✅ 只有 count 变化时，回调函数才会执行

  return (
    <View>
      <Text>You Clicked {expensive} times</Text>
      <Button onClick={() => setCount(count + 1)}>
        Click me
      </Button>
      <Input value={val} onChange={event => setValue(event.detail.value)} />
    </View>
  )
}
```

我们刚才提到的两个 memo 的 API ，他的全称其实是 *Memoization*。由于 Hooks 都是在普通函数中运行的，所以我们要做好性能优化，一定要好好利用缓存和记忆化这一技术。

> 在计算机科学中，记忆化（Memoization）是一种提高程序运行速度的优化技术。通过储存大计算量函数的返回值，当这个结果再次被需要时将其从缓存提取，而不用再次计算来节省计算时间。

### 大规模状态管理

提到状态管理，React 社区最有名的工具当然是 Redux。在 `react-redux@7` 中新引用了三个 API:

1. `useSelector`。它有点像 `connect()` 函数的第一个参数 `mapStateToProps`，把数据从 state 中取出来；
2. `useStore` 。返回 `store` 本身；
3. `useDispatch`。返回 `store.dispatch`。

在 Taro 中其实你也可以使用我们之前提到过的 `createContext` 和 `useContext` 直接就把 `useStore` 和 `useDispatch` 实现了。而基于 `useStore` 和 `useDispatch` 以及 `useState`，`useMemo`，`useEffect` 也可以实现 `useSelector`。也就是说 `react-redux@7` 的新 API 全都是普通 Hooks 构建而成的自定义 Hooks。当然我们也把 `react-redux@7` 的新功能移植到了 `@tarojs/redux`，在 Taro 1.3 版本你可以直接使用这几个 API。

## Hooks 的实现

我们现在对 Hooks 已经有了以下的了解，一个合法的 Hooks ，必须满足以下需求才能执行: 

* 只能在函数式函数中调用
* 只能在函数最顶层中调用
* 不能在条件语句中调用
* 不能在循环中调用
* 不能在嵌套函数中调用

我想请大家思考一下，为什么一个 Hook 函数需要满足以上的需求呢？我想请大家以可以框架开发者的角度去思考下这个问题，而不是以 API 的调用者的角度去逆向地思考。当一个 Hook 函数被调用的时，这个 Hook 函数的内部实现应该可以访问到当前正在执行的组件，但是我们的 Hooks API 的入参却没有传入这个组件，那究竟是怎么样的设计才可以让我们的 hook 函数访问到正在执行的组件，也能够准确地定位自己呢？

聪明的朋友或许已经猜到了，这些所有线索都指向一个结果，**Hooks 必须是一个按顺序执行的函数**。也就是说，不管整个组件执行多少次，渲染多少次，组件中 Hooks 的顺序都是不会变的。

我们还知道另外一条规则，Hooks 是 React 函数内部的函数，于是我们就可以知道，要实现 Hooks 最关键的问题在于两个:

1. 找到正在执行的 React 函数
2. 找到正在执行的 Hooks 的顺序。

我们可以设置一个全局的对象叫 `CurrentOwner`，它有两个属性，第一个是 `current`，他是正在执行的 `Taro` 函数，我们可以在组件加载和更新时设置它的值，加载或更新完毕之后再设置为 `null`；第二个属性是 `index`，它就是 `CurrentOwner.current` 中 Hooks 的顺序，每次我们执行一个 Hook 函数就自增 1。

```typescript
const CurrentOwner: {
  current: null | Component<any, any>,
  index: number
} = {
  // 正在执行的 Taro 函数,
  // 在组件加载和重新渲染前设置它的值
  current: null,
  // Taro 函数中 hooks 的顺序
  // 每执行一个 Hook 自增
  index: 0
}
```

在 React 中其实也有这么一个对象，而且你还可以使用它，它叫做 `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner`，也就是说如果你想给 React 15 实现 Hooks，其实也可以做到的。但也正如它的名字一样，如果你用了说不定就被 fire 了，被优化了，所以更好的方案还是直接使用我们 taro。

接下来我们来实现我们的 `getHook` 函数，同样很简单，如果 `CurrenOwner.current` 是 `null`，那这就不是一个合法的 hook 函数，我们直接报错。如果满足条件，我们就把 hook 的 `index` + 1，接下来我们把组件的 Hooks 都保存在一个数组里，如果 `index` 大于 Hooks 的长度，说明 Hooks 没有被创造，我们就 push 一个空对象，避免之后取值发生 runtime error。然后我们直接返回我们的 Hook。

```typescript
function getHook (): Hook {
  if (CurrentOwner.current === null) {
    throw new Error(`invalid hooks call: hooks can only be called in a taro component.`)
  }
  const index = CurrentOwner.index++ // hook 在该 Taro 函数中的 ID
  const hooks: Hook[] = CurrentOwner.current.hooks // 所有的 hooks
  if (index >= hooks.length) { // 如果 hook 还没有创建
    hooks.push({} as Hook) // 对象就是 hook 的内部状态
  }
  return hooks[index] // 返回正在执行的 hook 状态
}
```

既然我们已经找到了我们正在执行的 Hooks，完整地实现 Hooks 也就不难了。之前我们讨论过 `useState` 的签名，现在我们一步一步地看他的实现。

首先如果 `initState` 是函数，直接执行它。其次调用我们我们之前写好的 `getHook` 函数，它返回的就是 Hook 的状态。接下来就是 useState 的主逻辑，如果 hook 还没有状态的话，我们就先把正在执行的组件缓存起来，然后 `useState` 返回的，就是我们的 `hook.state`, 其实就是一个数组，第一个值当然就是我们 `initState`，第一个参数是一个函数，它如果是一个函数，我们就执行它，否则就直接把参数赋值给我们 的 `hook.state` 第一个值，赋值完毕之后我们把当前的组件加入到更新队列，等待更新。

```typescript
function useState<S> (initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  if (isFunction(initialState)) { // 如果 initialState 是函数
    initialState = initialState() // 就直接执行
  }
  const hook = getHook() as HookState<S> // 找到该函数中对应的 hook
  if (isUndefined(hook.state)) { // 如果 hook 还没有状态
    hook.component = Current.current! // 正在执行的 Taro 函数，缓存起来
    hook.state = [ // hook.state 就是我们要返回的元组
      initialState,
      (action) => {
        hook.state[0] = isFunction(action) ? action(hook.state[0]) : action
        enqueueRender(hook.component) // 加入更新队列
      }
    ]
  }
  return hook.state // 已经创建 hook 就直接返回
}
```

最后我们把 `hook.state` 返回出去就大功告成了。

Taro 的 Hooks 总共有八个 API， `useState` 的实现大家可以发现非常简单，但其实它的代码量和复杂度是所有 Hooks 的实现中第二高的。所以其实 Hooks 也没有什么黑科技，大家可以放心大胆地使用。


## 总结与展望

在 2018 年 Ember.js 的作者提出过一个观点，*Compilers are the New Frameworks*，编译器即框架。什么意思呢？就拿 React 来举例，单单一个 React 其实没什么用，你还需要配合 *create-react-app*, *eslint-plugin-react-hooks*, *prettier* 等等编译相关的工具最终才能构成一个框架，而这些工具也恰巧是 React Core Team 的人创造的。而这样趋势不仅仅发生在 React 身上，大家可以发现在2018年，尤玉溪老师的主要工作就是开发 *vue-cli*。而对一些更激进的框架，例如 *svelte*，它的框架就是编译器，编译器就是框架。

而到了 2019 年，我想提出一个新概念，叫框架即生态。就拿 Taro 来说，使用 Taro 你可以复用 React 生态的东西，同时 Taro 还有 `taro doctor`，Taro 开发者社区，Taro 物料市场，还有腾讯小程序·云开发等等多个合作伙伴一起构成了 Taro 生态，而整个 Taro 生态才是框架。在过去的半年，我们持续改进并优化了 Taro 框架的表现，以上提到的特性与功能在 Taro 1.3 全部都可以正常使用。而在框架之外，我们也深耕社区，推出了 Taro 物料市场和 Taro 开发者社区，并和腾讯小程序·云开发合作举办了物料开发竞赛。现在，我们诚挚邀请你一起来参与社区贡献，让小程序开发变得更好、更快、更方便：

* Taro 官网：https://taro.jd.com/
* Taro 物料市场：https://taro-ext.jd.com/
* Taro 开发者社区：https://taro-club.jd.com/

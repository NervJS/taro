---
title: 预渲染（Prerender）
---

Prerender 是由 Taro CLI 提供的在小程序端提高页面初始化渲染速度的一种技术，它的实现原理和服务端渲染（Server-side Rendering）一样：将页面初始化的状态直接渲染为无状态(dataless)的 wxml，在框架和业务逻辑运行之前执行渲染流程。经过 Prerender 的页面初始渲染速度通常会和原生小程序一致甚至更快。

## 为什么需要 Prerender?

Taro Next 在一个页面加载时需要经历以下步骤：

1. 框架（React/Nerv/Vue）把页面渲染到虚拟 DOM 中
2. Taro 运行时把页面的虚拟 DOM 序列化为可渲染数据，并使用 `setData()` 驱动页面渲染
3. 小程序本身渲染序列化数据

和原生小程序或编译型小程序框架相比，步骤 1 和 步骤 2 是多余的。如果页面的业务逻辑代码没有性能问题的话，大多数性能瓶颈出在步骤 2 的 `setData()` 上：由于初始化渲染是页面的整棵虚拟 DOM 树，数据量比较大，因此 `setData()` 需要传递一个比较大的数据，导致初始化页面时会一段白屏的时间。这样的情况通常发生在页面初始化渲染的 wxml 节点数比较大或用户机器性能较低时发生。

## 使用 Prerender

使用 Prerender 非常简单，你可以找到项目根目录下的 `config` 文件夹，根据你的项目情况更改 `index.js`/`dev.js`/`prod.js` 三者中的任意一个[项目配置](./https://nervjs.github.io/taro/docs/config.html)，在编译时 Taro CLI 会根据你的配置自动启动 prerender：

```js
// /project/config/prod.js
const config = {
  ...
  mini: {
    prerender: {
      match: 'pages/shop/**', // 所有以 `pages/shop/` 开头的页面都参与 prerender
      include: ['pages/any/way/index'], // `pages/any/way/index` 也会参与 prerender
      exclude: ['pages/shop/index/index'] // `pages/shop/index/index` 不用参与 prerender
    }
  }
};

module.exports = config
```

完整 Prerender 配置可参看下表：

| 参数 | 类型  | 默认值  | 必填  | 说明 |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| match  | `string` `string[]`  |   | 否 | glob 字符串或 glob 字符串数组，能匹配到本参数的页面会加入 prerender |
|  include | `Array<string>` `Array<PageConfig>`  | `[]` | 否 | 页面路径与数组中字符串完全一致的会加入 prerender
|  exclude | `string[]`  | `[]` | 否 | 页面路径与数组中字符串完全一致的**不会**加入 prerender
| mock  | `Record<string, unknown>`  |   |  否 | 在 prerender 环境中运行的全局变量，键名为变量名，键值为变量值
|  console | `boolean`  | `false`  |  否 | 在 prerender 过程中 `console` 打印语句是否执行
|  transformData | `Function`  |   |  否 | 自定义虚拟 DOM 树处理函数，函数返回值会作为 `transformXML` 的参数
|  transformXML | `Function`  |   |  否 | 自定义 XML 处理函数，函数返回值是 Taro 运行时初始化结束前要渲染的 wxml

在表中有用到的类型：

```typescript
// PageConfig 是开发者在 prerender.includes 配置的页面参数
interface PageConfig {
  path: string // 页面路径
  params: Record<string, unknown> // 页面的路由参数，对应 `getCurrentInstance().router.params`
}

// DOM 树数据，Taro 通过遍历它动态渲染数据
interface MiniData {
  ["cn" /* ChildNodes */]: MiniData[]
  ["nn" /* NodeName */]: string
  ["cl" /* Class */]: string
  ["st" /* Style */]: string
  ["v" /* NodeValue */]: string
  uid: string
  [prop: string]: unknown
}

type transformData = (data: MiniData, config: PageConfig) => MiniData

type transformXML = (
  data: MiniData, 
  config: PageConfig,
  xml: string // 内置 xml 转换函数已经处理好了的 xml 字符串
) => string
```

Prerender 的所有配置选项都是选填的，就多数情况而言只需要关注 `match`、`include`、`exclude` 三个选项，`match` 和 `include` 至少填写一个才能匹配到预渲染页面，三者可以共存，当匹配冲突时优先级为 `match` < `include` < `exclude`。

和所有技术一样，Prerender 并不是银弹，使用 Prerender 之后将会有以下的 trade-offs 或限制：

* 页面打包的体积会增加。Prerender 本质是一种以空间换时间的技术，体积增加的多寡取决于预渲染 wxml 的数量。
* 在 Taro 运行时把真实 DOM 和事件挂载之前（这个过程在服务端渲染被称之为 `hydrate`），预渲染的页面不会相应任何操作。
* Prerender 不会执行例如 `componentDidMount()`(React)/`ready()`(Vue) 这样的生命周期，这点和服务端渲染一致。如果有处理数据的需求，可以把生命周期提前到 `static getDerivedStateFromProps()`(React) 或 `created()`(Vue)。

## 进阶说明和使用

### `PRERENDER` 全局变量

在预渲染容器有一个名为 `PRERENDER` 的全局变量，它的值为 `true`。你可以通过判断这个变量是否存在，给预渲染时期单独编写业务逻辑：

```javascript
if (typeof PRERENDER !== 'undefined') { // 以下代码只会在预渲染中执行
  // do something
}
```

### disablePrerender

对于任意一个原生组件，如果不需要它在 Prerender 时中显示，可以把组件的 `disablePrerender` 属性设置为 `true`，这个组件和它的子孙都不会被渲染为 wxml 字符串。

```jsx
/* id 为 test 的组件和它的子孙在预渲染时都不会显示 */
<View id="test" disablePrerender>
  ...children
</View>
```

### 自定义渲染

当默认预渲染的结果不满足你的预期时，Taro 提供了两个配置项自定义预渲染内容。

Prerender 配置中的 `transformData()` 对需要进行渲染的虚拟 DOM 进行操作：

```javascript
const config = {
  ...
  mini: {
    prerender: {
      match: 'pages/**',
      tranformData (data, { path }) {
        if (path === 'pages/video/index') {
          // 如果是页面是 'page/video/index' 页面只预渲染一个 video 组件
          // 关于 data 的数据结构可以参看上文的数据类型签名
          data.nn = 'video'
          data.cn = []
          data.src = 'https://pornhub.com/av8871239'
          return data
        }

        return data
      }
    }
  }
}
```

Prerender 配置中的 `transformXML()` 可以自定义预渲染输出的 wxml：

```javascript
const config = {
  ...
  mini: {
    prerender: {
      match: 'pages/**',
      tranformXML (data, { path }, xml) {
        if (path === 'pages/video/index') {
          // 如果是页面是 'page/video/index' 页面只预渲染一个 video 组件
          return `<video src="https://pornhub.com/av8871239" />`
        }

        return xml
      }
    }
  }
}
```

### 减少预渲染的 wxml 数量

一般而言，用户只需要看到首屏页面，但实际上页面初次渲染的我们构建的业务逻辑有可能会把页面的所有内容都渲染，而 Taro 初始渲染慢的原因在于首次传递的数据量过大，因此可以调整我们的业务逻辑达到只渲染首屏的目的：

```jsx
class SomePage extends Component {
  state = {
    mounted: false
  }

  componentDidMount () {
    // 等待组件载入，先渲染了首屏我们再渲染其它内容，降低首次渲染的数据量
    // 当 mounted 为 true 时，CompA, B, C 的 DOM 树才会作为 data 参与小程序渲染
    // 注意我们需要在 `componentDidMount()` 这个周期做这件事（对应 Vue 的 `ready()`），更早的生命周期 `setState()` 会与首次渲染的数据一起合并更新
    // 使用 nextTick 确保本次 setState 不会和首次渲染合并更新
    Taro.nextTick(() => {
      this.setState({
        mounted: true
      })
    })
  }

  render () {
    return <View>
      <FirstScreen /> /* 假设我们知道这个组件会把用户的屏幕全部占据 */
      {this.state.mounted && <React.Fragment> /* CompA, B, C 一开始并不会在首屏中显示 */
        <CompA />
        <CompB />
        <CompC />
      </React.Fragment>}
    </View>
  }
}
```

这样的优化除了加快首屏渲染以及 `hydrate` 的速度，还可以降低 Prerender 的所增加的 wxml 体积。当你的优化做得足够彻底时，你会发现多数情况下并不需要 Prerender。

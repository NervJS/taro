---
title: Taro Next H5 跨框架组件库实践 
author: JJ
authorURL: https://github.com/Chen-jj
authorImageURL: http://storage.jd.com/cjj-pub-images/11807297.png
---

![image](https://img30.360buyimg.com/ling/jfs/t1/108543/10/12151/1750297/5e93ef97Ef424d4a7/29cf4e4364e5d3f0.png)

[Taro](https://github.com/NervJS/taro) 是一款多端开发框架。开发者只需编写一份代码，即可生成各小程序端、H5 以及 React Native 的应用。

> [Taro Next](http://taro-docs-in.jd.com/taro/next/docs/next/README.html) 近期已发布 beta 版本，全面完善对小程序以及 H5 的支持，欢迎体验！

本文将重点介绍对 **Taro H5 端组件库**的改造工作。

<!--truncate-->

## 背景

### Taro Next 将支持使用多框架开发

过去的 Taro 1 与 Taro 2 只能使用 React 语法进行开发，但下一代的 Taro 框架对整体架构进行了[升级](https://aotu.io/notes/2020/02/03/taro-next-alpha/)，支持使用 React、Vue、Nerv 等框架开发多端应用。

为了支持使用多框架进行开发，Taro 需要对自身的各端适配能力进行改造。本文将重点介绍对 **Taro H5 端组件库**的改造工作。

### Taro H5

Taro 遵循以微信小程序为主，其他小程序为辅的组件与 API 规范。

但浏览器并没有小程序规范的组件与 API 可供使用，例如我们不能在浏览器上使用小程序的 `view` 组件和 `getSystemInfo`  API。因此我们需要在 H5 端实现一套基于小程序规范的组件库和 API 库。

> Taro H5 架构图：

![](http://storage.jd.com/cjj-pub-images/WX20200402-140148.png)

在 Taro 1 和 Taro 2 中，Taro H5 的组件库使用了 React 语法进行开发。但如果开发者在 Taro Next 中使用 Vue 开发 H5 应用，则不能和现有的 H5 组件库兼容。

所以本文需要面对的核心问题就是：**我们需要在 H5 端实现 React、Vue 等框架都可以使用的组件库**。

### 方案选择

我们最先想到的是使用 Vue 再开发一套组件库，这样最为稳妥，工作量也没有特别大。

但考虑到以下两点，我们遂放弃了此思路：

1. 组件库的可维护性和拓展性不足。每当有问题需要修复或新功能需要添加，我们需要分别对 React 和 Vue 版本的组件库进行改造。
2. Taro Next 的目标是支持使用任意框架开发多端应用。倘若将来支持使用 Angular 等框架进行开发，那么我们需要再开发对应支持 Angular 等框架的组件库。

那么是否存在着一种方案，使得只用一份代码构建的组件库能兼容所有的 web 开发框架呢？

答案就是 **Web Components**。

但在组件库改造为 Web Components 的过程并不是一凡风顺的，我们也遇到了不少的问题，故借此文向大家娓娓道来。

## Web Components 简介

[Web Components](https://www.webcomponents.org/introduction) 由一系列的技术规范所组成，它让开发者可以开发出浏览器原生支持的组件。

### 技术规范

Web Components 的主要技术规范为：

* Custom Elements
* Shadow DOM
* HTML Template

Custom Elements 让开发者可以自定义带有特定行为的 HTML 标签。

Shadow DOM 对标签内的结构和样式进行一层包装。

`<template>` 标签为 Web Components 提供复用性，还可以配合 `<slot>` 标签提供灵活性。

### 示例

定义模板：

```html
<template id="template">
  <h1>Hello World!</h1>
</template>
```

构造 Custom Element：

```js
class App extends HTMLElement {
  constructor () {
    super(...arguments)

    // 开启 Shadow DOM
    const shadowRoot = this.attachShadow({ mode: 'open' })

    // 复用 <template> 定义好的结构 
    const template = document.querySelector('#template')
    const node = template.content.cloneNode(true)
    shadowRoot.appendChild(node)
  }
}
window.customElements.define('my-app', App)
```

使用：

```html
<my-app></my-app>
```

## Stencil

使用原生语法去编写 Web Components 相当繁琐，因此我们需要一个框架帮助我们提高开发效率和开发体验。

业界已经有很多成熟的 [Web Components 框架](https://www.webcomponents.org/libraries)，一番比较后我们最终选择了 [Stencil](https://stenciljs.com/docs/introduction)，原因有二：

1. Stencil 由 Ionic 团队打造，被用于构建 Ionic 的组件库，证明经受过业界考验。
2. Stencil 支持 JSX，能减少现有组件库的迁移成本。

Stencil 是一个可以生成 Web Components 的编译器。它糅合了业界前端框架的一些优秀概念，如支持 Typescript、JSX、虚拟 DOM 等。

### 示例：

创建 Stencil Component：

```jsx
import { Component, Prop, State, h } from '@stencil/core'

@Component({
  tag: 'my-component'
})
export class MyComponent {
  @Prop() first = ''
  @State() last = 'JS'

  componentDidLoad () {
    console.log('load')
  }

  render () {
    return (
      <div>
        Hello, my name is {this.first} {this.last}
      </div>
    )
  }
}
```

使用组件：

```html
<my-component first='Taro' />
```

## 在 React 与 Vue 中使用 Stencil

到目前为止一切都那么美好：使用 Stencil 编写出 Web Components，即可以在 React 和 Vue 中直接使用它们。

但实际使用上却会出现一些问题，[Custom Elements Everywhere](https://custom-elements-everywhere.com/) 通过一系列的测试用例，罗列出业界前端框架对 Web Components 的兼容问题及相关 issues。下面将简单介绍 Taro H5 组件库分别对 React 和 Vue 的兼容工作。

### 兼容 React

#### 1. Props

##### 1.1 问题

React 使用 `setAttribute` 的形式给 Web Components 传递参数。当参数为原始类型时是可以运行的，但是如果参数为对象或数组时，由于 HTML 元素的 attribute 值只能为字符串或 null，最终给 WebComponents 设置的 attribute 会是 `attr="[object Object]"`。

> attribute 与 property [区别](https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html#answer-6004028)

##### 1.2 解决方案

采用 **DOM Property** 的方法传参。

我们可以把 Web Components 包装一层高阶组件，把高阶组件上的 props 设置为 Web Components 的 property：

```js
const reactifyWebComponent = WC => {
  return class extends React.Component {
    ref = React.createRef()

    update () {
      Object.entries(this.props).forEach(([prop, val]) => {
        if (prop === 'children' || prop === 'dangerouslySetInnerHTML') {
          return
        }
        if (prop === 'style' && val && typeof val === 'object') {
          for (const key in val) {
            this.ref.current.style[key] = val[key]
          }
          return
        }
        this.ref.current[prop] = val
      })
    }

    componentDidUpdate () {
      this.update()
    }

    componentDidMount () {
      this.update()
    }

    render () {
      const { children, dangerouslySetInnerHTML } = this.props
      return React.createElement(WC, {
        ref: this.ref,
        dangerouslySetInnerHTML
      }, children)
    }
  }
}

const MyComponent = reactifyWebComponent('my-component')
```

注意：

* children、dangerouslySetInnerHTML 属性需要透传。
* React 中 style 属性值可以接受对象形式，这里需要额外处理。

#### 2. Events

##### 2.1 问题

因为 React 有一套[合成事件系统](https://reactjs.org/docs/events.html)，所以它不能监听到 Web Components 发出的自定义事件。

以下 Web Component 的 onLongPress 回调不会被触发：

```html
<my-view onLongPress={onLongPress}>view</my-view>
```

##### 2.2 解决方案

通过 ref 取得 Web Component 元素，手动 **addEventListener** 绑定事件。

改造上述的高阶组件：

```js
const reactifyWebComponent = WC => {
  return class Index extends React.Component {
    ref = React.createRef()
    eventHandlers = []

    update () {
      this.clearEventHandlers()

      Object.entries(this.props).forEach(([prop, val]) => {
        if (typeof val === 'function' && prop.match(/^on[A-Z]/)) {
          const event = prop.substr(2).toLowerCase()
          this.eventHandlers.push([event, val])
          return this.ref.current.addEventListener(event, val)
        }

        ...
      })
    }

    clearEventHandlers () {
      this.eventHandlers.forEach(([event, handler]) => {
        this.ref.current.removeEventListener(event, handler)
      })
      this.eventHandlers = []
    }

    componentWillUnmount () {
      this.clearEventHandlers()
    }
    
    ...
  }
}
```

#### 3. Ref

##### 3.1 问题

我们为了解决 Props 和 Events 的问题，引入了高阶组件。那么当开发者向高阶组件传入 ref 时，获取到的其实是高阶组件，但我们希望开发者能获取到对应的 Web Component。

domRef 会获取到 `MyComponent`，而不是 `<my-component></my-component>`

```jsx
<MyComponent ref={domRef} />
```

##### 3.2 解决方案

使用 [forwardRef](https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components) 传递 ref。

改造上述的高阶组件为 forwardRef 形式：

```js
const reactifyWebComponent = WC => {
  class Index extends React.Component {
    ...
    
    render () {
      const { children, forwardRef } = this.props
      return React.createElement(WC, {
        ref: forwardRef
      }, children)
    }
  }
  return React.forwardRef((props, ref) => (
    React.createElement(Index, { ...props, forwardRef: ref })
  ))
}
```

#### 4. Host's className

##### 4.1 问题

在 Stencil 里我们可以使用 Host 组件为 host element 添加类名。

```js
import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'todo-list'
})
export class TodoList {
  render () {
    return (
      <Host class='todo-list'>
        <div>todo</div>
      </Host>
    )
  }
}
```

然后在使用 `<todo-list>` 元素时会展示我们内置的类名 “todo-list” 和 Stencil 自动加入的类名 “hydrated”：

![](http://storage.jd.com/cjj-pub-images/WX20200401-102833.png)

但如果我们在使用时设置了动态类名，如： `<todo-list class={this.state.cls}>`。那么在动态类名更新时，则会把内置的类名 “todo-list” 和 “hydrated” 抹除掉。

**关于类名 “hydrated”：**

Stencil 会为所有 Web Components 加上 `visibility: hidden;` 的样式。然后在各 Web Component 初始化完成后加入类名 “hydrated”，将 `visibility` 改为 `inherit`。如果 “hydrated” 被抹除掉，Web Components 将不可见。

因此我们需要保证在类名更新时不会覆盖 Web Components 的内置类名。

##### 4.2 解决方案

高阶组件在使用 ref 为 Web Component 设置 className 属性时，对内置 class 进行合并。

改造上述的高阶组件：

```js
const reactifyWebComponent = WC => {
  class Index extends React.Component {
    update (prevProps) {
      Object.entries(this.props).forEach(([prop, val]) => {
        if (prop.toLowerCase() === 'classname') {
          this.ref.current.className = prevProps
            // getClassName 在保留内置类名的情况下，返回最新的类名
            ? getClassName(this.ref.current, prevProps, this.props)
            : val
          return
        }

        ...
      })
    }

    componentDidUpdate (prevProps) {
      this.update(prevProps)
    }

    componentDidMount () {
      this.update()
    }

    ...
  }
  return React.forwardRef((props, ref) => (
    React.createElement(Index, { ...props, forwardRef: ref })
  ))
}
```

### 兼容 Vue

不同于 React，虽然 Vue 在传递参数给 Web Components 时也是采用 `setAttribute` 的方式，但 v-bind 指令提供了 [.prop](https://cn.vuejs.org/v2/api/#v-bind) 修饰符，它可以将参数作为 DOM property 来绑定。另外 Vue 也能监听 Web Components 发出的自定义事件。

因此 Vue 在 Props 和 Events 两个问题上都不需要额外处理，但在与 Stencil 的配合上还是有一些兼容问题，接下来将列出主要的三点。

#### 1. Host's className

##### 1.1 问题

同上文兼容 React 第四部分，在 Vue 中更新 host element 的 class，也会覆盖内置 class。

##### 1.2 解决方案

同样的思路，需要在 Web Components 上包装一层 Vue 的自定义组件。

```js
function createComponent (name, classNames = []) {
  return {
    name,
    computed: {
      listeners () {
        return { ...this.$listeners }
      }
    },
    render (createElement) {
      return createElement(name, {
        class: ['hydrated', ...classNames],
        on: this.listeners
      }, this.$slots.default)
    }
  }
}

Vue.component('todo-list', createComponent('todo-list', ['todo-list']))
```

注意：

* 我们在自定义组件中重复声明了 Web Component 该有的内置类名。后续开发者为自定义组件设置类名时，Vue 将会[自动对类名进行合并](https://cn.vuejs.org/v2/guide/components-props.html#%E6%9B%BF%E6%8D%A2-%E5%90%88%E5%B9%B6%E5%B7%B2%E6%9C%89%E7%9A%84-Attribute)。
* 需要把自定义组件上绑定的事件通过 [$listeners](https://cn.vuejs.org/v2/guide/components-custom-events.html#%E5%B0%86%E5%8E%9F%E7%94%9F%E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A%E5%88%B0%E7%BB%84%E4%BB%B6) 透传给 Web Component。

#### 2. Ref

##### 2.1 问题

为了解决问题 1，我们给 Vue 中的 Web Components 都包装了一层自定义组件。同样地，开发者在使用 ref 时取到的是自定义组件，而不是 Web Component。

##### 2.2 解决方案

Vue 并没有 forwardRef 的概念，只可简单粗暴地修改 `this.$parent.$refs`。

为自定义组件增加一个 mixin：

```js
export const refs = {
  mounted () {
    if (Object.keys(this.$parent.$refs).length) {
      const refs = this.$parent.$refs

      for (const key in refs) {
        if (refs[key] === this) {
          refs[key] = this.$el
          break
        }
      }
    }
  },
  beforeDestroy () {
    if (Object.keys(this.$parent.$refs).length) {
      const refs = this.$parent.$refs

      for (const key in refs) {
        if (refs[key] === this.$el) {
          refs[key] = null
          break
        }
      }
    }
  }
}
```

注意：

* 上述代码没有处理循环 ref，循环 ref 还需要另外判断和处理。

#### 3. v-model

##### 3.1 问题

我们在自定义组件中使用了渲染函数进行渲染，因此对表单组件需要额外处理 [v-model](https://cn.vuejs.org/v2/guide/render-function.html#v-model)。

##### 3.2 解决方案

使用自定义组件上的 `model` 选项，定制组件使用 `v-model` 时的 prop 和 event。

改造上述的自定义组件：

```js
export default function createFormsComponent (name, event, modelValue = 'value', classNames = []) {
  return {
    name,
    computed: {
      listeners () {
        return { ...this.$listeners }
      }
    },
    model: {
      prop: modelValue,
      event: 'model'
    },
    methods: {
      input (e) {
        this.$emit('input', e)
        this.$emit('model', e.target.value)
      },
      change (e) {
        this.$emit('change', e)
        this.$emit('model', e.target.value)
      }
    },
    render (createElement) {
      return createElement(name, {
        class: ['hydrated', ...classNames],
        on: {
          ...this.listeners,
          [event]: this[event]
        }
      }, this.$slots.default)
    }
  }
}

const Input = createFormsComponent('taro-input', 'input')
const Switch = createFormsComponent('taro-switch', 'change', 'checked')
Vue.component('taro-input', Input)
Vue.component('taro-switch', Switch)
```

## 总结

当我们希望创建一些不拘泥于框架的组件时，Web Components 会是一个不错的选择。比如跨团队协作，双方的技术栈不同，但又需要公用部分组件时。

本次对 React 语法组件库进行 Web Components 化改造，工作量不下于重新搭建一个 Vue 组件库。但日后当 Taro 支持使用其他框架编写多端应用时，只需要针对对应框架与 Web Components 和 Stencil 的兼容问题编写一个胶水层即可，总体来看还是值得的。

关于胶水层，业界兼容 React 的方案颇多，只是兼容 Web Components 可以使用 [reactify-wc](https://github.com/BBKolton/reactify-wc)，配合 Stencil 则可以使用官方提供的插件 [Stencil DS Plugin](https://github.com/ionic-team/stencil-ds-plugins/blob/master/README.md)。倘若 Vue 需要兼容 Stencil，或需要提高兼容时的灵活性，还是建议手工编写一个胶水层。

本文简单介绍了 Taro Next、Web Components、Stencil 以及基于 Stencil 的组件库改造历程，希望能为读者们带来一些帮助与启迪。

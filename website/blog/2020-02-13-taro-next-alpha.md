---
title: Taro Next 发布预览版：同时支持 React / Vue / Nerv 
author:yuche
authorURL: https://github.com/yuche
authorImageURL: https://static.geekbang.org/ck/5cb53de0e50c0.jpeg?imageView2/0/w/800
---

![image](https://img14.360buyimg.com/ling/jfs/t1/103557/3/12087/1051626/5e44b357E4cab8765/d8c821c4a3e1060d.png)

自 Taro 2.0 起，我们将会启动对整个 Taro 系统架构的革新，这次革新我们将其称之为 Taro Next。Taro Next 革新完成之后，Taro 本身的拓展性、稳定性、可维护性都会大幅提高，相应地，使用 Taro 的开发者也会获得更好的开发体验，降低更多开发成本和学习成本。

我们目前已经完成了**编译系统和小程序端的重构**，通过 `npm i -g @tarojs/cli@next` 安装 Taro CLI 预览（alpha）版之后，使用 `taro init` 创建新项目即可体验 Taro Next 的新特性。

<!--truncate-->

## 同时支持 React/Vue/Nerv 三种框架

在旧版本的 Taro，我们以微信小程序的开发规范为基准，使用 React/JSX 的方式来进行开发。而在 Taro Next，我们把这一思路量化为一个编程模型：

设微信小程序生命周期为一个 `interface`，不同的框架实例的生命周期虽然不尽相同，但我们可以根据框架生命周期分别新建一个 `class` 去 `implements` 小程序生命周期的 `interface`。相应地，小程序的组件/API/路由规范可以使用同样的思路和模型让不同框架的代码，运行在不同的端上：

![taro](http://storage.jd.com/taro-source/taro-docs/WechatIMG1393.png)

## 不限制语言、语法

由于 Taro Next 的架构出现了变化，表面上来看 Taro 从一个编译型框架变成了一个运行时框架。但究其内核是整体的设计思路出现了变化：从前是「模拟（`mock`）」，现在是「实现（`implements`）」。在 Taro Next 我们实现了 React 在小程序中的完整支持，因此这类曾经的 Taro 无法运行的代码在 Taro Next 中完全没有压力：

```jsx
import { View } from '@tarojs/components'
function Page (props) {
    const view = React.createElement(View, null, props.text)
    return [view, React.Children.only(this.props.children)]
}
```

在旧版本的 Taro 中我们对 JavaScript 和 TypeScript 进行了 First Class 的支持，Taro Next 我们更进一步，原理上最终可以编译到 JavaScript 的语言都可以用来构建 Taro 项目，以下是一个在 Vue 中使用 CoffeeScript 的例子：

```js
// config.js
{
    webpackChain (chain) {
        chain.merge({
            module: {
                rule: {
                    test: /\.coffee$/,
                    use: [ 'coffee-loader' ]
                }
            }
        })
    }
}
```

```html
<template>
    <view>{{ title }}</view>
    <view>{{ text }}</view>
    <input v-model='text' />
</template>

<script lang="coffee">
export default
    props:
        title:
        type: String
        required: true
    data: ->
        text: 'text'
</script>
```

## 更快的运行速度

运行时性能主要分为两个部分，一是更新性能，二是初始化性能。

对于更新性能而言，旧版本的 Taro 会把开发者 `setState` 的数据进行一次全量的 diff，最终返回给小程序是按路径更新的 `data`。而在 Taro Next 中 diff 的工作交给了开发者使用的框架（React/Nerv/Vue），而框架 diff 之后的数据也会通过 Taro 按路径去最小化更新。因此开发者可以根据使用框架的特性进行更多更细微的性能优化。

初始化性能则是 Taro Next 的痛点。原生小程序或编译型框架的初始数据可以直接用于渲染，但 Taro Next 在初始化时会把框架的渲染数据转化为小程序的渲染数据，多了一次 `setData` 开销。

为了解决这个问题，Taro 从服务端渲染受到启发，在 Taro CLI 将页面初始化的状态直接渲染为无状态的 wxml，在框架和业务逻辑运行之前执行渲染流程。我们将这一技术称之为预渲染（Prerender），经过 Prerender 的页面初始渲染速度通常会和原生小程序一致甚至更快。

## 更快的构建速度和 source-map 支持

作为一个编译型框架，旧版本的 Taro 会进行大量的 AST 操作，这类操作显著地拖慢了 Taro CLI 的编译速度。而在 Taro Next 中不会操作任何开发者代码的 AST，因此编译速度得到了大幅的提高。

正因为 AST 操作的取消，Taro Next 也轻松地实现了 `source-map` 的支持。这对于开发体验是一个巨大的提升：

![source-map](http://storage.jd.com/taro-source/taro-docs/WechatIMG1402.png)

## 不忘初心

在做到以上各项特性的同时，我们也没有丢掉原来就已经支持的特性：

* 支持微信小程序、百度智能小程序、支付宝小程序、QQ 小程序、字节跳动小程序
* 使用原生小程序第三方组件/插件
* 多端条件编译
* 跨端 API 和样式处理

这些特性基本涉及到了小程序开发的方方面面，虽然是预览版，但 Taro Next 已经具备了开发生产级小程序的准备，在 Taro 团队内部和兄弟团队也有多款小程序正在使用 Taro Next 进行开发。而在 Taro Next 的 H5 端和移动端，我们还在进行紧张的开发。当 Taro Next 测试（beta）版发布时，使用 Taro Next 构建的一套代码，就可以同时运行在各种小程序、快应用、H5 和移动端当中。在未来，我们还会把 Taro Next 的能力开放出去，让开发者只要写少量的接入代码，就可以使用自己喜欢的任意框架（Angular, Flutter, svelte...）开发小程序或多端应用。

## 牢记使命

正如我们在 Taro 2.0 发布时所言：

> 节物风光不相待，桑田碧海须臾改。
>
> 20 年代呼啸而来，下一个 10 年，很多框架都会死去，很多技术也会焕然而生，没有什么是不变的，唯一不变的只有变化，我们能做的也只能是拥抱变化。

前端技术一直在高速发展，流行的技术和框架每年都各不相同。但我们始终没有忘记开发 Taro 的初心和使命：**降低开发成本，提高开发体验和开发效率。**

「不忘初心，牢记使命。」

这就是 Taro 团队拥抱变化的方式。

## 参考资料

[1] 小程序跨框架开发的探索与实践: https://www.infoq.cn/article/TMqBzVFTSiQTUbgxydPm

[2] Taro Next 旧版本迁移指南：https://taro-docs.jd.com/taro/next/docs/migration.html

[3] Prerender: https://taro-docs.jd.com/taro/next/docs/prerender.html

[4] 性能测试：https://github.com/NervJS/taro-benchmark/tree/next

[5] 与其它新型小程序的对比：https://taro-docs.jd.com/taro/next/docs/difference-to-others.html

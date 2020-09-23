---
id: 2020-09-01-taro-versions
title: Taro 版本升级权威指南
author: 隔壁老李
author_url: https://github.com/luckyadam
author_image_url: https://avatars2.githubusercontent.com/u/1782542?s=460&u=d20514a52100ed1f82282bcfca6f49052793c889&v=4
tags: [v3]
description: 你是否对 Taro 辣么多版本感到非常困惑？你是否对升级 Taro 感到束手无策？本篇文章将为你答疑解惑，全面解读 Taro 开发那些事儿。
---

![](https://storage.360buyimg.com/taro-resource/taro_version2.jpg)

> [Taro](https://github.com/NervJS/taro) 是一款由京东[凹凸实验室](https://aotu.io)推出的开放式跨端跨框架解决方案，致力于解决小程序、H5、React Native 的跨端同构问题，支持同时使用 React 和 Vue 来进行开发。本文由 Taro 团队成员隔壁老李撰写，旨在帮助 Taro 开发者厘清当前 Taro 多版本之间关系的那些事儿，同时解答有关 Taro 3、Taro RN 支持以及 Taro UI 的一些困惑。

<!--truncate-->

 自从 Taro 在今年 7 月份推出 [3.0 版本](https://juejin.im/post/6844904205367377933)，宣布同时支持 React 和 Vue 来开发跨端应用之后，Taro 的关注度得到了进一步地提升，很多开发者开始尝试升级自身项目到 3.0 来体验新的特性，同时，Taro 社区也开始迎来一些新朋友，业界有很多 Vue 开发者在做技术选型时开始将目光投向 Taro。

但由于 Taro 大版本之间差异较大，而社区内很多关于 Taro 的教程文章以及示例项目目前还停留 Taro 1/2 时代，导致很多开发者使用 Taro 3.0 尝试时出现奇怪的问题，所以 Taro 团队想通过本文帮助大家理解 Taro 各个版本之间的联系，协助大家更好地完成版本迁移，避免出现一些难以解决的奇怪问题。

## 区分 Taro 版本的火眼金睛

Taro 目前有 3 个大版本，但如果按照架构来真正划分时代的话，Taro 1/2 属于第一代架构，而 Taro 3 则属于第二代架构，两代架构差异巨大，甚至可以完全认为是 2 个框架。当然，这只是对于框架内核而言，对于开发者，Taro 团队已经尽量在保证大版本之间的兼容性，着力降低版本迁移的难度。

### Taro 1/2

Taro 1/2 属于编译型架构，主要通过对类 React 代码进行语法编译转换地方式，得到各个端可以运行的代码，再配合非常轻量的运行时适配，以及根据标准组件库、API 进行差异抹平，从而实现多端适配的目的，整体架构如下。

![](https://storage.360buyimg.com/taro-resource/taro1.jpg)

而 Taro 1 与 Taro 2 的都是基于这种架构建立的方案，他们之间的区别主要是 Taro 1 在小程序端是自建构建体系，而 Taro 2 则是所有端都采用 Webpack 进行编译，可以降低 Taro 自身编译系统的复杂度，同时能够让开发者使用 Webpack 的生态来自定义编译过程和结果，可以认为 Taro 2 是 Taro 1 和 3 之间的一个过渡性版本。

### Taro 3

Taro 3 则可以大致理解为解释型架构（相对于 Taro 1/2 而言），主要通过在小程序端模拟实现 DOM、BOM API 来让前端框架直接运行在小程序环境中，从而达到小程序和 H5 统一的目的，而对于生命周期、组件库、API、路由等差异，我们依然可以通过定义统一标准，各端负责各自实现的方式来进行抹平。而正因为 Taro 3 的原理，所以我们可以在 Taro 3 中同时支持 React、Vue 等框架，甚至我们还支持了 jQuery，在不久的将来我们还能支持让开发自定义地去拓展其他框架的支持，比如 Angular，Taro 3 整体架构如下。

![](https://storage.360buyimg.com/taro-resource/taro2.jpg)

### 版本选择的取舍

通过上述内容可以看出，Taro 两代架构之间差异巨大，从而也就导致了他们之间的特性也很不一样。Taro 1/2 和 Taro 3 之间特性的差异主要体现在开发体验与性能上。

从开发体验上看，Taro 3 明显是优于 Taro 1/2 的，受益于 Taro 3 架构的原理，我们可以在 Taro 3 中使用完整的 React、Vue 语法特性来进行开发，从而在开发体验上让多端开发无限接近于 Web 开发，这对深耕 Web 而初次接触小程序的开发者来说是非常友好的。而对 Taro 熟悉的朋友肯定知道 Taro 1/2 在开发时会有诸多限制，尤其是在 JSX 书写上，我们总会需要一些手段来绕过这些限制，这就导致开发体验小有不足。

从性能上看，某些情况下 Taro 1/2 会优于 Taro 3，如果你的应用非常复杂，页面节点非常多，有非常多的大规模更新操作，对性能要求比较苛刻的话，Taro 1/2 会是不错的选择，而 Taro 1 和 2 我们更推荐使用 Taro 2。当然，根据我们的测试，对于大部分应用来说 Taro 1/2 和 Taro 3 的性能差异并不明显，我们后续会给出 benchmark 来印证这一点，而且，对于 Taro 3 本身在性能存在劣势的场景，Taro 官方团队已经给出了相应的解决方案来应对。比如，提升首次渲染速度，我们可以使用[预渲染](https://nervjs.github.io/taro/docs/prerender)；对于无限滚动加载的列表场景，我们提供了[虚拟列表组件](https://nervjs.github.io/taro/docs/virtual-list)。

对于开发者来说，开发体验和性能往往是需要权衡来寻找平衡点的，缺一不可，所以现阶段，我们更加推荐使用 Taro 3 来开发多端应用。而且现阶段 Taro 团队的研发重心主要放在 Taro 3 上，新的特性会优先在 Taro 3 上进行尝试，所以，在未来 Taro 3 将更具有想象力，会有更多好玩的东西推出来。

## 平滑升级不完全指南

Taro 2 和 Taro 3 都有对应的迁移指南，根据迁移指南往往能规避大部分的问题。

Taro 1 升级到 Taro 2 的[迁移指南](https://nervjs.github.io/taro/docs/2.2.13/migrate-to-2)。

Taro 1/2 升级到 Taro 3 的[迁移指南](https://nervjs.github.io/taro/docs/migration)。

当然，迁移指南肯定无法覆盖到所有问题所有情况，我们在 Taro 交流群的日常交流中总是能观察到一些迁移的问题，所以在这里，我们将梳理一遍迁移指南，同时就一些常见的问题，再做一些说明补充，来解答开发者们的升级困惑。

### Taro 1 升级到 Taro 2

Taro 1 升 Taro 2 所需要做的工作并不多，根据[迁移指南](https://nervjs.github.io/taro/docs/2.2.13/migrate-to-2)，主要是新增了一个 `@tarojs/mini-runner` 依赖，以及对编译配置的调整，而在这里容易出问题的往往是在编译配置调整中，所以我们总结了一下针对编译配置的调整内容。

- `plugins` 配置调整，调整前是一个对象，调整后为一个数组，用来配置 [Taro 插件](https://nervjs.github.io/taro/docs/2.2.13/config-detail#plugins)，非常值得注意的是这个配置请与 `babel` 配置里的 `plugins` 区分开来，后者是用来配置 babel 插件的，这是一个非常常见的配置错误
- `babel`、`csso`、`uglify` 等配置从旧的 `plugins` 配置中移出来了，调整为与 `sourceRoot` 和 `outputRoot` 等同级的配置项
- `weapp` 配置项改名为 `mini`
- `postcss` 配置项下去掉 `module` 这一级配置，原 `module` 下的配置项直接置于 `postcss` 下

#### 关于 async functions 的使用

同时，从 Taro 2 开始，使用 async functions 不再需要安装 `@tarojs/async-await` 依赖了，而是通过安装 babel 插件 `babel-plugin-transform-runtime` 配合 `babel-runtime` 来实现支持，具体请查看文档[异步编程指南](https://nervjs.github.io/taro/docs/2.2.13/async-await)。

而在 Taro 3 中则不再需要手动安装配置，Taro 的官方 babel 预设 `babel-preset-taro` 已经内置了相关配置。

### Taro 1/2 升级到 Taro 3

Taro 1/2 升级到 Taro 3 则相对来说要麻烦许多，但是[迁移指南](https://nervjs.github.io/taro/docs/migration)中其实介绍得已经非常详细了，我们在这里总结一下需要调整的内容。

#### 文件调整
文件调整主要如下：
- **babel 配置**，在项目目录下新增了 [`babel.config.js`](https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md) 配置文件来配置 babel，为此，请去掉编译配置（config/index.js）中的 `babel` 配置，[请参见说明](https://nervjs.github.io/taro/docs/migration/#%E7%BC%96%E8%AF%91%E4%BE%9D%E8%B5%96%E5%BA%93)
- **项目/页面配置**，新增项目/页面同名的配置文件 `*.config.js`（或者 `*.config.ts`）, `*` 代表页面/项目文件的文件名，`config` 文件必须和页面/项目文件在同一文件夹，[请参见说明](https://nervjs.github.io/taro/docs/migration/#%E9%A1%B9%E7%9B%AE%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE)

#### 编译配置调整
主要参考上述 Taro 1 升级到 Taro 2 时的调整，新增 Taro 3 特有配置 framework 配置，取值为使用的框架（react, nerv, vue, vue3），[请参见说明](https://nervjs.github.io/taro/docs/migration/#%E7%BC%96%E8%AF%91%E9%85%8D%E7%BD%AE)


#### 项目依赖调整

在 Taro 3 中有很多旧的项目依赖已经不再需要了，例如之前做平台运行时兼容的 `@tarojs/taro-weapp`、`@tarojs/taro-alipay` 等等，而同时也新增了一些新依赖项，例如 `@tarojs/runtime` 等，具体 Taro 3 会需要哪些依赖，可以通过创建 Taro 示例项目看到，在这里我们列出了 Taro 3 目前仍需使用的 NPM 包名及其具体作用。

| NPM 包           |   描述 |
| ------------- |:------------- |
| [`babel-preset-taro`](https://www.npmjs.com/package/babel-preset-taro)      |  给 Taro 项目使用的 babel preset |
| [`@tarojs/taro`](https://www.npmjs.com/package/@tarojs/taro)      |  暴露给应用开发者的 Taro 核心 API  |
| [`@tarojs/shared`](https://www.npmjs.com/package/@tarojs/shared)      |  Taro 内部使用的 utils  |
| [`@tarojs/api`](https://www.npmjs.com/package/@tarojs/api)      |  暴露给 @tarojs/taro 的所有端的公有 API  |
| [`@tarojs/taro-h5`](https://www.npmjs.com/package/@tarojs/taro-h5) |  暴露给 @tarojs/taro 的 H5 端 API  |
| [`@tarojs/router`](https://www.npmjs.com/package/@tarojs/router) |  Taro H5 路由  |
| [`@tarojs/react`](https://www.npmjs.com/package/@tarojs/react) | 基于 react-reconciler 的小程序专用 React 渲染器  |
| [`@tarojs/cli`](https://www.npmjs.com/package/@tarojs/cli) | Taro 开发工具   |
| [`@tarojs/extend`](https://www.npmjs.com/package/@tarojs/extend) | Taro 扩展，包含 jQuery API 等   |
| [`@tarojs/helper`](https://www.npmjs.com/package/@tarojs/helper) | 内部给 CLI 和 runner 使用辅助方法集  |
| [`@tarojs/service`](https://www.npmjs.com/package/@tarojs/service) | Taro 插件化内核  |
| [`@tarojs/taro-loader`](https://www.npmjs.com/package/@tarojs/taro-loader) | 露给 @tarojs/mini-runner 和 @tarojs/webpack-runner 使用的 Webpack loader  |
| [`@tarojs/runner-utils`](https://www.npmjs.com/package/@tarojs/runner-utils) | 暴露给 @tarojs/mini-runner 和 @tarojs/webpack-runner 的公用工具函数  |
| [`@tarojs/webpack-runner`](https://www.npmjs.com/package/@tarojs/webpack-runner) |  Taro H5 端 Webpack 打包编译工具  |
| [`@tarojs/mini-runner`](https://www.npmjs.com/package/@tarojs/mini-runner) |  Taro 小程序 端 Webpack 打包编译工具  |
| [`@tarojs/components`](https://www.npmjs.com/package/@tarojs/components) | Taro 标准组件库，H5 版 |
| [`@tarojs/taroize`](https://www.npmjs.com/package/@tarojs/taroize) | Taro 小程序反向编译器  |
| [`@tarojs/with-weapp`](https://www.npmjs.com/package/@tarojs/with-weapp) | 反向转换的运行时适配器  |
| [`eslint-config-taro`](https://www.npmjs.com/package/eslint-config-taro)      |  Taro ESLint 规则  |
| [`eslint-plugin-taro`](https://www.npmjs.com/package/eslint-plugin-taro)      |  Taro ESLint 插件  |

#### 代码调整
代码调整主要如下：
- **API 引入**，前端框架（React/Nerv/Vue）自身的 API 直接从框架引入，与 Web 保持一致，只有 Taro 提供的相关 API，还是从 `@tarojs/taro` 引入，[请参见说明](https://nervjs.github.io/taro/docs/migration/#api)
- **App 代码调整**，对于 React/Nerv 项目，项目入口 App 的 render 函数固定修改为返回 `this.props.children`，如下
```jsx
import { Component } from 'react'
import './app.scss'

class App extends Component {
  render() {
    return this.props.children
  }
}
export default App
```
- **路由功能**，使用 `getCurrentInstance().router` 替代 `this.$router`，`getCurrentInstance` 作为新 API 从 `@tarojs/taro` 引入，[请参见说明](https://nervjs.github.io/taro/docs/migration/#%E8%B7%AF%E7%94%B1)
- **生命周期**，主要是使用 React 后，带来的生命周期调整，[请参见说明](https://nervjs.github.io/taro/docs/migration/#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
- **使用第三方 React 库**，对于 redux、mobx 等 React 生态库，可以直接像 Web 开发那样直接使用，[请参见说明](https://nervjs.github.io/taro/docs/migration/#%E4%BD%BF%E7%94%A8%E7%AC%AC%E4%B8%89%E6%96%B9-react-%E5%BA%93)
- **Ref & DOM**，[请参见说明](https://nervjs.github.io/taro/docs/migration/#ref--dom)
- **不再需要传入 $scope**，在 Taro 1/2 时调用某些 API 需要传入 `this.$scope`，相当于传入组件对应的小程序原生对象，而 Taro 3 则不再需要，具体[请参见说明](https://nervjs.github.io/taro/docs/migration/#scope-%E5%92%8C-componenttype)
- **样式调整**，组件直接受全局样式影响，不再需要设置 `addGlobalClasses`，[请参见说明](https://nervjs.github.io/taro/docs/migration/#%E6%A0%B7%E5%BC%8F)

当然，迁移指南内容并不仅仅局限于版本迁移，由于 Taro 3 相对与 Taro 1/2 有很多 breaking changes，所以建议使用 Taro 3 的开发者都能在开发前阅读一遍[迁移指南](https://nervjs.github.io/taro/docs/migration)。

## 不得不唠叨一下 Taro 3 的正确使用姿势

正如前文所提到的，目前有很多开发者是从 Taro 3 才开始接触 Taro，而目前市面上很多 Taro 相关的教程和项目都是 Taro 1/2 的，这对于很多开发者来说会造成不小的困惑，所以行文到此，我们希望列举一些常见问题来帮助开发者规避掉一些不必要的错误。

### Taro 多版本共存问题

很多开发曾经使用 Taro 旧版本开发过项目，已经在全局安装了 Taro，但是想同时体验到 Taro 3，应该如何进行操作？

我们提供了两种思路：

- 如果是需要新创建 Taro 3 项目，可以使用 [nvm](https://github.com/nvm-sh/nvm) 来管理 node 版本，通过安装不同 node 版本来安装不同版本的 Taro CLI，从而解决 Taro 多版本共存的问题
- 如果是部分已有项目需要升级到 Taro 3，可以在这些项目本地安装相应版本的 Taro CLI，这样通过 `yarn` 或者 `npm` 执行命令的话就会直接使用本地安装的 Taro CLI，安装方式 `yarn add @tarojs/cli`

### 将 Taro CLI 版本与项目中 Taro 相关依赖的版本保持一致
请时刻注意将 Taro CLI 版本与项目中 Taro 相关依赖的版本保持一致。

CLI 与项目依赖版本不一致是导致很多问题出现的源头之一。例如，Taro CLI 版本为 3.0.8，那么 Taro 相关依赖的版本也必须是 3.0.8，Taro 相关包名可以从这个[列表](https://nervjs.github.io/taro/docs/CONTRIBUTING#taro-%E7%BB%84%E6%88%90)得知，具体依赖项版本可以使用 `taro info` 命令或者通过 `package.json` 就能知晓。

如果发现不一致的情况可以使用 Taro 升级命令 `taro update self [版本号]` 和 `taro update project [版本号]`来分别将 CLI 和项目依赖升级到指定版本；或者也可以手动安装相应版本 CLI，修改 `package.json` 依赖版本号，然后重装依赖来解决。

### 使用路由

在 Taro 3 中使用路由在前文的版本迁移部分已有提及，同时需要了解更多内容可以前往[官方文档](https://nervjs.github.io/taro/docs/router)查看。

非常值得注意的是，无论是获取项目传入参数还是页面入参，都是通过  `getCurrentInstance().router` 来获取的，具体使用如下。

```javascript
import { getCurrentInstance } from '@tarojs/taro'
import React, { Component } from 'react'

export default class C extends Component {
  componentDidMount () {
    console.log(getCurrentInstance().router.params)
  }
}
```

### 如何获取页面节点信息

由于 Taro 3 设计机制的原因，需要在新增的 `onReady` 生命周期内才能调用 Taro API 正确获取页面节点信息，小程序和 H5 都是如此。

而同时，在微信小程序中当页面节点嵌套过深时，超过一定层级（默认 16 级，可以通过编译配置 `baseLevel` 来控制）时，Taro 将转而使用自定义组件，然后再开启新的循环，在这种情况要争取获取页面节点信息的话，需要使用 **跨自定义组件的后代选择器** 来进行选择，可以参见 Taro [相关 issue](https://github.com/NervJS/taro/issues/7411)。

### Taro UI 是不是不支持 Taro 3 了

在 Taro 3 中依然可以使用 Taro UI，目前需要安装 Taro UI 的 alpha 版本。

```bash
$ yarn add taro-ui@next
```

Taro UI 作为 Taro 的官方 UI 库，依然处于维护状态，目前主要依靠社区力量在进行维护，同时也非常欢迎更多社区开发人员共同参与到 Taro UI 的迭代中来。

### Taro UI 有没有 Vue 版本

目前，Taro 官方没有推出 Vue 版本的 Taro UI 库，但在社区中有 Vue 版本的解决方案，如果使用 Vue 进行开发可以尝试 [taro-ui-vue](https://github.com/psaren/taro-ui-vue)。

### 为什么 Taro 3 打包出来的应用体积巨大

很多朋友会发现 Taro 3 的项目在预览的时候打包出来的包大小相比 Taro 1/2 要大上很多，然后非常紧张用了 Taro 3 会不会导致自己的主包超限。

诚然，在预览的时候 Taro 3 默认生成的包会比较大，主要是因为为了方便调试，预览时引用的 React 和 Vue 用的是调试用库，而且同时预览时会生成 sourceMap，这就导致预览时生成的包会大很多，但是在打包生产包（去掉 --watch）时，最终生成包还是会很小的，对线上不会有太大影响，同时 Taro 团队也正在尝试不断优化生产包大小，进一步优化 Taro 性能。

如果想要在预览时降低包大小，可以设置 `NODE_ENV` 为 `production` 来开启压缩，例如编译微信小程序

```bash
# Mac
$ NODE_ENV=production taro build --type weapp --watch

# Windows
$ set NODE_ENV=production && taro build --type weapp --watch
```

### 在 Taro 3 中使用小程序原生页面及组件

在 Taro 3 中依然可以像 Taro 1/2 那样引入小程序原生页面及组件，且使用方式大体一致，不过在某些情况有些细微差别，比如 `slot` 的使用，在 Taro 1/2 中可以直接使用 `slot` 标签，而在 Taro 3 中则需要从 `@tarojs/components` 中引入 `Slot` 组件然后再进行使用。

```jsx
import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Text, Slot } from '@tarojs/components'

export default class Index extends Component {
  state = {
    show: false,
    date: ''
  }
  render () {
    const { show, date } = this.state
    return (
      <View className='index'>
        <van-button type='primary' onClick={this.showCalendar}>显示日历</van-button>
        <van-calendar
          show={show}
          showConfirm
          type='range'
          onClose={this.closeCalendar}
          onConfirm={this.onConfirm}
          >
          <Slot name='title'>
            <View>Hello world</View>
          </Slot>
        </van-calendar>
      </View>
    )
  }
}
```

具体使用情况可以参考项目 [taro3-vant-sample](https://github.com/NervJS/taro3-vant-sample)。


### 有哪些 Taro 官方的示例项目

目前 Taro 3 的社区示例项目还在完善中，Taro 官方则分别针对 React 和 Vue 提供了示例的组件库项目以供参考，安装最新版本的 Taro CLI，在创建项目时选择社区优质模板源创建即可进行体验。

![](https://storage.360buyimg.com/taro-resource/template.jpg)

同时，Taro 官方还提供了一个 [TodoMVC 项目](https://github.com/NervJS/TodoMVC)以供参考学习，React 和 Vue 示例分别在 react 和 vue 分支上。

### Taro 物料市场中哪些物料能在 Taro 3 中使用

目前 Taro 物料市场没有做好针对物料的版本区分，我们会尽快启动这一项工作，为每个物料打上版本标识，当下要识别哪些物料能在 Taro 3 中使用，只能通过物料本身的 Taro 依赖项来进行识别。

## 再聊聊 Taro 的近期动作

Taro 社区及官方团队目前主要在集中人力做以下几项工作

### 实现支持平台与框架的自定义扩展

细心的朋友应该已经发现，进入 Taro 3 时代，Taro 的推广 Slogan 已经由「多端统一开发解决方案」变成了「开放式跨端跨框架解决方案」，那么这两者之间有何差异呢？

可以看出「开放式跨端跨框架解决方案」包含了多端统一开发的特性，同时支持跨框架开发，而且更重要的是能够成为一个开放式的解决方案，我们希望开发者可以根据 Taro 提供的 API 开发一个插件就能实现自己去为 Taro 扩展更多平台与前端框架的支持，例如未来有些新的平台推出小程序，或者有人希望能在 Taro 中使用 Angular 等更多的前端框架，那么就可以通过 Taro 的开放式机制来自行扩展，而不用等待 Taro 官方来进行支持，Taro 将只作为一个跨端适配的平台，所有的可能性都可以让社区自己去自由发掘。


### 实现小程序与 Web 的同构

在当前 Taro 的设计下，使用 Taro 开发必须使用 Taro 标准组件库中的组件，而不能直接使用大家熟悉的 HTML 标签。我们正在努力打破这一藩篱，寻求支持让开发人员可以直接使用 HTML 标签来开发小程序的方案。

这样，既能进一步让 Taro 的开发体验接近 Web， 同时也能让一些 Web 生态资源可以直接运行在小程序中，极大降低从 Web 迁移到小程序的成本。

### 说说缺席的 Taro 3 RN 支持

很多朋友在升级到 Taro 3 之后都会发出疑问：RN 是不再支持了吗？

Taro 3 没有支持 RN 适配，让很多使用 Taro 开发 RN 应用的朋友措手不及，经常在群里能看到上述灵魂拷问。

事实上 Taro 并没有抛弃 RN，目前 Taro 3 RN 适配工作已经由 「58 同城」开发团队接管，进行适配支持，目前这项工作已经正在紧锣密鼓进行，相信不久的将来就能看到在 Taro 3 中 RN 的支持王者归来。而这一次的通力协作也意味着 Taro 核心团队正不断成长为一个跨公司的团队，在未来一定会有更多灵感的碰撞，为社区开发者带来更多精彩的功能。


## 总结一下

从目前的业界反馈与 Taro 自身规划来看，Taro 3 是一个非常值得尝试和期待的版本，已经有非常多的开发者开始使用 Taro 3 开发应用，在未来我们也会不断完善功能与文档，为大家带来更棒的开发体验。升级到 Taro 3 的过程或许稍显艰辛，但有任何问题，欢迎大家通过交流群和 GitHub issues 向我们进行反馈。

同时，诚挚邀请您与 Taro 官方团队交流您的使用情况，您的反馈是 Taro 前进的动力！请[戳此](https://wj.qq.com/s2/6494361/09cf/)完成 Taro 使用调研问卷，提交问卷，将有可能获得 Taro 团队的红包哦！！感谢一路相伴，Taro 有你更精彩！

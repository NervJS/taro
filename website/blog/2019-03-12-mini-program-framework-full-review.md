---
title: 小程序框架全面测评 
author:yuche
authorURL: https://github.com/yuche
authorImageURL: https://static.geekbang.org/ck/5cb53de0e50c0.jpeg?imageView2/0/w/800
---

![image](https://storage.jd.com/taro-resource/review.jpg)

最近前端届多端框架频出，相信很多有代码多端运行需求的开发者都会产生一些疑惑：这些框架都有什么优缺点？到底应该用哪个？

作为 Taro 开发团队一员，笔者想在本文尽量站在一个客观公正的角度去评价各个框架的选型和优劣。但宥于利益相关，本文的观点很可能是带有偏向性的，大家可以带着批判的眼光去看待，权当抛砖引玉。

那么，当我们在讨论多端框架时，我们在谈论什么：

<!--truncate-->

## 多端
笔者以为，现在流行的多端框架可以大致分为三类：

#### 1. 全包型

这类框架最大的特点就是从底层的渲染引擎、布局引擎，到中层的 DSL，再到上层的框架全部由自己开发，代表框架是 Qt 和 Flutter。这类框架优点非常明显：性能（的上限）高；各平台渲染结果一致。缺点也非常明显：需要完全重新学习 DSL（QML/Dart），以及难以适配中国特色的端：小程序。

这类框架是最原始也是最纯正的的多端开发框架，由于底层到上层每个环节都掌握在自己手里，也能最大可能地去保证开发和跨端体验一致。但它们的框架研发成本巨大，渲染引擎、布局引擎、DSL、上层框架每个部分都需要大量人力开发维护。

#### 2. Web 技术型

这类框架把 Web 技术（JavaScript，CSS）带到移动开发中，自研布局引擎处理 CSS，使用 JavaScript 写业务逻辑，使用流行的前端框架作为 DSL，各端分别使用各自的原生组件渲染。代表框架是 React Native 和 Weex，这样做的优点有：

1. 开发迅速
2. 复用前端生态
3. 易于学习上手，不管前端后端移动端，多多少少都会一点 JS、CSS

缺点有：

1. 交互复杂时难以写出高性能的代码，这类框架的设计就必然导致 `JS` 和 `Native`  之间需要通信，类似于手势操作这样频繁地触发通信就很可能使得 UI 无法在 16ms 内及时绘制。React Native 有一些声明式的组件可以避免这个问题，但声明式的写法很难满足复杂交互的需求。
2. 由于没有渲染引擎，使用各端的原生组件渲染，相同代码渲染的一致性没有第一种高。

#### 3. JavaScript 编译型

这类框架就是我们这篇文章的主角们：`Taro`、`WePY` 、`uni-app`  、 `mpvue` 、 `chameleon`，它们的原理也都大同小异：先以 JavaScript 作为基础选定一个 DSL 框架，以这个 DSL 框架为标准在各端分别编译为不同的代码，各端分别有一个运行时框架或兼容组件库保证代码正确运行。

这类框架最大优点和创造的最大原因就是小程序，因为第一第二种框架其实除了可以跨系统平台之外，也都能编译运行在浏览器中。(Qt 有 Qt for WebAssembly, Flutter 有 Hummingbird，React Native 有 `react-native-web`, Weex 原生支持)

另外一个优点是在移动端一般会编译到 React Native/Weex，所以它们也都拥有 Web 技术型框架的优点。这看起来很美好，但实际上 React Native/Weex 的缺点编译型框架也无法避免。除此之外，**编译型框架的抽象也不是免费的**：当 bug 出现时，问题的根源可能出在运行时、编译时、组件库以及三者依赖的库等等各个方面。在 Taro 开源的过程中，我们就遇到过 Babel 的 bug，React Native 的 bug，JavaScript 引擎的 bug，当然也少不了 Taro 本身的 bug。相信其它原理相同的框架也无法避免这一问题。

但这并不意味着这类为了小程序而设计的多端框架就都不堪大用。首先现在各巨头超级 App 的小程序百花齐放，框架会为了抹平小程序做了许多工作，这些工作在大部分情况下是不需要开发者关心的。其次是许多业务类型并不需要复杂的逻辑和交互，没那么容易触发到框架底层依赖的 bug。

那么当你的业务适合选择编译型框架时，在笔者看来首先要考虑的就是选择 DSL 的起点。因为有多端需求业务通常都希望能快速开发，一个能够快速适应团队开发节奏的 DSL 就至关重要。不管是 React 还是 Vue（或者类 Vue）都有它们的优缺点，大家可以根据团队技术栈和偏好自行选择。

如果不管什么 DSL 都能接受，那就可以进入下一个环节：

## 生态
以下内容均以各框架现在（2019 年 3 月 11日）已发布稳定版为标准进行讨论。

#### 开发工具

就开发工具而言 `uni-app` 应该是一骑绝尘，它的文档内容最为翔实丰富，还自带了 IDE 图形化开发工具，鼠标点点点就能编译测试发布。

其它的框架都是使用 CLI 命令行工具，但值得注意的是 `chameleon`  有独立的语法检查工具，`Taro` 则单独写了 ESLint 规则和规则集。

在语法支持方面，`mpvue`、`uni-app`、`Taro` 、`WePY` 均支持 TypeScript，四者也都能通过 `typing` 实现编辑器自动补全。除了 API 补全之外，得益于 TypeScript 对于 JSX 的良好支持，Taro 也能对组件进行自动补全。

CSS 方面，所有框架均支持 `SASS`、`LESS`、`Stylus`，Taro 则多一个 `CSS Modules` 的支持。

所以这一轮比拼的结果应该是：

`uni-app`  > `Taro` >  `chameleon`  > `WePY`、`mpvue`

 ![开发工具](https://storage.jd.com/taro-resource/develop_tools.png)


#### 多端支持度

只从支持端的数量来看，`Taro` 和 `uni-app` 以六端略微领先（移动端、H5、微信小程序、百度小程序、支付宝小程序、头条小程序），`chameleon ` 少了头条小程序紧随其后。

但值得一提的是 `chameleon` 有一套自研[多态协议](//cmljs.org/doc/framework/polymorphism/intro.html)，编写多端代码的体验会好许多，可以说是一个能戳到多端开发痛点的功能。`uni-app` 则有一套独立的[条件编译语法](://uniapp.dcloud.io/platform)，这套语法能同时作用于 `js`、样式和模板文件。`Taro` 可以在业务逻辑中根据环境变量使用条件编译，也可以直接使用[条件编译文件](https://nervjs.github.io/taro/docs/envs.html)（类似 React Native 的方式）。

在移动端方面，`uni-app` 基于 `weex` 定制了一套 `nvue` 方案 弥补 `weex` API 的不足；`Taro` 则是暂时基于 `expo` 达到同样的效果；`chameleon` 在移动端则有一套 SDK 配合多端协议与原生语言通信。

H5 方面，`chameleon` 同样是由多态协议实现支持，`uni-app` 和 `Taro` 则是都在 H5 实现了一套兼容的组件库和 API。

`mpvue` 和 `WePY`  都提供了转换各端小程序的功能，但都没有 h5 和移动端的支持。

所以最后一轮对比的结果是：

`chameleon` > `Taro`、`uni-app` > `mpvue` > `WePY`

![多端支持](https://storage.jd.com/taro-resource/duoduan.png)


#### 组件库/工具库/demo

作为开源时间最长的框架，`WePY` 不管从 Demo，组件库数量 ，工具库来看都占有一定优势。

`uni-app` 则有自己的插件市场和 UI 库，如果算上收费的框架和插件比起 `WePy` 也是完全不遑多让的。

`Taro ` 也有官方维护的跨端 UI 库 `taro-ui` ，另外在状态管理工具上也有非常丰富的选择（Redux、MobX、dva），但 demo 的数量不如前两个。但 `Taro` 有一个转换微信小程序代码为 Taro 代码的工具，可以弥补这一问题。

而 `mpvue` 没有官方维护的 UI 库，`chameleon` 第三方的 demo 和工具库也还基本没有。

所以这轮的排序是：

`WePY`  > `uni-app` 、`taro` > `mpvue` > `chameleon`

![组件库/工具库/demo](https://storage.jd.com/taro-resource/component.png)

#### 接入成本

接入成本有两个方面：

第一是框架接入原有微信小程序生态。由于目前微信小程序已呈一家独大之势，开源的组件和库（例如 `wxparse`、`echart`、`zan-ui`  等）多是基于原生微信小程序框架语法写成的。目前看来 `uni-app` 、`Taro`、`mpvue` 均有文档或 demo 在框架中直接使用原生小程序组件/库，`WePY` 由于运行机制的问题，很多情况需要小改一下目标库的源码，`chameleon` 则是提供了一个按步骤大改目标库源码的迁移方式。

第二是原有微信小程序项目部分接入框架重构。在这个方面 Taro 在京东购物小程序上进行了大胆的实践，具体可以查看文章[《Taro 在京东购物小程序上的实践》](//aotu.io/notes/2018/09/11/taro-in-jd/)。其它框架则没有提到相关内容。

而对于两种接入方式 Taro 都提供了 `taro convert` 功能，既可以将原有微信小程序项目转换为 Taro 多端代码，也可以将微信小程序生态的组件转换为 Taro 组件。

所以这轮的排序是：

`Taro` >  `mpvue` 、 `uni-app`  > `WePY` >  `chameleon`  

#### 流行度

从 GitHub 的 star 来看，`mpvue` 、`Taro`、`WePY` 的差距非常小。从 NPM 和 CNPM 的 CLI 工具下载量来看，是 Taro（3k/week）> mpvue (2k/w) > WePY (1k/w)。但发布时间也刚好反过来。笔者估计三家的流行程度和案例都差不太多。

`uni-app` 则号称有上万案例，但不像其它框架一样有一些大厂应用案例。另外从开发者的数量来看也是 `uni-app` 领先，它拥有 20+ 个 QQ 交流群（最大人数 2000）。

所以从流行程度来看应该是：

`uni-app` > `Taro`、`WePY`、`mpvue` > `chameleon`


![流行度](https://storage.jd.com/taro-resource/popluar.png)



#### 开源建设

一个开源作品能走多远是由框架维护团队和第三方开发者共同决定的。虽然开源建设不能具体地量化，但依然是衡量一个框架/库生命力的非常重要的标准。

从第三方贡献者数量来看，`Taro` 在这一方面领先，并且 `Taro` 的一些核心包/功能（MobX、CSS Modules、alias）也是由第三方开发者贡献的。除此之外，腾讯开源的 `omi` 框架小程序部分也是基于 Taro 完成的。

`WePY` 在腾讯开源计划的加持下在这一方面也有不错的表现；`mpvue` 由于停滞开发了很久就比较落后了；可能是产品策略的原因，`uni-app` 在开源建设上并不热心，甚至有些部分代码都没有开源；`chameleon` 刚刚开源不久，但它的代码和测试用例都非常规范，以后或许会有不错的表现。

那么这一轮的对比结果是：

`Taro` > `WePY` > `mpvue` > `chameleon`  > `uni-app`

最后补一个总的生态对比图表：

![总表](https://storage.jd.com/taro-resource/all.png)

## 未来

从各框架已经公布的规划来看：

`WePY`  已经发布了 `v2.0.alpha`  版本，虽然没有公开的文档可以查阅到 `2.0` 版本有什么新功能/特性，但据其作者介绍，`WePY 2.0`  会放大招，是一个「对得起开发者」的版本。笔者也非常期待 2.0 正式发布后 `WePY` 的表现。

`mpvue` 已经发布了 `2.0` 的版本，主要是更新了其它端小程序的支持。但从代码提交， issue 的回复/解决率来看，`mpvue` 要想在未来有作为首先要打消社区对于 `mpvue` 不管不顾不更新的质疑。

`uni-app` 已经在生态上建设得很好了，应该会在此基础之上继续稳步发展。如果 `uni-app` 能加强开源开放，再加强与大厂的合作，相信未来还能更上一层楼。

`chameleon` 的规划比较宏大，虽然是最后发的框架，但已经在规划或正在实现的功能有：

* 快应用和端拓展协议
* 通用组件库和垂直类组件库
* 面向研发的图形化开发工具
* 面向非研发的图形化页面搭建工具

如果 `chameleon` 把这些功能都做出来的话，再继续完善生态，争取更多第三方开发者，那么在未来  `chameleon`  将大有可为。

`Taro` 的未来也一样值得憧憬。Taro 即将要发布的 `1.3` 版本就会支持以下功能：

* 快应用支持
* Taro Doctor，自动化检查项目配置和代码合法性
* 更多的 JSX 语法支持，1.3 之后限制生产力的语法只有 `只能用 map 创造循环组件` 一条
* H5 打包体积大幅精简

同时 `Taro` 也正在对移动端进行大规模重构；开发图形化开发工具；开发组件/物料平台以及图形化页面搭建工具。

## 结语

那说了那么多，到底用哪个呢？

如果不介意尝鲜和学习 DSL 的话，完全可以尝试 `WePY` 2.0  和 `chameleon` ，一个是酝酿了很久的 2.0 全新升级，一个有专门针对多端开发的多态协议。

`uni-app` 和 `Taro` 相比起来就更像是「水桶型」框架，从工具、UI 库，开发体验、多端支持等各方面来看都没有明显的短板。而 `mpvue` 由于开发一度停滞，现在看来各个方面都不如在小程序端基于它的 `uni-app` 。

当然，Talk is cheap。如果对这个话题有更多兴趣的同学可以去 GitHub 另行研究，有空看代码，没空看提交：

* chameleon: [https://github.com/didi/chameleon](https://github.com/didi/chameleon)
* mpvue: [https://github.com/Meituan-Dianping/mpvue](https://github.com/Meituan-Dianping/mpvue)
* Taro: [https://github.com/NervJS/taro](https://github.com/NervJS/taro)
* uni-app: [https://github.com/dcloudio/uni-app](https://github.com/dcloudio/uni-app)
* WePY: [https://github.com/Tencent/wepy](https://github.com/Tencent/wepy)

(按字母顺序排序)

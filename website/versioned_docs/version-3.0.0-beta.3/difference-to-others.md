---
title: 与其它新型小程序框架的异同
id: version-3.0.0-beta.3-difference-to-others
original_id: difference-to-others
---

> 请注意：各个框架迭代速度都非常快，可能框架的设计和实现会出现改变。

在本节我们将与三个新型小程序框架进行对比，它们分别是：[remax](https://github.com/remaxjs/remax), [alita](https://github.com/areslabs/alita), [kbone](https://github.com/wechat-miniprogram/kbone)。这三个框架和 Taro Next 总体的思路都一样：相对于编译型的小程序框架而言，新型小程序框架有一个(或多个)基础模板，基础模板接受不同的数据渲染与之对应的内容，小程序框架主要的工作是把开发者的业务逻辑转换成基础模板可接受的数据去驱动小程序渲染。

我们尽量尝试避免偏见。但显而易见，作为 Taro 团队，我们会不可避免地倾向于 Taro。在本次对比中，我们仅会从技术选型、总体设计、内部实现对比各个框架，不会涉及例如生态和项目/开源治理等因素。如果你倾向于全面的对比，可以参考 [小程序框架全面测评](https://aotu.io/notes/2019/03/12/mini-program-framework-full-review/)。

## Alita

Alita 严格来讲并不算小程序开发框架，它实际上是一个把 React Native 代码转换成微信小程序代码的转换引擎工具。

在内部的实现上，Alita 采用了静态编译 + 运行时处理 JSX 的实现。静态编译部分捕捉 JSX 和 React 组件声明，并生成对应的 wxml 模板，运行时把捕捉到的 React 组件转换为静态模板可接受的渲染数据实现渲染。由于静态编译部分的存在，Alita 不能完整地支持所有 JSX 特性，生成的模板也会更多，最终打包的 size 会比其它新型小程序框架更大一些。但与之对应的，这样的实现的会获得更好的性能。

另外 Alita 内部实现了一个 mini React，目前还没有例如 Hooks 这样的功能，也无法自由引入其它的 React 生态库。其它的新型小程序框架都可以引入不涉及浏览器 API 的 React 生态库。

## Remax

Remax 是一个可以让完整的 React 跑在小程序上的小程序开发框架。为了让 React 跑在小程序上，Remax 通过 [react-reconciler](https://www.npmjs.com/search?q=react-reconcile) 实现了一个小程序渲染器。这点和 Taro Next 一致。

在渲染方面，Remax 有一个静态模板列出了所有开发者声明过的组件，静态模板通过遍历渲染器返回的数据（类似于一颗 DOM 树）实现渲染。不过在微信小程序的模板不支持递归，当数据的层级超过了 Remax 设定的阈值（阈值可以自行设定）就会发生爆栈导致无法渲染。而 Kbone 和 Taro 都通过组件的方案来避免这个问题。

Remax 同 React 进行了强绑定，不支持除 React 之外的 Web 开发框架。Kbone 和 Taro 都支持 React 和类 React 以及 Vue。

## Kbone

Kbone 内部实现了轻量级的 DOM 和 BOM API，把 DOM 更改绑定到小程序的视图更改。也就是说，Kbone 并不太关心开发者使用什么框架，只要框架使用的 DOM API 被 Kbone 实现的 DOM API 覆盖到，框架就能通过 Kbone 在小程序运行。Taro Next 也有着同样的思路，但不同的是对 React 的处理。Kbone 通过引入 `react-dom` 实现渲染，但 `react-dom` 包含着合成事件实现和大量浏览器兼容代码。Taro 团队认为这部分代码对小程序平台意义不大，因此和 Remax 一样，通过 `react-reconciler` 实现了小程序渲染器。

在更新方面，Kbone 以组件为粒度进行更新，每次视图改变小程序 setData 的数据是组件的 DOM 树。而 Remax 和 Taro 更新 setData 的数据则是 DOM 树中已经改变了的的值和它的路径。对比起 Taro 和 Remax，Kbone 的运行时性能会差一些。

另外 Kbone 更为专注于微信小程序开发和 H5 开发，而本节对比的其它三个小程序框架均支持多种平台的小程序开发。

## 总结

通过我们的对比不难发现，虽然 4 个框架的核心原理大致相同，但技术选型，内部实现，优化思路都有很大的不同。究其原因是因为 4 个框架都是企业团队进行开发的，这就意味着框架必须优先满足企业和部门的需求和利益，框架的设计和实现的区别也不能代表开发团队技术水平的高下，而是框架开发者根据项目/业务类型和技术栈不同的取舍和妥协。开发者可以根据自己的团队技术栈和项目/业务特性决定使用框架。

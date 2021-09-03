---
title: Difference from other new applet frameworks
---

> Please note that：frameworks iterate very quickly, with possible changes in their design and implementation.

In this section, we will compare with three new applet frames, respectively：[max](https://github.com/remaxjs/remax), [alita](https://github.com/areslabs/alita), [kbone](https://github.com/wechat-miniprogram/kbone).这三个框架和 Taro Next 总体的思路都一样：相对于编译型的小程序框架而言，新型小程序框架有一个(或多个)基础模板，基础模板接受不同的数据渲染与之对应的内容，小程序框架主要的工作是把开发者的业务逻辑转换成基础模板可接受的数据去驱动小程序渲染。

We try to avoid bias.But it is clear that, as a Taro team, we will inevitably be inclined to Taro.In this comparison, we will only achieve comparisons from technology selection, overall design, internal frameworks without addressing factors such as ecology and project/open source governance.If you prefer a full comparison, you can refer to [applet framework general review](https://aotu.io/notes/2019/03/12/mini-program-framework-full-review/)

## Alita

Alita is not, strictly speaking, a small program development framework. It is actually a conversion engine tool that transforms React Native code into Microletter applet code.

For internal implementation, Alita uses static compilation + running to process JSX.Static compilations snap JSX and React components statements and generate wxml templates, when running, turning captured React components into performing rendering data acceptable in static templates.Alita cannot fully support all JSX features because of static compilation. More templates will be generated, and the size of the final package will be larger than any other new applet framework.But, by contrast, such achievement would have better performance.

Alita has implemented a mini React internally, and currently has no features like Hooks and cannot freely introduce other React eco-libraries.Other new Applet Frameworks can introduce React Ecology that does not involve browser API.

## Remax

Remax is a program development framework that allows React to run on the applet.为了让 React 跑在小程序上，Remax 通过 [react-reconciler](https://www.npmjs.com/search?q=react-reconcile) 实现了一个小程序渲染器。This is consistent with Taro Next.

With regard to rendering, Remax has a static template that lists all developers have declared, rendering by passing the data returned by the renderer (similar to the output DOM tree).However, recursive is not supported in the micromessaging template, when the level of the data exceeds the threshold set by Remax (thresholds can be set on their own) the burst stack will cause it to fail to render.And both Kbone and Taro avoid this problem via component solutions.

Remax is strongly bound to React and does not support web development frameworks other than React.Both Kbone and Taro support React and Class React and Vue.

## Kbone

Kbone implements lightweight DOM and BOM API, binding DOM changes to the widget view changes.This means that Kbone is not very interested in what framework the developer uses and that the framework uses the DOM API which is covered by the DOM API implemented by Kbone, the framework can be run in the small app via Kbone.Taro Next has the same line of thinking, but different from the treatment of React.Kbone performs rendering by introducing `react-dom` but `react-dome` contains synthetic events implementation and a lot of browser-compatible code.Taro 团队认为这部分代码对小程序平台意义不大，因此和 Remax 一样，通过 `react-reconciler` 实现了小程序渲染器。

For updates, Kbone updates the particle for particles. Each view changes the data of the applet setData is the DOM tree of the component.Remax and Taro update setData are changed values and paths in DOM trees.The performance of Kbone will be somewhat worse for Sterior Taro and Remax.

The other Kbone focuses more on micro-credit applet development and H5 development, while the other three programming frameworks in this section support the development of multiple platforms.

## Summary

It is not difficult to discern from our comparisons that while the core rationale for the four frameworks is broadly the same, there is a great difference in thinking about optimization internally, with technical selection.The reason for this is that the four frameworks are developed by business teams, which means that the framework must be prioritized to meet the needs and interests of enterprises and sectors. The design and realization of the framework cannot represent the high level of technology in the development team, but the choice and compromise of framework developers depending on the project/business type and technical stack.Developers can use the framework according to their team technical stack and project/business properties.

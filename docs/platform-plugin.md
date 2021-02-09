---
title: 概述
---

## 端平台插件

自 `v3.1.0` 起，我们把对每个小程序平台的兼容逻辑抽取了出来，以 [Taro 插件](./plugin)的形式注入 Taro 框架，从而支持对应平台的编译。

### Taro 内置的端平台插件：

| 插件 | 编译平台 |
| :--- | :--- |
| @tarojs/plugin-platform-weapp | 微信小程序 |
| @tarojs/plugin-platform-alipay | 支付宝小程序 |
| @tarojs/plugin-platform-swan | 百度小程序 |
| @tarojs/plugin-platform-tt | 头条小程序 |
| @tarojs/plugin-platform-qq | QQ 小程序 |
| @tarojs/plugin-platform-jd | 京东小程序 |

### 其它端平台插件：

| 插件 | 编译平台 |
| :--- | :--- |
| [@tarojs/plugin-platform-weapp-qy](https://github.com/NervJS/taro-plugin-platform-weapp-qy) | 企业微信小程序 |
| [@tarojs/plugin-platform-alipay-dd](https://github.com/NervJS/taro-plugin-platform-alipay-dd) | 钉钉小程序 |
| [@tarojs/plugin-platform-alipay-iot](https://github.com/NervJS/taro-plugin-platform-alipay-iot) | 支付宝 IOT 小程序 |

### 端平台插件使用方法：

1. 配置插件

```js
// Taro 项目配置
module.exports = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-alipay-iot'
  ]
}
```

2. 编译为支付宝 IOT 端小程序

```shell
taro build --type iot
taro build --type iot --watch
```

## 背景

### 开放式框架

近年来业界推出的小程序平台越来越多，但 Taro 核心维护的平台只有 6 个（微信、支付宝、百度、头条、QQ、京东小程序），因此常常有同学提出能不能支持某某平台的 Feature Request。

基于目前的架构，对于单一平台的兼容性代码分布于 Taro 核心库的各个角落，涉及编译时与运行时等部分。支持一个新的平台需要改动所有的这些地方，开发复杂度高，同时社区也难以参与贡献。

为此我们萌生了打造一个**开放式框架**的想法。目标是可以通过插件的形式扩展 Taro 的端平台支持能力：

* 插件开发者无需修改 Taro 核心库代码，按照一定的规则即可编写出一个端平台插件。
* 插件使用者只需安装、配置端平台插件，即可把代码编译到指定平台。

端平台扩展又可以分为横向扩展和纵向扩展两种方式：

* 横向扩展

  扩展一个全新的编译平台，如美团小程序。

* 纵向扩展

  继承现有的端平台插件，扩展出新的编译平台，如 QQ 小程序插件继承于微信小程序插件。

#### 开放式编译平台架构图

![](http://storage.jd.com/cjj-pub-images/platform-plugin-all.png)

### 还可以做什么有意思的事

除了扩展新的编译平台，我们还可以通过继承于现有的端平台插件，来编写自定义的端平台插件，为平台的编译过程注入自定义逻辑：

> 使用插件 [@tarojs/plugin-inject](https://github.com/NervJS/taro-plugin-inject) 能为所有小程序平台快速新增 API、组件，调整组件属性等

#### 快速修复问题

由于小程序平台众多，而且它们也在不断地迭代，往往会出现 Taro 对某个小程序新推出的组件或 API 支持不及时的问题。这时开发者首先需要联系 Taro 团队，再等待我们跟进修复、发布新版本后才能正常使用，平均需要等待一周或两周的时间才能得到解决。

而基于开放式的编译平台架构，开发者能够通过继承目标的端平台插件，迅速开发出自定义端平台插件，完成对这些新组件或 API 的支持，无需等待 Taro 发布版本。

#### 属性精简

因为小程序组件的属性和事件都必须静态写死，不可以动态添加，所以 Taro 会把组件的所有属性和事件全部在模板里提前进行绑定。

但实际项目中很多情况下并不会使用到组件的所有属性和事件，循环这些冗余的属性和事件绑定也会占据很大一部分的体积，另外太多的事件绑定也会在一定程度上降低小程序的性能。

以下是 `View` 组件模板的伪代码：

```html
<template name="tmpl_0_view">
  <view
    hover-class="..."
    hover-stop-propagation="..."
    hover-start-time="..."
    hover-stay-time="..."
    animation="..."
    onTouchStart="..."
    onTouchMove="..."
    onTouchEnd="..."
    onTouchCancel="..."
    onLongTap="..."
    onAnimationStart="..."
    onAnimationIteration="..."
    onAnimationEnd="..."
    onTransitionEnd="..."
    disable-scroll="..."
    hidden="..."
    onAppear="..."
    onDisappear="..."
    onFirstAppear="..."
    style="..."
    class="..."
    onTap="..."
    id="..."
  >
    ...
  </view>
</template>
```

Taro 需要把 `View` 组件的所有属性和事件提前进行绑定，才能满足不同开发者的使用需求。但可能对于某位开发者来说，整个项目的 `View` 组件都没有使用到 `hover-stop-propagation` 这个属性，那么则可以考虑把它精简掉，不编译到 `View` 模板当中。

属性精简的功能同样可以通过实现一个自定义端平台插件来实现。但是需要提醒的是，对属性的精简可能会引起不必要的问题、使项目的维护变得困难，特别当项目变大，开发者众多时，需要谨慎设计和使用。

#### 欢迎共建

我们希望在开放式架构推出后，能激起社区各位开发者的创造力，一起为 Taro 生态创造新的端平台支持插件，或各种优秀的自定义端平台组件，期待您的参与和贡献！

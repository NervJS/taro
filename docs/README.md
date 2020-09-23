---
title: Taro 介绍
---

## 简介

**Taro** 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发 [微信](https://mp.weixin.qq.com/) / [京东](https://mp.jd.com/?entrance=taro) / [百度](https://smartprogram.baidu.com/) / [支付宝](https://mini.open.alipay.com/) / [字节跳动](https://developer.toutiao.com/) / [QQ](https://q.qq.com/) 小程序 / H5 等应用。现如今市面上端的形态多种多样，Web、React Native、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。

### 版本说明

当前 Taro 已进入 3.x 时代，相较于 Taro 1/2 采用了重运行时的架构，让开发者可以获得完整的 React/Vue 等框架的开发体验，具体请参考 [《小程序跨框架开发的探索与实践》](https://mp.weixin.qq.com/s?__biz=MzU3NDkzMTI3MA==&mid=2247483770&idx=1&sn=ba2cdea5256e1c4e7bb513aa4c837834)。

如果你想使用 Taro 1/2，可以访问[文档版本](/taro/versions)获得帮助。

版本相关更多的文档可以参考：[Taro 版本升级权威指南](/taro/blog/2020-09-01-taro-versions) 和 [从旧版本迁移到 Taro Next](./migration)

## 学习资源

[【教程】5 分钟上手 Taro 开发](https://docs.taro.zone/taro/docs/guide)

[【视频】5分钟快速上手 Taro 开发小程序](https://mp.weixin.qq.com/s?__biz=MzU3NDkzMTI3MA==&mid=2247484205&idx=1&sn=935bb7a35c11c33563eeb7c3aaca3321&chksm=fd2bab04ca5c2212b4cd8aeb5858bd08517aeb31e20727b22d1eee00b394184e7e61359e7dd9&token=1180618535&lang=zh_CN#rd)

[【案例合集】awesome-taro](https://github.com/NervJS/awesome-taro)

[【掘金小册】Taro 多端开发实现原理与实战](https://juejin.im/book/5b73a131f265da28065fb1cd?referrer=5ba228f16fb9a05d3251492d)



## 社区共享

[Taro 交流社区——让每一次交流都被沉淀](http://taro-club.jd.com/)

你可以在交流社区里提问、讨论、吐槽。

[Taro 物料市场——让每一个轮子产生价值](http://taro-ext.jd.com/)

你可以在物料市场里找到一些开源的模板、组件和项目，也欢迎你分享你的成果。

## 使用案例

Taro 已经投入了我们的生产环境中使用，业界也在广泛地使用 Taro 开发多端应用。

<a href="https://nervjs.github.io/taro-user-cases/"><img src="https://raw.githubusercontent.com/NervJS/taro-user-cases/master/user-cases.jpg" /></a>

[征集更多优秀案例](https://github.com/NervJS/taro/issues/244)

## Taro 特性

### 框架支持

#### React/Nerv 支持

在 Taro 3 中可以使用完整的 React/Nerv 开发体验，具体请参考[基础教程——React](https://nervjs.github.io/taro/docs/react)

代码示例

```javascript
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'

export default class Index extends Component {
  state = {
    msg: 'Hello World！'
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>{this.state.msg}</Text>
      </View>
    )
  }
}
```

#### Vue/Vue3 支持

在 Taro 3 中可以使用完整的 Vue/Vue3 开发体验，具体请参考[基础教程——Vue](./vue)、[基础教程——Vue3](./vue3)

代码示例

```vue
<template>
  <view class="index">
    <text>{{msg}}</text>
  </view>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello World！'
    }
  },
  created () {},
  onShow () {},
  onHide () {}
}
</script>
```

### 多端转换支持

Taro 方案的初心就是为了打造一个多端开发的解决方案。

目前 Taro 3 可以支持转换到 **微信/京东/百度/支付宝/字节跳动/QQ 小程序** 以及  **H5 端**。

## 加入共建

#### 加入 Taro 社区共建倡议

[Taro 邀你加入社区共建](https://github.com/NervJS/taro/issues/4714)

#### 为 Taro 贡献代码

Taro 非常欢迎社区开发者为 Taro 贡献代码，在贡献之前请先阅读[贡献指南](https://nervjs.github.io/taro/docs/CONTRIBUTING.html)。

如果你想为 Taro 实现一个重要功能，需要先撰写 RFC  文档，按照 Taro 的[RFC 机制](https://github.com/NervJS/taro-rfcs)进行操作，在经过社区讨论完善后才可以进行代码的提交。

## 问题反馈与建议

[给 Taro 提 ISSUE](https://nervjs.github.io/taro-issue-helper/)


## Taro UI

一款基于 `Taro` 框架开发的多端 UI 组件库。

[Taro UI](https://taro-ui.jd.com) 特性：

- 基于 `Taro` 开发 UI 组件
- 一套组件可以在 `微信小程序`，`支付宝小程序`，`百度小程序`，`H5` 多端适配运行（`ReactNative` 端暂不支持）
- 提供友好的 API，可灵活的使用组件

## 开发交流

扫码添加 `凹凸实验室-小助手` ，回复 `Taro` 即可进群。（Taro 开发交流 22 群 已满）

![image](https://storage.jd.com/taro-jd-com/static/wechaty.png)

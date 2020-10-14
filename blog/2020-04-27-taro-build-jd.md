---
slug: 2020-04-27-taro-build-jd
title: 使用 Taro 快速开发京东小程序
author: JJ
author_url: https://github.com/Chen-jj
author_image_url: https://storage.jd.com/cjj-pub-images/11807297.png
---

![](https://img20.360buyimg.com/ling/jfs/t1/117964/14/2118/145903/5e9eee0aE8897b3dd/bd435e6161779ad1.png)

近两年来小程序逐渐成为互联网的一个行业风口，一直备受业界关注，各大厂也接踵推出了自己的小程序。近日京东也推出了小程序：[**京东小程序**](https://mp.jd.com/?entrance=taro)。Taro 作为一款专注于多端统一开发的框架，第一时间对京东小程序进行了适配。接下来就跟着小编一起了解一下如何使用 Taro 快速开发京东小程序吧。

<!--truncate-->

## 背景

### 京东小程序

[京东小程序平台](https://mp.jd.com/?entrance=taro)是京东自研技术（能力）开放平台，平台集成京东特色功能，串联商家和用户。为用户提供延展服务，给商家带来新机遇。京东小程序平台不仅支持存量自营、POP商家自动开通，还支持新型的非电商领域商家参与小程序生态。  

加入京东小程序开放平台的商家，可以利用京东平台完整的营销、交易、支付、会员、物流等能力，更加便捷地构建起自己的特色服务场景。助力商家实现生态场景上的“跃迁”，快速为用户提供一站式服务体验。

京东小程序只需一次开发即可运行在京东 APP、京东金融 APP、京麦 APP 三端。京东 APP、京东金融 APP 会开放特定的能力，对优质小程序还会开放多个高流量入口，包含扫码、搜索、消息等多种方式触达。而京麦 APP 小程序主要用于商家工具插件的开发定制。

![jdapp_3apps](http://storage.jd.com/cjj-pub-images/jdapp_3apps.png)

### Taro

[Taro](https://taro.jd.com/) 是凹凸实验室推出的一套遵循 React 语法规范的多端统一开发解决方案，也是京东小程序官方推荐的开发框架。

使用 Taro 开发不但能更规范、更有效率地编码， 畅享 React / Vue 生态的各种工具。更重要的是只需编写一份代码，即可运行在各种平台：京东/微信/百度/支付宝/字节跳动/QQ小程序、快应用、H5、React-Native 等。

如今 Taro 正被广泛用于京东各大业务，例如京东购物（微信）、京喜（微信、H5、RN）、京东好物街（微信、百度、字节跳动）、京东到家（微信、H5）等，在业界也被各大型业务广泛应用，如：58 同城、喜茶、腾讯吐个槽社区等等。

## 使用 Taro 快速开发京东小程序

### 入驻京东小程序

进入[京东小程序官网](https://mp.jd.com/?entrance=taro)，提交相关信息后完成入驻。

### 开发

1.安装 Taro 的 CLI 工具：

```bash
npm install -g @tarojs/cli
```

> 已安装 Taro 的同学请注意更新 Taro 版本，Taro 自 1.3.20 后支持转换京东小程序。

2.使用 CLI 创建项目：

```bash
taro init [projectName]
```

3.进入项目根目录，使用 CLI 编译项目，根据 [Taro 文档](https://docs.taro.zone/taro/docs/README.html) 进行开发：

```bash
taro build --type jd [--watch]
```

4.调试

申请入驻京东小程序成功后，京东小程序会给开发者发放邀请码，同时提供开发者工具下载，下载后可使用开发者工具进行调试。

## Taro 已完全适配京东小程序

Taro 已 100% 完成了转换京东小程序的工作，全面支持京东小程序的各种特性。

开发中如遇到任何问题或困难，欢迎在 Github Issues、Taro 社区进行反馈，或联系 **taro@jd.com**，我们会尽快给予答复与支持。

### 示例项目转换效果图

小编尝试把 [Taro Github](https://github.com/NervJS/taro) 上学习资源中的优秀开源项目：[仿严选多端项目](https://github.com/qit-team/taro-yanxuan) 分别转换为微信小程序端和京东小程序端，对比可见转换非常完美，表现效果基本一致。

##### 微信小程序端

![yanxuan_wx](http://storage.jd.com/cjj-pub-images/jdapp_yanxuan_wx_demo.jpg)

##### 京东小程序端

![yanxuan_jd](http://storage.jd.com/cjj-pub-images/jdapp_yanxuan_jd_demo.jpg)

## 未来规划

Taro 团队对于京东小程序是充满期待和信心的。为此我们讨论并规划了一系列工作，由底层框架适配，到辅助业务落地、拓展京东小程序生态，再到京东小程序的[可视化自助搭建](https://ling.jd.com/atom/cms/pc/06599/)等，目前已经完成物料市场的部分物料适配验证并标记支持京东小程序、体验可视化自助搭建请点击[这个链接](https://ling.jd.com/atom/cms/pc/06599/)按照指引申请体验权限。


## 期待大家参与共建

有任何意见建议、业务支持、合作诉求的，尽请发送邮件到 **taro@jd.com**，我们会第一时间回复。

心动不如行动，现在就开始使用 Taro 开发你的[京东小程序](https://mp.jd.com/?entrance=taro)吧～


## 了解更多关于京东小程序

[《京东小程序平台，他来了》](https://taro-club.jd.com/topic/1426/%E4%BA%AC%E4%B8%9C%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%B9%B3%E5%8F%B0-%E4%BB%96%E6%9D%A5%E4%BA%86)

---
slug: 2022-01-19-how-to-join-Taro.md
title: 如何参与大型开源项目-Taro 共建
authors: Jiaozi
tags: [v3]
description: '本文讲述了参与大型开源项目-Taro 的流程，其中以为 Taro 解决 issue 的视角，介绍了从认领 issue、解决 issue、贡献代码的完整过程。'
---

## 一、背景

在开发的工作中，我们都引用过大量的社区优秀的开源项目，但怎么才能更好的了解这些开源项目呢，答案是 **Join it**。

参与开源项目，能够帮助我们拓宽对研发项目的认识，更好的理解开源项目的原理，以及提高个人影响力、竞争力。

## 二、选择项目

人对于不熟悉的东西总是觉得高深莫测的，没有参与开源项目的经验的时候，会对参与开源项目不知道从何下手。

其实不然，在我们开发日常需求时就可以参与到开源项目中来，开发时用到的技术栈，就是我们最值得入手的开源项目了。

像我自己日常有开发微信小程序、京东小程序等跨平台的需求，这类型需求主要技术栈是 [Taro](https://github.com/NervJS/taro)，[Taro](https://github.com/NervJS/taro) 本身就是 github star 近 30 k 的优秀开源项目了，那么我就可以从 Taro 着手，参与到开源项目的建设工作中。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a28ef429b4047ea838208d14143f1f5~tplv-k3u1fbpfcp-watermark.image?)

## 三、快速开始

首先要了解、遵守开源项目的贡献规范，一般可以在官网找到贡献规范文档，如 [Taro 贡献指南](https://taro-docs.jd.com/taro/docs/CONTRIBUTING)。

### 1. 确定贡献形式

贡献形式多种多样，下面我以 **“提交代码”** 类型快速开始贡献流程。

![s17110101222022](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b01d363357f24181835ac08d43196231~tplv-k3u1fbpfcp-zoom-1.image)

### 2. 找到感兴趣的 issue

> Taro 官网：issue 中会列出所有被标记为 Help Wanted 的 Issues，并且会被分为 Easy、 Medium、 Hard 三种难易程度。

通过 issue 标签筛选，选择自己感兴趣的 issue，可以先从 **"Easy"** 的开始：

![s17454801222022](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70b054166ff542e7be25584fde5f6de8~tplv-k3u1fbpfcp-zoom-1.image)

在 issue 中 Assignees 至自己：

![s17463701222022](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f1b088680d34783ac2712106b77cf4e~tplv-k3u1fbpfcp-zoom-1.image)

### 3. fork & clone

fork Taro 源码至自己仓库：

![s17280901222022](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d23dd5050964d1ea3aa0b2f75c1d0c9~tplv-k3u1fbpfcp-zoom-1.image)

clone 个人仓库的 Taro 源码至本地：

```
git clone https://github.com/jiaozitang/taro
```

### 4. 本地开发环境

在 Taro 源码项目中安装依赖并编译：

```
# 安装依赖
$ yarn

# 编译
$ yarn build
```

查看该 issue 涉及哪些 package，为这些 package 设置 yarn link，并在本地编译，使得调试项目能够 link 到开发中的源码：

> Taro package 说明见文档：[Taro 仓库概览](https://taro-docs.jd.com/taro/docs/codebase-overview)

```
# yarn link
$ cd packages/taro-components
$ yarn link

# 本地编译
$ yarn dev
```

新建 Taro 项目用于调试 Taro 源码：

```
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli

# 初始化项目
$ taro init myApp

# yarn link
$ yarn link "@tarojs/components"
```

### 5. 开始开发

#### 5.1 功能开发

通过以下步骤解决上述 **[“textarea 组件 onLineChange 时间调用无效”](https://github.com/NervJS/taro/issues/8003)** issue：

> 源码路径：packages/taro-components/src/components/textarea/textarea.tsx

onLineChange 事件：

- 新增 onLineChange 事件
- 监听输入事件，输入时通过行高计算行数
- 行数改变时触发 onLineChange

auto-height 属性：

- 新增 auto-height 属性
- 新增 auto-height 样式

具体代码见：https://github.com/NervJS/taro/pull/10681/files

#### 5.2 更新测试用例

在测试用例中添加对 onLineChange 事件、aotu-height 属性的测试。

> 源码路径：packages/taro-components/\_\_tests\_\_/textarea.spec.js

#### 5.3 更新文档

在 README 中更新对 onLineChange、auto-height 的描述。

> 源码地址：packages/taro-components/src/components/textarea/index.md

#### 5.4 自测

在本地测试项目 myApp 中，自测 onLineChange 事件、auto-height 属性功能是否正常，自测通过后，在 Taro 源码项目中跑自动化测试。

```
# 自动化测试
$ npm run test
```

### 6. 提交 pull request

测试通过后，在 github 中提交 pull requrst。

![s18260601222022](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/711361ce7a3b4e8bb21920c717693e6e~tplv-k3u1fbpfcp-zoom-1.image)

### 7. code review 流程

提交 pull request 后等待社区 code review，并及时跟进 code review 反馈进行修改。

![s09142901242022](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ddab0a662824ad78e63b9ee2232d7c3~tplv-k3u1fbpfcp-zoom-1.image)

## 四、总结

本文讲述了参与大型开源项目-Taro 的流程，其中以为 Taro 解决 issue 的视角，介绍了从认领 issue、解决 issue、贡献代码的完整过程。

在这个过程中，我们可以了解到如何参与开源项目并帮助开源项目解决问题，在开发工作中遇到开源项目的问题时，就可以愉快的参与进来了，不用因为一个小问题耽搁项目进度。

星星之火，可以燎原，在越来越多的开发者的参与下，开源社区的发展未来可期。

## 参考资料

- [如何参与一个顶级开源项目](https://juejin.cn/post/6844903918749614087)

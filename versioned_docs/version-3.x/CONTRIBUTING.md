---
title: 贡献指南
---

正如我们在[《给开发者的信》](./join-in) 中所写的，我们非常欢迎各位开发者为 Taro 社区做出贡献。

贡献之前，请你花一些时间阅读以下内容，保证贡献是符合规范并且能帮助到社区。

## 贡献形式

> “Taro 社区如何运作？我可以怎样参与？”

Taro 接受各种形式的贡献，无论是提交一个重大改动，还是反馈一个问题或参加一次讨论，都能强化 Taro 的网络效应，让 Taro 变得越来越好用。

接下来，我们整理了 Taro 社区日常运营中常遇的各种细分情景。开发者可以从“参与讨论”、“提出问题”开始，一步一步融入社区，和 Taro 互相成就、共同成长。

### 参与讨论

可以到 [Taro 论坛](https://github.com/NervJS/taro/discussions) 的对应板块参与讨论。

Taro Github 上不断地产生着 [Issues](https://github.com/NervJS/taro/issues) 和 [Pull Request](https://github.com/NervJS/taro/pulls)，也非常欢迎各位开发者 Review 并参与讨论。

### Bug 反馈

请使用 [Issue 生成工具](https://issue.taro.zone/) 提交 Bug 反馈，并在上尽可能详细地提供一切必要信息，最好能附上一个可复现的 Demo。

一般情况下，**信息提供得越完整，响应时间越短**。

### Feature Request

如果你有一个 Feature Request，请到[论坛](https://github.com/NervJS/taro/discussions/categories/feature-request)新建一条帖子进行描述。

Taro 会收集重要的 Feature Requests，在 [《来为 Taro 的 Feature Request 投票吧！》](https://github.com/NervJS/taro/issues/6997) 中进行公示，开发者可以根据需要进行投票，需求强烈的特性会被**优先支持**。

### 修改文档

文档是开发者与框架沟通的桥梁，但文档一直以来是 Taro 的弱项。一方面我们会不断完善文档，另一方面也希望社区能协助我们把文档做好。

当阅读时遇到明显的错误，开发者可以点击每篇文档最下方的 `Edit this page` 按钮，即会打开 Github 的编辑界面。开发者对文档进行编辑后，就可以提交一个 Pull Request。

如果是较复杂的修改，可以按以下步骤进行操作：

#### 1. 下载 Taro 仓库

```bash
$ git clone git@github.com:NervJS/taro.git
```
#### 2. 切换到 docs 分支

```bash
$ git checkout docs
```
#### 3. 编译预览

```bash
$ npm run start
```

#### 4. 修改、新增对应文档

> 文档支持 `md` 和 `mdx` 后缀，语法详见 [Docusaurus 官网](https://docusaurus.io/docs/next/markdown-features)

##### 4.1 修改文档

进入 `docs` 目录，找到对应的文件进行编辑。（必须，对应**下个版本**的相关文档）

进入 `versioned_docs/version-3.x` 目录，找到对应的文件进行编辑。（可选，对应**3.x 版本**的相关文档。不修改则需要等待 Taro 团队更新文档版本后，才会同步到文档的 `3.x` 版本）

##### 4.2 新增文档

新增文档和修改文档类似，首先分别到 `docs` 和 `versioned_docs/version-3.x` 目录新增一个文件。然后在 `sidebars.js` 和 `versioned_sidebars/version-3.x-sidebars.json` 文件中添加上述新增文件的路径。

### 新想法

无论是 Taro 团队内部还是社区第三方开发者，在为 Taro 提交一个重大特性时，都必须按照 Taro 的 [RFC（Request For Comment）机制](https://github.com/NervJS/taro-rfcs) 进行操作，经过社区讨论完善后再进行代码的提交。

因此如果你对 Taro 的发展有新的想法，如实现一个重要功能、拓展新的使用场景等，需要先撰写对应功能的 **RFC** 文档，Taro 团队会进行一系列推送，在社区征集意见。

> 可以访问 [taro-rfcs 仓库](https://github.com/NervJS/taro-rfcs)提交 RFC 或者查看相关的 RFC。

### 提交代码

> “我可以从哪些方向入手？又应该怎么做？”

开发者可以从处理 Issues 入手，[这里](https://github.com/NervJS/taro/issues?q=label%3A%22good+first+issue%22+is%3Aissue+is%3Aopen)会列出所有被标记为 **Help Wanted** 的 Issues，并且会被分为 `Easy`、 `Medium`、 `Hard` 三种难易程度。

除了帮忙处理 Issues，Taro 还有很多方向需要人力进行建设。

随着对 Taro 内部运行机制的熟悉，开发者可能会产生一些新的想法，例如希望开发一些新的功能等。这时需要先编写 RFC 文档，在社区谈论完善后再开始编码。

在开发之前请先阅读[《Taro 的仓库概览》](./codebase-overview)，它介绍了 Taro 仓库构成、如何开发和提交规范等信息。

如果是首次提交代码，可参考文章：[如何参与大型开源项目-Taro 共建](https://docs.taro.zone/blog/2022-01-24-how-to-join-taro)。

### 工具分享

在社区分享你的 “轮子”（例如**SDK**、**组件**、**插件**、**UI 库**、**开源项目**等）。  

可以提交到 [Taro 物料市场](https://taro-ext.jd.com)、文档[《社区优质物料》](./treasures) 、仓库 [awesome-taro](https://github.com/NervJS/awesome-taro) 里，并提供完善的说明。然后在 [Taro 论坛](https://github.com/NervJS/taro/discussions/categories/%E7%94%9F%E6%80%81) 中添加一条讨论，与开发者进行沟通。

Taro 团队会定期甄选优秀的物料汇集成文，在 Taro 社区和各大有影响力的前端渠道进行推广。

### 案例分享

分享你的成功案例，可以提交到 [taro-user-cases](https://github.com/NervJS/taro-user-cases)（只需提交小程序码、二维码）。

### 文章投稿

分享你的经验（教程、文章等），可以给「Taro社区」公众号投稿。

## Credits

感谢以下所有给 Taro 贡献过代码的开发者：

<a href="https://github.com/NervJS/taro/graphs/contributors"><img src="https://opencollective.com/taro/contributors.svg?width=890&avatarHeight=36&button=false" /></a>

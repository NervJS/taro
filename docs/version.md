---
title: Taro 版本说明
---

当前 Taro 已进入 3.x 时代，相较于 Taro 1/2 编译时架构，Taro 3 采用了重运行时的架构，让开发者可以获得完整的 React / Vue 等框架的开发体验。具体原理请参考 [《小程序跨框架开发的探索与实践》](https://mp.weixin.qq.com/s?__biz=MzU3NDkzMTI3MA==&mid=2247483770&idx=1&sn=ba2cdea5256e1c4e7bb513aa4c837834)。

### 最新版本

最新版本可在 [Taro Release](https://github.com/NervJS/taro/releases) 中查阅。

也可以在命令行输入命令查看：

```bash
npm info @tarojs/cli
```

### Taro 3.1

Taro 3.1 的主要改动是打造开放式架构，支持以插件的形式编译到任意小程序平台。

详情请参考 [《Taro 正式发布 3.1 版本》](../../blog/2021-03-10-taro-3-1-lts)。

### Taro 3.2

Taro 3.2 新增了对 ReactNative 的支持。

详情请参考 [《Taro 3.2 版本正式发布：React Native 支持，王者归来》](../../blog/2021-04-08-taro-3.2)。

### Taro 1 / 2

如果你想使用 Taro 1/2，可以访问[文档版本](/versions)获得帮助。

### 版本信息

Taro 每个版本的详细发布信息可在 [Taro Release](https://github.com/NervJS/taro/releases) 中查阅。

### 开发计划

目前 Taro 团队的迭代重心在于 Taro 3，Taro 1 / 2 只会对重大问题进行修复，不会新增新特性。

Taro 每周会发布 **patch 版本**，进行小型特性新增和问题修复。

重大特性会首先通过 [Taro-RFC](https://github.com/NervJS/taro-rfcs) 进行公示与意见采集，然后经开发测试后，最终发布 **minor** 版本。

详细的开发计划可在 [Taro MileStones](https://github.com/NervJS/taro/milestones) 中查阅。

### 升级指南

如何从 Taro 1 / 2 升级到 Taro 3 请参考：[从旧版本迁移到 Taro Next](./migration)。

关于各版本间更详尽的迁移的指南请参考：[《Taro 版本升级权威指南》](/blog/2020-09-01-taro-versions)。

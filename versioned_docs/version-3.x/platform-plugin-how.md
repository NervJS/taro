---
title: 编写端平台插件
---

扩展一个编译平台，需要编写一个 [Taro 插件](./plugin)，对编译时和运行时分别进行兼容。

## 端平台插件架构

### 插件目录组织

以 `@tarojs/plugin-platform-weapp` 为例：

    ├── src                      源码目录
    |   ├── index.ts             插件入口
    |   ├── program.ts           编译时入口
    |   ├── template.ts          模板处理逻辑
    |   ├── runtime.ts           运行时入口
    |   ├── runtime-utils.ts     运行时依赖工具
    |   ├── apis.ts              API 相关处理
    |   ├── apis-list.ts         API 列表
    |   ├── components.ts        组件列表
    |   └── components-react.ts  给 React 使用的组件类型
    ├── types                    类型
    ├── index.js                 编译时入口
    ├── tsconfig.json
    ├── rollup.config.json
    ├── package.json
    └── README.md

### 架构图

![](http://storage.jd.com/cjj-pub-images/platform-plugin-construct.png)

## 编译时

处理编译相关操作，如 Webpack 配置、模板生成规则等。

### 一、编写 Taro 插件

前置阅读：[【如何编写一个 Taro 插件】](./plugin#如何编写一个插件)。

首先我们需要编写一个 Taro 插件来注册我们的编译平台，如：

```js title="index.ts"
export default (ctx) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    async fn (arg) {
      // ...
    }
  })
}
```

#### ctx.registerPlatform(options: object)

注册一个编译平台

##### options.name

`string`

平台名称，用于 CLI 编译命令。

如配置了 'xxx'，则编译此平台时使用的 CLI 命令为：

```shell
taro build --type xxx
taro build --type xxx --watch
```

##### options.useConfigName

`string`

把 Taro 编译配置中的指定字段纳入编译。

Taro 小程序相关配置默认放在 `mini` 字段下，因此一般情况配置 `usingConfigName: mini` 即可。

##### options.fn(arg)

`function`

端平台编译的入口函数，接受一个参数 `arg`，在此函数内我们可以开始编写端平台编译的逻辑。

###### arg

`object`

整合上述 [options.useConfigName](./platform-plugin-how#optionsuseconfigname) 指定字段后的 Taro 编译配置，编译配置各字段详情请看[编译配置详情](./config-detail.md)。

### 二、编写平台类

接下来给上一节中提到的插件入口函数添加内容。

我们把编译时常用的逻辑抽象出了一个基类 [TaroPlatformBase](./platform-plugin-base)，开发者可以[继承](./platform-plugin-base#自定义平台类)于此基类，从而实现端平台的编译。

然后在插件入口函数中调用上述自定义平台类的编译接口：

```js title="index.ts"
import Weapp from './program'

export default (ctx) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    async fn (arg) {
      // 调用自定义平台类的 start 函数，开始端平台编译
      const program = new Weapp(ctx, config)
      await program.start()
    }
  })
}
```

## 运行时

处理运行时相关操作，如 API、组件、Taro runtime 逻辑等。

### 一、处理运行时入口

#### 1. 编写 runtime.ts

`runtime.ts` 是我们运行时的入口文件，`Webpack` 编译时会把它注入到 `app.js` 中进行引用。

例子：

```js title="runtime.ts"
import { mergeReconciler, mergeInternalComponents } from '@tarojs/shared'
import { hostConfig, components } from './runtime-utils'

mergeReconciler(hostConfig)
mergeInternalComponents(components)
```

```js title="runtime-utils.ts"
export * from './components'
export const hostConfig = {}
```

`runtime.ts` 主要负责：

* 使用 `mergeReconciler` 函数把自定义的 `hostConfig` 合并到全局 [Reconciler](./platform-plugin-reconciler) 中。
* 使用 `mergeInternalComponents` 函数把自定义组件信息 [components.ts](./platform-plugin-base#31-编写-componentsts) 合并到全局 `internalComponents` 组件信息对象中。

> 抽取 runtime-utils.ts 是为了方便其它插件引用

#### 2. 连接插件入口

为了让 `Webpack` 知道去哪里引用上述运行时入口文件，需要配置 `runtimePath`：


```js title="program.ts"
class Weapp extends TaroPlatformBase {
  runtimePath = '@tarojs/plugin-platform-weapp/dist/runtime'
}
```

### 二、处理 API

在 Taro 中，用户需要从 `@tarojs/taro` 中引用 Taro 的内置 API 和 **Promise 化** 后的小程序 API。

```js
import Taro from '@tarojs/taro'

// 内置 API
Taro.getCurrentInstance()
// 小程序 API
Taro.request()
```

#### 1. 配置 initNativeApi

原始的 `@tarojs/taro` 包只提供了内置 API。我们需要通过配置 `Reconciler` 的 [initNativeApi](./platform-plugin-reconciler#initnativeapi-taro) 选项，为全局 Taro 对象增加小程序的 API 和我们想要挂载在 Taro 对象上的 API。

```js title="apis-list.ts"
// 需要新增额外的原生 API 时，分拆一个单独的 `apis-list.ts` 文件能有利于维护。

// 同步 API
export const noPromiseApis = new Set([
  'getAccountInfoSync'
])

// 异步 API，这些 API 都可以设置 `success`、`fail`、`complete` 回调，需要对它们进行 Promise 化。
export const needPromiseApis = new Set([
  'addCard'
])
```

```js title="apis.ts"
import { processApis } from '@tarojs/shared'
import { noPromiseApis, needPromiseApis } from './apis-list'

declare const wx: any

export function initNativeApi (taro) {
  // 下文将详细介绍 processApis 函数
  processApis(taro, wx, {
    noPromiseApis,
    needPromiseApis
  })
  // 可以为 taro 挂载任意的 API
  taro.cloud = wx.cloud
}
```

```js title="runtime-utils.ts"
import { initNativeApi } from './apis'
export const hostConfig = { initNativeApi }
```

#### 2. processApis(taro, global, options)

##### 入参

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| taro | object | Taro 对象 |
| global | object | 小程序全局对象，如微信的 wx |
| options | object | 配置项 |

###### options

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| noPromiseApis | Set`<string>` | 新增的同步 API |
| needPromiseApis | Set`<string>` | 新增的异步 API |

上述 `processApis` 函数帮助我们做了三件事情：

1. 挂载所有平台公共的小程序 API 到 Taro 对象上
2. 挂载常用的小程序全局对象属性 到 Taro 对象上
3. 挂载用户传入的小程序 API 到 Taro 对象上

## 打包

插件使用 `Rollup` 进行打包，需要打包出以下文件：

| 入口文件 | 模式 | 必要 | 说明 |
| :--- | :--- | :--- | :--- |
| src/index.ts | cjs | 是 | 插件入口，供 Taro CLI 解析 |
| src/runtime.ts | es | 是 | 运行时入口 |
| src/runtime-utils.ts | es | 否 | 运行时工具集合，供继承的子类引用 |
| src/components-react.ts | es | 否 | 有新增组件时需要实现，供 React 引用 |

注意，Taro 相关的包需要配置 `external`，以免重复打包：

```js title="rollup.config.js"
{
  external: ['@tarojs/shared', '@tarojs/service']
}
```

## 类型

Taro 核心库维护的类型可能没有包括当前插件新增的组件和 API，这时我们需要对 `@tarojs/taro` 和 `@tarojs/components` 进行[模块补充 (module augmentation)](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)。

创建一个类型定义文件：

```ts title="types/shims-iot.d.ts"
// 为支付宝 IOT 小程序拓展新增的 API 和组件定义
import { ComponentType } from 'react'
import Taro from '@tarojs/taro'

declare module '@tarojs/taro' {
  namespace ix {
    function onCashierEventReceive (cb: any): void
  }
}

interface PosterProps {
  posid: string
  audible?: boolean
  onSuccess?: () => void
  onFail?: () => void
  onChange?: () => void
}

declare module '@tarojs/components' {
  export const Poster: ComponentType<PosterProps>
}
```

开发者在类型定义文件中引入此文件即可：

```ts title="global.d.ts"
/// <reference path="node_modules/@tarojs/plugin-platform-alipay-iot/types/shims-iot.d.ts" />
```

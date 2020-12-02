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
      const program = new Weapp(ctx, arg.config)
      program.start()
    }
  })
}
```

## 运行时

处理运行时相关操作，如 API、组件、Taro runtime 逻辑等。

### 一、处理运行时入口

#### 1. 编写 runtime.ts

`runtime.ts` 是我们运行时的入口文件，当 `Webpack` 使用 `AppLoader` 加载入口文件时，它会被注入到 `app.js` 中进行引用。

例子：

```js
// runtime.ts
import { mergeReconciler, mergeInternalComponents } from '@tarojs/shared'
import { hostConfig, components } from './runtime-utils'

mergeReconciler(hostConfig)
mergeInternalComponents(components)

// runtime-utils.ts
export * from './components'
export const hostConfig = {}
```

`runtime.ts` 主要负责：

* 使用 `mergeReconciler` 函数把自定义的 `hostConfig` 合并到全局 [Reconciler](./platform-plugin-reconciler) 中。
* 使用 `mergeInternalComponents` 函数把自定义组件信息 [components.ts](./platform-plugin-base#31-编写-componentsts) 合并到全局 `internalComponents` 组件信息对象中。

> 抽取 runtime-utils.ts 是为了方便其它插件引用

#### 2. 连接插件入口

为了让 `Webpack` 的 `AppLoader` 知道去哪里引用上述编写的运行时入口文件，需要给 `@tarojs/mini-runner` 传入 `runtimePath` 参数：

```js
// program.ts
const PACKAGE_NAME = '@tarojs/plugin-platform-weapp'

class Weapp extends TaroPlatformBase {
  // ...
  runtimePath = `${PACKAGE_NAME}/dist/runtime`

  async start () {
    //...
    const runner = await this.getRunner()
    // 告诉 AppLoader 从 this.runtimePath 中引用运行时入口
    const options = this.getOptions({
      runtimePath: this.runtimePath
    })
    runner(options)
  }
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

```js
// runtime-utils.ts
import { initNativeApi } from './apis'
export const hostConfig = { initNativeApi }

// apis.ts
export function initNativeApi (taro) {
  // 挂载小程序原生 API （promise 化）
  processApis(taro)
  // 挂载额外 API
  taro.xxx = 'xxx'
}
```

#### 2. 挂载小程序原生 API

接下来介绍上述的 `processApis` 函数。

我们把目前支持的 6 种小程序的 API 进行了比对，搜集出最通用的 API，并把它们归为三类：

* taro.onAndSyncApis 
  同步调用函数，或事件监听函数。

* taro.noPromiseApis
  非异步函数。

* taro.otherApis

  这些 API 都可以设置 `success`、`fail`、`complete` 回调，需要对它们进行 Promise 化。

当前扩展的小程序平台如果需要额外新增 API，建议使用一个 `apis-list.ts` 文件维护：

```js title="apis-list.ts"
// 微信小程序部分扩展 API
export const _onAndSyncApis = new Set([
  'getAccountInfoSync'
])

export const _noPromiseApis = new Set([
  'createAudioContext'
])

export const _otherApis = new Set([
  'addCard'
])
```

最终在 `processApis` 函数中对该小程序支持的所有 API 进行处理：

```js
import { _onAndSyncApis, _noPromiseApis, _otherApis } from './apis-list'

function processApis (taro) {
  const onAndSyncApis = new Set([...taro.onAndSyncApis, ..._onAndSyncApis])
  const noPromiseApis = new Set([...taro.noPromiseApis, ..._noPromiseApis])
  const otherApis = new Set([...taro.otherApis, ..._otherApis])

  // 合并基础 API 和小程序独有 API
  const apis = [...onAndSyncApis, ...noPromiseApis, ...otherApis]
  
  apis.forEach(key => {
    if (otherApis.has(key)) {
      // 对异步方法进行 Promise 化
      taro[key] = (options) => {
        // 此处 promisefy 是伪函数，代表对 API 进行 Promise 化，具体实现可参考各内置端平台插件
        return promisefy(key, options)
    } else {
      // 非异步方法直接调用原生 API
      taro[key] = () => {
        return wx[key](...arguments)
      }
    }
  })
}
```

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

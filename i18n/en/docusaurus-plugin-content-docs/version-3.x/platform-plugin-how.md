---
title: Write Platform plugins
---

Extending a compiled platform requires writing a [Taro plugin](. /plugin) for compile-time and run-time compatibility respectively.

## Platform Plugin Architecture

### Plugin Directory

Using `@tarojs/plugin-platform-weapp` as an example.

    ├── src                      Source code directory
    |   ├── index.ts             Plugin entry
    |   ├── program.ts           Compile entry
    |   ├── template.ts          Template handling
    |   ├── runtime.ts           Runtime entry
    |   ├── runtime-utils.ts     Runtime dependency tools
    |   ├── apis.ts              API related processing
    |   ├── apis-list.ts         API list
    |   ├── components.ts        Component list
    |   └── components-react.ts  Types of components for React to use
    ├── types                    Type
    ├── index.js                 Compile-time entry
    ├── tsconfig.json
    ├── rollup.config.json
    ├── package.json
    └── README.md

### Architecture Diagram

![](https://storage.jd.com/cjj-pub-images/platform-plugin-construct.png)

## Compile Time

Handles compile-related operations such as Webpack configuration, template generation rules, etc.

### 一、Writing Taro plugins

Pre-reading: [[How to Write a Taro Plugin]](./plugin#如何编写一个插件)。

First we need to write a Taro plugin to register our compilation platform, eg.

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

Register a compilation platform

##### options.name

`string`

The platform name for the CLI compile command.

If 'xxx' is configured, the CLI command to use when compiling this platform:

```shell
taro build --type xxx
taro build --type xxx --watch
```

##### options.useConfigName

`string`

Incorporate the specified fields from the Taro compilation configuration into the compilation.

Taro minn program related configuration is placed under the `mini` field by default, so in general it is sufficient to configure `usingConfigName: mini`.

##### options.fn(arg)

`function`

The entry function for platform compilation accepts an argument `arg`, in which we can start writing the logic for end-platform compilation.

###### arg

`object`

Integrate the above [options.useConfigName](./platform-plugin-how#optionsuseconfigname) specified fields, see [compilation configuration details](./config-detail.md).

### 二、Writing platform classes

Next add to the plugin entry function mentioned in the previous section.

We abstracted the logic commonly used at compile time into a base class [TaroPlatformBase](./platform-plugin-base), which developers can [inherit](./platform-plugin-base#custom platform class) from this base class to enable platform compilation.

The compilation interface of the above custom platform class is then called in the plugin entry function as follows.

```js title="index.ts"
import Weapp from './program'

export default (ctx) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    async fn (arg) {
      // Call the start function of the custom platform class to start platform compilation
      const program = new Weapp(ctx, config)
      await program.start()
    }
  })
}
```

## Runtime

Handles runtime-related operations such as APIs, components, Taro runtime logic, etc.

### 一、Handling Of Runtime Entry

#### 1. Writing runtime.ts

`runtime.ts` is our runtime entry file, which `Webpack` will inject into `app.js` for reference when it is compiled.

Example:

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

`runtime.ts` responsibilities:

* Use the `mergeReconciler` function to merge the custom `hostConfig` into the global [Reconciler](./platform-plugin-reconciler).
* Use the `mergeInternalComponents` function to merge custom component information [components.ts](./platform-plugin-base#31-write-componentsts) into the global `internalComponents` component information object.

> The runtime-utils.ts is extracted to make it easier for other plugins to reference

#### 2. Connection Plugin Entry

In order for `Webpack` to know where to refer to the above runtime entry files, `runtimePath` needs to be configured.

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  runtimePath = '@tarojs/plugin-platform-weapp/dist/runtime'
}
```

### 二、Handling API

In Taro, users need to refer to Taro's built-in API and the **Promise-ified** mini program API from `@tarojs/taro`.

```js
import Taro from '@tarojs/taro'

//  API
Taro.getCurrentInstance()
// Mini program API
Taro.request()
```

#### 1. Configure initNativeApi

The original `@tarojs/taro` package only provides the built-in API, we need to add the API for the mini program and the API we want to mount on the Taro object by configuring `Reconciler` with [initNativeApi](./platform-plugin-reconciler#initnativeapi-taro) option to add APIs for mini program to the global Taro object and the APIs we want to mount on the Taro object.

```js title="apis-list.ts"
// When additional native APIs need to be added, splitting a separate `apis-list.ts` file can be beneficial for maintenance.

// Synchronization API
export const noPromiseApis = new Set([
  'getAccountInfoSync'
])

// Asynchronous APIs, which can set `success`, `fail`, and `complete` callbacks, need to be Promiseized.
export const needPromiseApis = new Set([
  'addCard'
])
```

```js title="apis.ts"
import { processApis } from '@tarojs/shared'
import { noPromiseApis, needPromiseApis } from './apis-list'

declare const wx: any

export function initNativeApi (taro) {
  // The following section describes the processApis function in detail
  processApis(taro, wx, {
    noPromiseApis,
    needPromiseApis
  })
  // Any API that can be mounted for taro
  taro.cloud = wx.cloud
}
```

```js title="runtime-utils.ts"
import { initNativeApi } from './apis'
export const hostConfig = { initNativeApi }
```

#### 2. processApis(taro, global, options)

##### Parameters

| Parameters | Type | Description |
| :--- | :--- | :--- |
| taro | object | Taro Object |
| global | object | Mini Program global objects, such as WeChat wx |
| options | object | Configuration items |

###### options

| Parameters | Type | Description |
| :--- | :--- | :--- |
| noPromiseApis | Set`<string>` | New Synchronization API |
| needPromiseApis | Set`<string>` | New Asynchronous API |

The above `processApis` function helps us do three things.

1. mount all of the platform's common mini program APIs onto a Taro object
2. mount the common mini program global object properties on the Taro object
3. mount the user-input mini program API on the Taro object

## Build Packages

The plugin is packaged using `Rollup` and requires the following files to be packaged out.

| Entry file | Mode | Required | Description |
| :--- | :--- | :--- | :--- |
| src/index.ts | cjs | YES | Plugin entry for Taro CLI parsing |
| src/runtime.ts | es | YES | Runtime entry |
| src/runtime-utils.ts | es | NO | Collection of runtime tools for reference by inherited subclasses |
| src/components-react.ts | es |  NO | Need to be implemented when there are new components for React to reference |

Note that Taro-related packages need to be configured with `external` to avoid repackaging.

```js title="rollup.config.js"
{
  external: ['@tarojs/shared', '@tarojs/service']
}
```

## Types

The types maintained by the Taro core library may not include components and APIs added by the current plugin, in which case we need to perform [module augmentation (module augmentation)] for `@tarojs/taro` and `@tarojs/components` (https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

Create a type definition file:

```ts title="types/shims-iot.d.ts"
// Extend new APIs and component definitions for Alipay IOT mini program
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

The developer can simply introduce this file in the type definition file.

```ts title="global.d.ts"
/// <reference path="node_modules/@tarojs/plugin-platform-alipay-iot/types/shims-iot.d.ts" />
```

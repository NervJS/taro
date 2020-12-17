---
title: TaroPlatformBase
---

我们把编译时常用的逻辑抽象出了一个基类 `TaroPlatformBase`，开发者可以继承于此基类，从而实现端平台的编译。

例如我们创建一个微信小程序平台：

```js title="program.ts"
import { TaroPlatformBase } from '@tarojs/service'
export default class Weapp extends TaroPlatformBase {
  // ...
}
```

## 方法与属性

### constructor (ctx, config)

构造函数，接受两个参数。

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| ctx | object | 插件上下文对象 |
| config | object | Taro 编译配置 |

### this.ctx

`object`

插件上下文对象。

### this.helper

`object`

存放着一系列工具函数，对应 `@tarojs/helper` 包的导出内容。

### this.config

`object`

编译配置对象。

### this.platform

`string`

需要由子类设置，平台名称。

### this.globalObject

`string`

小程序挂载各种 API 的全局对象名称。如微信小程序的 `wx`，支付宝小程序的 `my`。

### this.fileType

`object`

平台的各种文件的后缀名，如：

```js
fileType = {
  // 模板文件后缀
  templ: '.wxml',
  // 样式文件后缀
  style: '.wxss',
  // 配置文件后缀
  config: '.json',
  // 脚本文件后缀
  script: '.js',
  // 【可选】渲染层脚本文件后缀，如微信小程序的 wxs，支付宝小程序的 sjs
  xs: '.wxs'
}
```

### this.template

`object`

模板对象，下文将详细介绍。

### setup ()

此函数处理了两件事：

1. 清空 dist 文件夹
2. 输出编译提示（提示用户可以如何在 Dev 模式下开启压缩）

### generateProjectConfig (src, dist)

用于生成 project.config.json 此类项目配置文件。

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| src | string |  | 项目源码中配置文件的名称 |
| dist | string | 'project.config.json' | 编译后配置文件的名称 |

例子：

```js
// 把用户编写的 `project.tt.json` 输出为 `project.config.json`
generateProjectConfig('project.tt.json')
// 把用户编写的 `project.swan.json` 输出为 `project.swan.json`
generateProjectConfig('project.swan.json', 'project.swan.json')
```

### recursiveReplaceObjectKeys (target, keyMap)

递归替换目标对象的 key 值。

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| target | object | 目标对象 |
| keyMap | object | key 值替换规则 |

例子，支付宝小程序配置项 key 值和大多数小程序的规范不一样，需要进行对齐：

```js
// this.ctx.modifyMiniConfigs 能获取到小程序入口和页面配置文件的列表
this.ctx.modifyMiniConfigs(({ configMap }) => {
  const replaceKeyMap = {
    navigationBarTitleText: 'defaultTitle',
    navigationBarBackgroundColor: 'titleBarColor',
    enablePullDownRefresh: 'pullRefresh',
    list: 'items',
    text: 'name',
    iconPath: 'icon',
    selectedIconPath: 'activeIcon',
    color: 'textColor'
  }
  Object.keys(configMap).forEach(key => {
    const item = configMap[key]
    if (item.content) {
      // 递归替换配置文件里的 key 值为目标对象的 key 值
      this.recursiveReplaceObjectKeys(item.content, replaceKeyMap)
    }
  })
})
```

### getOptions (extraOptions): options

获取提供给 `@tarojs/mini-runner` 的配置对象。

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| extraOptions | object | 需要额外合入到配置对象的配置项 |

| 返回值 | 类型 | 说明 |
| :--- | :--- | :--- |
| options | object | 配置对象 |

例子：

```js
const options = this.getOptions({
  runtimePath: this.runtimePath
})
```

### getRunner ()

返回当前项目内的 `@tarojs/mini-runner` 包。

例子：

```js
// 获取 @tarojs/mini-runner 包导出的实例
const runner = await this.getRunner()
// 获取配置
const options = this.getOptions({
  runtimePath: this.runtimePath
})
// 启动 webpack 编译
runner(options)
```

## 自定义平台类

接下来将以扩展对微信小程序的编译支持为例，介绍如何创建一个自定义平台类。

### 1. 继承基类

```js title="program.ts"
import { TaroPlatformBase } from '@tarojs/service'

class Weapp extends TaroPlatformBase {
  // 平台名称
  platform = 'weapp'
  // 小程序全局对象
  globalObject = 'wx'
  // 文件后缀
  fileType = {
    templ: '.wxml',
    style: '.wxss',
    config: '.json',
    script: '.js',
    xs: '.wxs'
  }
}

export default Weapp
```

### 2. 处理模板逻辑

编写一个[模板类](./platform-plugin-template)以处理模板逻辑，把它的实例设置为自定义平台类的 `template` 属性：

```js
// program.ts
import { Template } from './template'

class Weapp extends TaroPlatformBase {
  // ...
  template = new Template()
}
```

### 3. 处理组件

我们把目前支持的 6 种小程序进行了组件和组件属性的比对，得出了一份最通用的组件以及其属性。访问上一节 `Template` 类实例的 [internalComponents](./platform-plugin-template#thisinternalcomponents) 属性可以获取到这些通用组件以及属性。

> 抽取这份通用组件的目的是为了在生成 B 小程序的模板时，尽量不会含有 A 小程序独有的组件或属性。

但随着各小程序平台发展，各平台都可能独自新增一些组件或属性。这时我们的端平台插件就需要通过修改 `template.internalComponents` 来处理这些特殊的组件或属性。

#### 3.1 编写 components.ts

`components.ts` 可以导出一个对象，以表示对 `internalComponents` 修改属性、新增属性或新增组件。

规范：

```js title="components.ts"
import { singleQuote } from '@tarojs/shared'

export const components = {
  // 组件名 CamelCase
  ScrollView: 
  // 属性对象
  {
    // value 为空字符串时，代表不设置默认值
    'scroll-left': '',
    // 属性默认值为布尔值或数字时，value 写为字符串
    'enable-flex': 'false',
    'refresher-threshold': '45',
    // 属性默认值为字符串时，需要使用 singleQuote 函数进行包裹
    'refresher-default-style': singleQuote('black'),
    // 事件
    bindRefresherAbort: ''
  }
}
```

#### 3.2 合并到 template.internalComponents

编写好 `components.ts` 后，可以借助模板类实例的 `mergeComponents` 方法进行合并。

##### template.mergeComponents (ctx, patch)

合并组件补丁到 `this.internalComponents`。

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| ctx | object | 插件上下文对象 |
| patch | object | 组件补丁 |

例子：

```js
// program.ts
import { components } from './components'

class Weapp extends TaroPlatformBase {
  modifyComponents () {
    this.template.mergeComponents(this.ctx, components)
  }
}

// components.ts
export const components = {
  ScrollView: {
    'enable-flex': 'true',
    'refresher-threshold': '45'
  },
  Xyz: {
    'a': ''
  }
}

// 假设 template.internalComponent 默认值为：
internalComponent = {
  ScrollView: {
    'scroll-left': '',
    'enable-flex': 'false',
  }
}
// 这时合并后的结果为：
internalComponent = {
  ScrollView: {
    'scroll-left': '',
    // enable-flex 的默认值修改了
    'enable-flex': 'true',
    // 新增了 refresher-threshold 属性
    'refresher-threshold': '45'
  },
  // 新增了 Xyz 组件
  Xyz: {
    'a': ''
  }
}
```

#### 3.3 直接修改 template.internalComponents

除了借助 `template.mergeComponents` 进行合并，我们也可以直接修改 `template.internalComponents`。

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  modifyComponents () {
    // 删除 Slider 组件里的一些属性
    this.modifySlider(this.template.internalComponents.Slider)
    // 改写 View 组件的属性对象
    this.template.internalComponents.View = {}
  }

  modifySlider (slider) {
    delete slider['block-size']
    delete slider['block-color']
  }
}
```

建议尽量编写一份 `components.ts` 进行 merge，而不是直接操作。因为运行时也需要合并后的组件信息，编写一份 `components.ts` 能进行复用。

#### 3.4 编写 components-react.ts

在 Taro 里使用 React，内置组件需要从 `@tarojs/components` 这个包引用后再使用。但如果我们增加了新的内置组件，再向 `@tarojs/components` 引用就取不到这些新增的组件。

```js
import { View } from '@tarojs/components'
```

因此当我们新增加了组件时，需要编写 `components-react.ts`，并配置 Webpack alias，供 **React** 引用。

例子：

```js
// components-react.ts
// 原有的组件
export const View = 'view'
// 新增的组件
export const Editor = 'editor'

// program.ts
const PACKAGE_NAME = '@tarojs/plugin-platform-weapp'
class Weapp extends TaroPlatformBase {
  modifyWebpackChain () {
    // 通过 this.ctx.modifyWepackChain 能获取到 WebpackChain 实例
    this.ctx.modifyWebpackChain(({ chain }) => {
      chain.resolve.alias.set(
        '@tarojs/components$',
        `${PACKAGE_NAME}/dist/components-react`
      )
    })
  }
}
```

### 4. 编写接口

我们创建的平台类需要编写一个对外的接口，在其中对编译流程进行设计，最终目标是调用 `@tarojs/mini-runner` 驱动 **Webpack** 开启编译。

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  // ...
  async start () {
    // 清空输出目录和输出提示
    this.setup()
    // 生成 project.config.json
    this.generateProjectConfig(this.projectConfigJson)
    // 配置组件
    this.modifyComponents()
    // 修改 webpack chain
    this.modifyWebpackChain()

    // 获取配置对象，调用 runner 开启编译
    const runner = await this.getRunner()
    const options = this.getOptions({
      runtimePath: this.runtimePath
    })
    runner(options)
  }
}
```

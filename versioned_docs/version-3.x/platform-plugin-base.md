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

### ctx

`object`

插件上下文对象。

#### this.ctx.modifyWebpackChain

获取 WebpackChain，例子：

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  modifyWebpackChain () {
    // 通过 this.ctx.modifyWepackChain 能获取到 WebpackChain 实例
    this.ctx.modifyWebpackChain(({ chain }) => {
      // chain.xxxx
    })
  }
}
```

### helper

`object`

存放着一系列工具函数，对应 `@tarojs/helper` 包的导出内容。

### config

`object`

编译配置对象。

### (abstract) platform

> 抽象属性，子类必须实现。

`string`

平台名称，如：

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  platform = 'weapp'
}
```

### (abstract) globalObject

> 抽象属性，子类必须实现。

`string`

小程序挂载各种 API 的全局对象名称。如微信小程序的 `wx`，支付宝小程序的 `my`，例如：

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  globalObject = 'wx'
}
```

### (abstract) runtimePath

> 抽象属性，子类必须实现。

`stirng` | `string[]`

小程序编译的运行时文件的解析路径，如：

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  runtimePath = '@tarojs/plugin-platform-weapp/dist/runtime'
}
```

### (abstract) fileType

> 抽象属性，子类必须实现。

`object`

平台的各种文件的后缀名，如：

```js title="program.ts"
class Weapp extends TaroPlatformBase {
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
}

```

### (abstract) template

> 抽象属性，子类必须实现。

`object`

[模板对象](./platform-plugin-template)的实例。

### (optional) projectConfigJson

> 子类可选择是否进行设置。

小程序配置文件的名称。

如果子类有实现 `projectConfigJson`，则会自动拷贝此文件到 `dist` 目录下。

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  projectConfigJson = 'project.config.json'
}
```

### (optional) taroComponentsPath

> 子类可选择是否进行设置。

编译时对 `@tarojs/components` 包的 alias，下文将详细介绍。

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  taroComponentsPath = '@tarojs/plugin-platform-weapp/dist/components-react'
}
```

### setupTransaction

`setup` 阶段的事务钩子。

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  /**
   * 1. setupTransaction - init
   * 2. setup
   * 3. setupTransaction - close
   * 4. buildTransaction - init
   * 5. build
   * 6. buildTransaction - close
   */
  constructor (ctx, config) {
    super(ctx, config)

    this.setupTransaction.addWrapper({
      init () {}
      close () {}
    })
  }
}
```

### buildTransaction

`build` 阶段的事务钩子。

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  /**
   * 1. setupTransaction - init
   * 2. setup
   * 3. setupTransaction - close
   * 4. buildTransaction - init
   * 5. build
   * 6. buildTransaction - close
   */
  constructor (ctx, config) {
    super(ctx, config)

    this.buildTransaction.addWrapper({
      init () {}
      close () {}
    })
  }
}
```

### start ()

插件入口调用 `start` 方法开启编译，如：

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  // ...
}

export default (ctx) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new Weapp(ctx, config)
      await program.start()
    }
  })
}
```

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

## 自定义平台类

接下来将以扩展对微信小程序的编译支持为例，介绍如何创建一个自定义平台类。

### 1. 继承基类

继承 `TaroPlatformBase` 以实现 `Weapp` 类，并实现所有抽象属性、可选属性：

```js title="program.ts"
import { TaroPlatformBase } from '@tarojs/service'

const PACKAGE_NAME = '@tarojs/plugin-platform-weapp'

class Weapp extends TaroPlatformBase {
  // 平台名称
  platform = 'weapp'
  // 小程序全局对象
  globalObject = 'wx'
  // 小程序编译的运行时文件的解析路径
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  // 文件后缀
  fileType = {
    templ: '.wxml',
    style: '.wxss',
    config: '.json',
    script: '.js',
    xs: '.wxs'
  }
  template = new Template()
  // 小程序配置文件名称
  projectConfigJson = 'project.config.json'
  // 对 `@tarojs/components` 包的 alias 路径
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-react`

  constructor (ctx, config) {
    super(ctx, config)
  
    /**
    * 1. setupTransaction - init
    * 2. setup
    * 3. setupTransaction - close
    * 4. buildTransaction - init
    * 5. build
    * 6. buildTransaction - close
    */

    // 可以在 setup 的不同阶段注入自定义逻辑
    this.setupTransaction.addWrapper({
      init () {}
      close () {}
    })

    // 可以在 build 的不同阶段注入自定义逻辑
    this.buildTransaction.addWrapper({
      init () {}
      close () {}
    })
  }
}

export default Weapp
```

### 2. 处理模板逻辑

编写一个[模板类](./platform-plugin-template)以处理模板逻辑，把它的实例设置为自定义平台类的 `template` 属性：

```js title="program.ts"
import { Template } from './template'

class Weapp extends TaroPlatformBase {
  // ...
  // 模板实例
  template = new Template()
}
```

### 3. 处理组件

我们把目前支持的 6 种小程序进行了组件和组件属性的比对，得出了一份最通用的组件以及其属性。访问 `Template` 类实例的 [internalComponents](./platform-plugin-template#thisinternalcomponents) 属性可以获取到这些通用组件以及属性。

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

编写好 `components.ts` 后，可以借助 `Template` 类实例的 `mergeComponents` 方法进行合并。

##### template.mergeComponents (ctx, patch)

合并组件补丁到 `this.internalComponents`。

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| ctx | object | 插件上下文对象 |
| patch | object | 组件补丁 |

例子：

```js title="program.ts"
import { components } from './components'

class Weapp extends TaroPlatformBase {
  constructor (ctx, config) {
    super(ctx, config)

    // 在 setup 阶段结束时，修改模板
    this.setupTransaction.addWrapper({
      close: this.modifyTemplate
    })
  }

  modifyTemplate () {
    this.template.mergeComponents(this.ctx, components)
  }
}
```

```js title="components.ts"
export const components = {
  ScrollView: {
    'enable-flex': 'true',
    'refresher-threshold': '45'
  },
  Xyz: {
    'a': ''
  }
}
```

假设 `template.internalComponent` 的默认值为：

```js
internalComponent = {
  ScrollView: {
    'scroll-left': '',
    'enable-flex': 'false',
  }
}
```

合并后的结果为：

```js
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
  modifyTemplate () {
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

> 建议尽量编写一份 `components.ts` 进行 merge，而不是直接操作。因为运行时也需要合并后的组件信息，编写一份 `components.ts` 能进行复用。

#### 3.4 编写 components-react.ts

在 Taro 里使用 React，内置组件需要从 `@tarojs/components` 中引用后再使用。

```js
import { View } from '@tarojs/components'
```

但如果我们**增加了新的内置组件，再从 `@tarojs/components` 中引用就取不到这些新增的组件**。

因此当我们**新增加了组件**时，需要编写一份 `components-react.ts`，并配置 Webpack alias，供 **React** 引用。

例子：

1. 编写 `components-react.ts` 文件

```js title="components-react.ts"
// 原有的组件
export * from '@tarojs/components/mini'
// 新增的组件
export const Editor = 'editor'
export const OfficialAccount = 'official-account'
```

2. 设置 [taroComponentsPath](./platform-plugin-base#optional-tarocomponentspath)

```js title="program.ts"
const PACKAGE_NAME = '@tarojs/plugin-platform-weapp'
class Weapp extends TaroPlatformBase {
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-react`
}
```

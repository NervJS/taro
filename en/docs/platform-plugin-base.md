---
title: TaroPlatformBase
---

We abstract the logic commonly used for compilation into a base class `TaroPlatformBase`that developers can inherit from this base class and thus implement the platform compilation.

For example, we created a micromessenger platform：

```js title="program.ts"
import { TaroPlatformBase } from '@tarojs/service'
export default class of Weapp extends TaroPlatformBase
  // ...
 } }
```

## Methods & Properties

### Constructor (Ctx, config)

Construct a function that accepts two parameters.

| Parameters | Type   | Note                           |
|:---------- |:------ |:------------------------------ |
| ctx        | Object | Plugin Context Object          |
| config     | Object | Taro Compilation Configuration |

### ctx

`Object`

Context object of the plugin.

#### this.ctx.modifyWebpackChain

Get WebpackChain, Example：

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

`Object`

Store a series of tools functions for the export content of `@tarojs/helper`.

### config

`Object`

Compiles config objects.

### (abstract) platform form

> abstract properties, subcategories must be implemented.

`String`

Platform name, e.g.：

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  platform = 'weapp'
}
```

### (abstract) globalObject

> abstract properties, subcategories must be implemented.

`String`

The applet mount the global object name of various APIs.like the micromessaging applet `wx`, the payout applet `my`, eg:：

```js title="program.ts"
class Weapp extents TaroPlatformBase {
  globalObject = 'wx'
}
```

### (abstract) runtimePath

> abstract properties, subcategories must be implemented.

`stirng` | `string[]`

Path to parse file when the applet compiles, e.g.：

```js title="program.ts"
class Weapp extends TaroPlatformBase $
  runtimePath = '@tarojs/plugin-platform-weapp/distant/runtime'
}
```

### (abstract) fileType

> abstract properties, subcategories must be implemented.

`Object`

The suffix of various files in the platform, e.g.：

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

> abstract properties, subcategories must be implemented.

`Object`

[Example of template object](./platform-plugin-template).

### (optional) projectConfigJson

> Subclass can choose whether or not to set up.

Name of the applet configuration file.

If the subclass has an implementation `projectConfigJson`this file will be automatically copied to `dist` directory.

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  projectConfigJson = 'project.config.json'
}
```

### (optional) taroComponentsPath

> Subclass can choose whether or not to set up.

The alias of `@tarojs/components` package is compiled and will be described below.

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  taroComponentsPath = '@tarojs/plugin-platform-weapp/dist/components-react'
}
```

### setupTransaction

`setup` stage transaction hook.

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

### BuildTransaction

`Build` stage transaction hook.

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

Plugin Entrance call `start` to enable compilation, e.g.：

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

### generateProjectConfig (src, distress)

Used to generate project.config.json this type of project profile.

| Parameters | Type   | Default value         | Note                                                      |
|:---------- |:------ |:--------------------- |:--------------------------------------------------------- |
| src        | String |                       | Name of the configuration file in the project source code |
| Dist       | String | 'project.config.json' | Name of compiled profile                                  |

Example：

```js
// Output `project.tt.json` from the user's `project.config.json` to `project.config.json`
generateProjectConfig('project.tt.json')
// Output `project.swan.json` from the user's `project.swan.json` to `project.swan.json`
generateProjectConfig('project.swan.json', 'project.swan.json')
```

### recursiveReplaceObjectKey (target, keyMap)

Replace the key value of the target object recursively.

| Parameters | Type   | Note      |
|:---------- |:------ |:--------- |
| Target     | Object | Target    |
| keyMap     | Object | key 值替换规则 |

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

| 参数    | 类型     | 说明      |
|:----- |:------ |:------- |
| ctx   | object | 插件上下文对象 |
| patch | object | 组件补丁    |

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

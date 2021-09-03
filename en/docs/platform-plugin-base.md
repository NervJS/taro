---
title: TaroPlatformBase
---

We have abstracted the common compile-time logic into a base class `TaroPlatformBase`, which developers can inherit from to achieve platform compilation.

For example, we create a WeChat mini program platform.

```js title="program.ts"
import { TaroPlatformBase } from '@tarojs/service'
export default class Weapp extends TaroPlatformBase {
  // ... }
```

## Methods and Properties

### constructor (ctx, config)

constructor, accepting two parameters.

| Parameter | Type   | Description                    |
|:--------- |:------ |:------------------------------ |
| ctx       | object | Plugin context object          |
| config    | object | Taro compilation configuration |

### ctx

`object`

Plugin context object

#### this.ctx.modifyWebpackChain

Get WebpackChain，for example:

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  modifyWebpackChain () {
    // The WebpackChain instance can be obtained through this.ctx.modifyWepackChain
    this.ctx.modifyWebpackChain(({ chain }) => {
      // chain.xxxx
    })
  }
}
```

### helper

`object`

Holds a set of tool functions corresponding to the exported contents of the `@tarojs/helper` package.

### config

`object`

Compile the configuration object.

### (abstract) platform

> Abstract properties, which subclasses must implement.

`string`

Platform names, eg:

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  platform = 'weapp'
}
```

### (abstract) globalObject

> Abstract properties, which subclasses must implement.

`string`

Global object names for the various APIs mounted by the mini program.For example, `wx` for WeChat mini program, `my` for Alipay mini program, eg.

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  globalObject = 'wx'
}
```

### (abstract) runtimePath

> Abstract properties, which subclasses must implement.

`stirng` | `string[]`

The parsing path of the runtime file compiled by the mini program, eg.

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  runtimePath = '@tarojs/plugin-platform-weapp/dist/runtime'
}
```

### (abstract) fileType

> Abstract properties, which subclasses must implement.

`object`

The suffix names of various files of the platform, eg.

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  fileType = {
    // Template file suffixes
    templ: '.wxml',
    // Style file suffix
    style: '.wxss',
    // Configuration file suffix
    config: '.json',
    // Script file suffix
    script: '.js',
    // 【[Optional] Rendering layer script file suffix, such as wxs for WeChat mini program, sjs for Alipay mini program
    xs: '.wxs'
  }
}

```

### (abstract) template

> Abstract properties, which subclasses must implement.

`object`

The [template object](./platform-plugin-template) instance.

### (optional) projectConfigJson

> Subclasses can optionally be set or not.

The name of the mini program configuration file.

If the subclass has an implementation of `projectConfigJson`, this file will be automatically copied to the `dist` directory.

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  projectConfigJson = 'project.config.json'
}
```

### (optional) taroComponentsPath

> Subclasses can optionally be set or not.

Compile-time alias for the `@tarojs/components` package, described in detail below.

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  taroComponentsPath = '@tarojs/plugin-platform-weapp/dist/components-react'
}
```

### setupTransaction

Transaction hooks for the `setup` phase.

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

The transaction hook for the `build` phase.

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

The plugin entry calls the `start` method to open the build, eg.

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  // ... }

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

For generating a project configuration file like project.config.json.

| Parameters | Type   | Default               | description                                                   |
|:---------- |:------ |:--------------------- |:------------------------------------------------------------- |
| src        | string |                       | The name of the configuration file in the project source code |
| dist       | string | 'project.config.json' | The name of the compiled configuration file                   |

Example:

```js
// Export user-written `project.tt.json` to `project.config.json`
generateProjectConfig('project.tt.json')
// Export user-written `project.swan.json` to `project.swan.json`
generateProjectConfig('project.swan.json', 'project.swan.json')
```

### recursiveReplaceObjectKeys (target, keyMap)

Recursively replace the key value of the target object.

| Parameters | Type   | description                    |
|:---------- |:------ |:------------------------------ |
| target     | object | Target object                  |
| keyMap     | object | Rules for replacing key values |

Example, Alipay mini program configuration item key value is different from the specification of most mini program and needs to be aligned.

```js
// this.ctx.modifyMiniConfigs can get the list of mini program entry and page configuration files
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
      // Recursively replace the key value in the configuration file with the key value of the target object
      this.recursiveReplaceObjectKeys(item.content, replaceKeyMap)
    }
  })
})
```

## Custom Platform Classes

The next section will describe how to create a custom platform class, using the example of extending compilation support for WeChat mini prpgram.

### 1. Inheritance of base class

Inherit `TaroPlatformBase` to implement the `Weapp` class and implement all abstract properties, optional properties.

```js title="program.ts"
import { TaroPlatformBase } from '@tarojs/service'

const PACKAGE_NAME = '@tarojs/plugin-platform-weapp'

class Weapp extends TaroPlatformBase {
  // Platform Name
  platform = 'weapp'
  // Mini program global object
  globalObject = 'wx'
  // The parsed path to the compiled runtime file of the mini program
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  // File suffix
  fileType = {
    templ: '.wxml',
    style: '.wxss',
    config: '.json',
    script: '.js',
    xs: '.wxs'
  }
  template = new Template()
  // Mini program configuration file name
  projectConfigJson = 'project.config.json'
  // alias path to the `@tarojs/components` package
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

    // Custom logic can be injected at different stages of setup
    this.setupTransaction.addWrapper({
      init () {}
      close () {}
    })

    // Custom logic can be injected at different stages of build
    this.buildTransaction.addWrapper({
      init () {}
      close () {}
    })
  }
}

export default Weapp
```

### 2. Handling Template

Write a [template class](./platform-plugin-template) to handle template logic, setting its instance to the `template` property of the custom platform class.

```js title="program.ts"
import { Template } from './template'

class Weapp extends TaroPlatformBase {
  // ... // Template Instance
  template = new Template()
}
```

### 3. Handle Component

We have compared the components and component properties of the 6 currently supported mini program to come up with a list of the most common components and their properties.Accessing the [internalComponents](./platform-plugin-template#thisinternalcomponents) property of the `Template` class instance to get these common components and their properties.

> The purpose of extracting this generic component is to generate templates for mini program B that contain as few components or properties as possible that are unique to mini program A.

However, as each mini program platform develops, each platform may add some new components or attributes on its own.In this case, our platform plugin needs to handle these special components or properties by modifying `template.internalComponents`.

#### 3.1 Write components.ts

`components.ts` can export an object to represent the modification of properties, the addition of new properties or the addition of new components to `internalComponents`.

Specification:

```js title="components.ts"
import { singleQuote } from '@tarojs/shared'

export const components = {
  // Component Name CamelCase
  ScrollView: 
  // Property 
  {
    // An empty string for value means that no default value is set
    'scroll-left': '',
    // when the default value of the property is a boolean or a number, the value is written as a string
    'enable-flex': 'false',
    'refresher-threshold': '45',
    // When the default value of a property is a string, it needs to be wrapped with the singleQuote function
    'refresher-default-style': singleQuote('black'),
    // Event
    bindRefresherAbort: ''
  }
}
```

#### 3.2 Merge to template.internalComponents

Once you have written `components.ts`, you can merge them with the `mergeComponents` method of the `Template` class instance.

##### template.mergeComponents (ctx, patch)

Merge the component patch to `this.internalComponents`.

| Parameters | Type   | description           |
|:---------- |:------ |:--------------------- |
| ctx        | object | Plugin context object |
| patch      | object | Component patch       |

Example:

```js title="program.ts"
import { components } from './components'

class Weapp extends TaroPlatformBase {
  constructor (ctx, config) {
    super(ctx, config)

    // At the end of the setup phase, modify the template
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

Assuming that the default value of `template.internalComponent` :

```js
internalComponent = {
  ScrollView: {
    'scroll-left': '',
    'enable-flex': 'false',
  }
}
```

The result of the consolidation:

```js
internalComponent = {
  ScrollView: {
    'scroll-left': '',
    // enable-flex defalult value
    'enable-flex': 'true',
    // added  refresher-threshold property
    'refresher-threshold': '45'
  },
  // add  Xyz component
  Xyz: {
    'a': ''
  }
}
```

#### 3.3 Directly modify template.internalComponents

In addition to merging with `template.mergeComponents`, we can also modify `template.internalComponents` directly.

```js title="program.ts"
class Weapp extends TaroPlatformBase {
  modifyTemplate () {
    // Remove some properties from the Slider component
    this.modifySlider(this.template.internalComponents.Slider)
    // Rewrite the property object of the View component
    this.template.internalComponents.View = {}
  }

  modifySlider (slider) {
    delete slider['block-size']
    delete slider['block-color']
  }
}
```

> It is recommended to try to write a copy of `components.ts` for merge, rather than doing it directly.Since the merged component information is also needed at runtime, writing a single copy of `components.ts` can be reused.

#### 3.4 Write components-react.ts

When using React in Taro, the built-in components need to be referenced from `@tarojs/components` before they can be used.

```js
import { View } from '@tarojs/components'
```

But if we **add new built-in components, then we can't fetch them from `@tarojs/components`**.

So when we **add new components**, we need to write a `components-react.ts` and configure the Webpack alias for **React** to reference.

Example:

1. Write `components-react.ts` file

```js title="components-react.ts"
// Original components
export * from '@tarojs/components/mini'
// New components
export const Editor = 'editor'
export const OfficialAccount = 'official-account'
```

2. Set [taroComponentsPath](./platform-plugin-base#optional-tarocomponentspath)

```js title="program.ts"
const PACKAGE_NAME = '@tarojs/plugin-platform-weapp'
class Weapp extends TaroPlatformBase {
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-react`
}
```

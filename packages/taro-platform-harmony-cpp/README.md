# @tarojs/plugin-platform-harmony-cpp

## 快速开始

### 安装和使用

- 安装 harmony 插件

  ```shell
  # 使用 npm 安装
  $ npm i @tarojs/plugin-platform-harmony-cpp
  # 使用 pnpm 安装
  $ pnpm i @tarojs/plugin-platform-harmony-cpp
  ```

- 添加插件配置

  ```ts
  import os from 'os'
  import path from 'path'

  const config = {
    // ...
    plugin: ['@tarojs/plugin-platform-harmony-cpp'],
    harmony: {
      // 当前仅支持使用 Vite 编译鸿蒙应用
      compiler: 'vite',
      // Note: 鸿蒙工程路径，可以参考 [鸿蒙应用创建导读](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/start-with-ets-stage-0000001477980905-V2) 创建
      projectPath: path.join(os.homedir(), 'projects/my-business-project'),
      // Taro 项目编译到对应鸿蒙模块名，默认为 entry
      hapName: 'entry',
    },
    // ...
  }
  ```

### 编译项目

```sh
# 编译鸿蒙应用
$ taro build --type harmony_cpp
# 编译鸿蒙原生组件
$ taro build native-components --type harmony_cpp
```

如果需要编译鸿蒙应用，同时使用编译鸿蒙原生组件，可以在页面配置中添加 `entryOption: false` 表示该页面是组件，同时可以用过 `componentName` 指定组件导出名。

```diff
export default {
  navigationBarTitleText: 'Hello World',
+  componentName: 'MyComponent',
+  entryOption: false,
}
```

## 功能

### 使用公共依赖库

插件默认使用内置版本的公共依赖库，可以通过 useChoreLibrary 配置禁用或者配置指定版本依赖。

```ts
const config = {
  // ...
  plugin: [
    '@tarojs/plugin-platform-harmony-cpp', // useChoreLibrary: 'local'
    // ['@tarojs/plugin-platform-harmony-cpp', { useChoreLibrary: false }],
    // ['@tarojs/plugin-platform-harmony-cpp', { useChoreLibrary: '4.1.0-alpha.0' }],
  ],
  harmony: {
    ohPackage: {
      dependencies: {
        'library': 'file:../library',
      },
    },
  },
  // ...
}
```

插件版本可以通过 `ohPackage.dependencies` 配置或者鸿蒙工程内 `oh-package.json5` 配置覆盖。

### 类型定义

需要在 Taro 项目的 types/global.d.ts 文件夹里添加对插件类型的引用

```ts
/// <reference types="@tarojs/taro" />
/// <reference path="../node_modules/@tarojs/plugin-platform-harmony-cpp/types/define.d.ts" />

```

## 项目集成

Taro 默认支持构建鸿蒙应用，同时也允许开发者灵活扩展功能。你可以在 Taro 项目中使用鸿蒙原生模块，也可以在鸿蒙项目中集成 Taro 模块。

### 在 Taro 中使用鸿蒙原生模块

与 Taro 在其他端类似，可以通过配置 `usingComponents` 来引入鸿蒙原生组件。

```ts
/** index.config.ts */
export default {
  usingComponents: {
    title: './path/to/title-component'
  }
}

/** index.ts */
import { View } from '@tarojs/components'

export default function Index () {
  return <View>
    <title title="Hello World!" />
  </View>
}
```

如果希望使用 Taro 构建的鸿蒙原生组件或者为原生组件提供类型提示，也可以通过 `importNativeComponent` 方法来引入。

```ts
/** title.ts */
import { View } from '@tarojs/components'

definePageConfig({
  entryOption: false,
  componentName: 'Title',
})

export default function Title ({ title = 'Hello World' }) {
  return <View>{title}</View>
}

// importNativeComponent(path, moduleName, componentName)
export const Title = importNativeComponent<typeof import('./title').default>('./title', 'title', 'Title')

/** index.ts */
import { View } from '@tarojs/components'
import { Title } from './title'

export default function Index () {
  return <View>
    <Title title="Hello World!" />
  </View>
}
```

### 在鸿蒙项目中集成 Taro 模块

在鸿蒙项目中可以通过页面或者组件的形式来接入 Taro 模块，但如果不是 Taro 创建的鸿蒙项目需要在入口处添加 Taro 相关的初始化方法：

```ts
import { context, Current } from "@taro-oh/library/src/main/ets/npm/@tarojs/runtime"
import { TaroWindowUtil } from "@taro-oh/library/src/main/ets/npm/@tarojs/runtime"

export default class EntryAbility extends UIAbility {
  ...
  onWindowStageCreate(stage: ohWindow.WindowStage) {
    context.resolver(this.context)
    TaroWindowUtil.setWindowStage(stage)

    stage.loadContent('home_page', (err, data) => {
      const windowClass = stage.getMainWindowSync()
      Current.uiContext = windowClass.getUIContext()
      windowClass.setWindowLayoutFullScreen(true)
    })
  }
}
```

更多配置可以参考项目生成的 `app.ts` 文件改造。

通过页面接入需要在模块配置文件 `module.json5` 中配置 pages 参数，如果是组件模式，可以参考原生 ets 组件方法引入。

```plain
import { Title } from './components/title'

@Builder
function render () {
  Title({
    props: {
      title: 'Hello World!'
    }
  })
}
```

### 定制 Taro 运行时

与其他端类似，开发者同样可以通过继承 HarmonyCPP 实例来修改 Taro 的默认行为，包括新增运行时代码等。

```ts
import { HarmonyCPP } from '@tarojs/plugin-platform-harmony-cpp'

export default class MyTaro extends HarmonyCPP {
  // ...
  constructor () {
    super()
    // ...
    if (typeof this.runtimePath === 'string') {
      this.runtimePath = [this.runtimePath, path.resolve(__dirname, 'my-runtime')]
    }
  }
}
```

> 如果不想构建端应用插件，也可以通过配置 copy 将自定义 ets 代码注入到项目中。

通过注入运行时，开发者可以监听 Taro 抛出的 `__taroPluginEtsMethodsTrigger` 事件，可以通过监听事件实现获取开发用户调用 Taro 方法的参数，或者修改 Taro 的默认行为。

```ts
import { eventCenter } from '@tarojs/runtime'
import { IEtsMethodsOptions } from '@tarojs/plugin-platform-harmony-cpp/dist/runtime/runtime-harmony'

/**
 * interface IEtsMethodsOptions {
 *   methodName?: string
 *   name?: string
 *   scope?: string
 *   type?: string
 *   args?: TaroAny[]
 *   successHandler?: (...args: TaroAny[]) => void
 *   errorHandler?: (...args: TaroAny[]) => void
 *   onInit?: (obj: TaroAny) => void
 * }
 */

eventCenter?.on('__taroPluginEtsMethodsTrigger', (option: IEtsMethodsOptions) => {
  switch (option.scope) {
    case 'route':
      // ...
      break
    default:
      break
  }
})
```

## 常见问题

### **ERROR: Failed to get ModuleInfo properties 'meta.pkgPath'**

本地可能存在部分混淆导致 IDE 无法正确解析依赖，需要检查 `build-profile.json5`、`obfuscation-rules.txt` 等文件中是否开启混淆配置，需要关闭后清理 IDE 缓存重新编译。

```diff
- -enable-property-obfuscation
- -enable-toplevel-obfuscation
- -enable-filename-obfuscation
- -enable-export-obfuscation
```

### **ERROR: Cannot resolved import statement**

本地执行 library 编译时，启用 `useNormalizedOHMUrl` 配置会导致外部依赖无法解析，建议在 library 模块中使用 `useNormalizedOHMUrl: false` 或者移除该配置。

### **ERROR: Duplicated files found in module default**

不使用核心库切换到使用核心库时可能会出现该问题，需要清理 build-profile.json5 文件中关于 so 包的配置项。

```diff
{
  "apiType": "stageMode",
  "buildOption": {
-    "externalNativeOptions": {
-      "path": "./src/main/cpp/CMakeLists.txt",
-      "arguments": "-DCMAKE_JOB_POOL_COMPILE:STRING=compile -DCMAKE_JOB_POOL_LINK:STRING=link -DCMAKE_JOB_POOLS:STRING=compile=8;link=8",
-      "cppFlags": "",
-      "abiFilters": [
-        "arm64-v8a"
-      ]
-    }
  },
  ...
}
```

# @tarojs/plugin-platform-harmony-cpp

## 功能

## 入门指引

### 使用内部插件

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
      compiler: 'vite',
      projectPath: path.join(os.homedir(), 'projects/my-business-module'),
      hapName: 'library',
    },
    // ...
  }
  ```

### 使用公共依赖库

插件默认使用对应版本的公共依赖库，可以通过 useChoreLibrary 配置禁用。

```ts
const config = {
  // ...
  plugin: [
    '@tarojs/plugin-platform-harmony-cpp',
    // ['@tarojs/plugin-platform-harmony-cpp', { useChoreLibrary: false }],
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

## 类型定义

需要在 Taro 项目的 types/global.d.ts 文件夹里添加对插件类型的引用

```ts
/// <reference types="@tarojs/taro" />
/// <reference path="../node_modules/@tarojs/plugin-platform-harmony-cpp/types/define.d.ts" />

```

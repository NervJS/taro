---
title: Single step configuration
---

> The cross-platform code step ability provided by itself `VSCode` can significantly increase the speed of application development based on `Taro` development framework, as other platforms already have more sophisticated tools to use, focusing on reducing the complexity of Windows platform configuration.

## Development of the environment

First prepare `Taro` for basic development under Windows, as follows (existing development can be omitted)：

#### 1. Install Node.js
Recommended installation of `10.15` , official download address：[Node.js](https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi " node.js")

#### 2. Install VSCode

After installing the latest `VSCode` it is recommended to install the following plugins:
-  `ESlint` — code specification
-  `TSlint` — syntax check

#### 3. Taro Source Download

Download address：[Taro](https://github.com/NervJS/taro.git "Taro"), default is `next` branch.

#### Global installation of Node-sass, Lerna and Rollup
```shell
npm i -g node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node_sass/
yarn global add lerna
yarn global add roll
```

:::note Node-sass is more special. It is recommended to install ahead of time to avoid possible anomalous errors. :::

#### 5. Source dependency installation
1. Open `VSCode` Source directory `Taro` in root directory `yarn` , dependencies required for installing projects (please be patient)

2. to `yarn` after execution `yarn run bootstrap` install dependency for subpackage

3.Execute `yarn build` to compile all modules

## One-step debugging

### 1. Configure VSCode debug parameters

:::note launch.json configuration at [VSCode document](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations) :::

在 VSCode 中打开 Taro 源码根目录的 **.vscode** 文件夹，编辑 **launch.json**。

Modify step：

- Modify `cwd` option as target working directory to debug
- Modify `args` for command parameters to debug

```json title="launch.json" {10-16}
{
  // ...
  "configurations": [
    //...
    {
      "type": "node",
      "request": "launch",
      "name": "CLI debug",
      "program": "${workspaceFolder}/packages/taro-cli/bin/taro",
      // "cwd": "${project absolute path}",
      // "args": [
      //   "build",
      //   "--type",
      //   "weapp",
      //   "--watch"
      // ],
      "skipFiles": [
        "<node_internals>/**"
      ]
    }
  ]
}
```

#### Example

##### 1) Debugging taro-build

Assume you need to debug test item `taro build --weapp -watch command`.

Can configure launch.json：

```json title="launch.json"
{
  // ...
  "configurations": [
    //...
    {
      // ...
      "cwd": "/Users/User/Desktop/test",
      "args": [
        "build",
        "--type",
        "weapp",
        "--watch"
      ]
    }
  ]
}
```

##### 2) Debug taro-init

Assume you need to debug `taro init projectName` command.

Can configure launch.json：

```json title="launch.json"
{
  // ...
  "configurations": [
    //...
    {
      // ...
      "cwd": "/Users/User/Desktop",
      "args": [
        "init",
        "projectName"
      ]
    }
  ]
}
```

### Compile subpack

When debugging a subpackage, if you want to be able to debug the revised code, please enter the root directory of the corresponding subpacket to enable watch compilation.

e.g. debugging `@tarojs/mini-runner`in `packages/mini-runner/`, then run under this directory `npm run dev`(each subpackage compilation command may differ, please see **package.json** each subpackage.json).This will allow us to debug the code every time it is modified.

### 3. Link Unpublished Library

If the current subpackage is dependent on other subpackages, link other subpackages to use.[开发环境搭建](./debug-config#一、开发环境搭建) 里介绍的 `yarn run bootstrap` 命令已经为所有子包创建好软连接。

If additional subpackages need to be added as dependencies to the current subpack, they can be executed on the Taro source root directory `lerna add [package] --scope=[target] [--dev]`after which lna will automatically create a soft chain.

e.g. `@tarojs/cli` increase `@tarojs/webpack-runner` as devdependencies：

`lerna add @tarojs/webpack-runner --scope=@tarojs/cli -dev`

Alternatively, if the soft chain is out of work (e.g. `yarn add`executed in subpackage), you can redo the soft link with `lerna link` command.

### 4. Start Debugging

Press the graph to start debugging one step and see VSCode documents for more detailed debugging operations.

![](http://storage.jd.com/cjj-pub-images/WX20200602-221337.png)

:::note Current Taro project subpackage compilation will generate `source-map`so it is generally able to use breakpoints directly at source location.If some packages are compiled without `source-map`, they can be enabled manually and then submitted `Full Requests`. :::

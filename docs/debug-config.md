---
title: 单步调测配置
---

> 通过本身 `VSCode` 提供的跨平台代码单步调测能力，能够极大提升基于 `Taro` 开发框架的应用开发速度，因其他平台已有比较成熟的工具可以使用，着重降低 Windows 平台配置复杂度。

## 一、开发环境搭建

首先准备 `Taro` 在 Windows 下的基础开发环境，详情如下(已有开发环境可略过）：

#### 1. 安装 Node.js
建议安装 `10.15` 以上版本，官方下载地址：[Node.js](https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi " node.js")

#### 2. 安装 VSCode

安装完最新 `VSCode` 后，建议安装如下插件:
-  `ESlint` — 代码规范
-  `TSlint` — 语法检查

#### 3. Taro 源码下载
下载地址：[Taro](https://github.com/NervJS/taro.git "Taro")，默认为 2.x 分支，若要调试 Taro Next，请先撤换到 **next** 分支。

#### 4. 全局安装 Node-sass 、Lerna 和 Rollup
```shell
npm i -g node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node_sass/
yarn global add lerna
yarn global add rollup
```
> Node-sass 比较特殊，建议提前进行安装，规避可能出现的各种异常错误。

#### 5. 源码依赖安装
1.使用 `VSCode` 打开 `Taro` 源码目录，在根目录下执行 `yarn` ，安装项目所需依赖库（首次安装所花时间较长，请耐心等待）

2.待 `yarn` 执行完毕后，执行 `yarn run bootstrap` 为子包安装依赖

3.执行 `yarn build` 编译所有模块

## 二、调试 CLI

#### 1. 配置 VSCode 调试参数

在 VSCode 中打开 Taro 源码根目录的 **.vscode** 文件夹，编辑 **launch.json**。

launch.json 有以下预设配置：

```json
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

修改步骤：

1. 修改 **cwd** 选项为需要调试的目标工作目录
2. 修改 args 为需要调试的命令参数

> launch.json 的详细配置请见 [VSCode 文档](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)

例子：

##### 调试 taro-build

假设需要调试 test 项目的 `taro build --weapp --watch` 命令。

可以这样配置 launch.json：

```json
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

##### 调试 taro-init

假设需要调试 `taro init projectName` 命令。

可以这样配置 launch.json：

```json
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

#### 2. 编译子包

调试某一个子包时，如果希望能调试修改后的代码，请先进入对应子包的根目录开启 watch 模式编译。

例如调试 `@tarojs/mini-runner`，先进入 `packages/mini-runner/`，然后在此目录下对运行 `npm run dev`（各子包编译命令可能有所不同，详情请见各子包的 **package.json**）。这样我们就能对每次修改后的代码进行调试。

#### 3.链接未发布的库

如果当前开发的子包依赖于其它子包，可以把其它子包 link 过来使用。[开发环境搭建](./debug-config#开发环境搭建) 里介绍的 `yarn run bootstrap` 命令已经为所有子包创建好软连接。

如果需要为当前子包增加其它子包作为依赖，可以在 Taro 源码根目录执行 `lerna add [package] --scope=[target] [--dev]`，之后 lerna 会自动创建好软链。

例如为 `@tarojs/cli` 增加 `@tarojs/webpack-runner` 作为 devdependencies：

`lerna add @tarojs/webpack-runner --scope=@tarojs/cli --dev`

另外如果软链失效了（例如在子包里执行了 `yarn add`），可以使用 `lerna link` 命令重新进行软链。

#### 4.启动调试

按下图操作即可开始单步调试，详细调试操作可参考 VSCode 文档。

![](http://storage.jd.com/cjj-pub-images/WX20200602-221337.png)

> 目前 Taro 项目的子包一般编译都会产生 `source-map`，所以一般都能够直接在源码位置使用断点。如果某些包编译时没有开启 `source-map`，可手动开启然后提交 `Pull Requests`。

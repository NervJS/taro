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
下载地址：[Taro](https://github.com/NervJS/taro.git "Taro")，默认为 2.x 分支，如有需要，请切换到开发分支

#### 4. 全局安装 Node-sass 、Lerna 和 Rollup
```shell
npm i -g node-sass --sass_binary site=https://npm.taobao.org/mirrors/node_sass/
yarn global add lerna
yarn global add rollup
```
> Node-sass 比较特殊，建议提前进行安装，规避可能出现的各种异常错误。

#### 5. 源码依赖安装
1.使用 `VSCode` 打开 `Taro` 源码目录，在根目录下执行 `yarn` ，安装项目所需依赖库（首次安装所花时间较长，请耐心等待）

2.待 `yarn` 执行完毕后，执行 `yarn bootstrap` 解析子包之间的依赖关系

## 二、单步调试配置

#### 1. 拷贝测试项目
进入 `taro cli` 目录，将需要调试的测试项目拷贝至根目录，以测试项目命名 `test` 为例

#### 2. 在测试项目中添加 `js` 入口
进入测试项目根目录，新增 `debug.js` 调试入口文件，文件内容如下：
```javascript
const Builder = require('../dist/build').default
const appPath = process.cwd()
const builder = new Builder(appPath)

builder.build({
	type: 'weapp',
	watch: 'watch'
  })
```
> 调试入口文件名可自定义设置

#### 3. 增加 VSCode 调试参数配置
打开 `taro cli` 所在 Windows 文件夹，进入目录下的 `.vscode` 子目录，在 `lanuch.json` 文件中新增调试入口参数，设置如下：
```shell
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "name": "debug.js",
            "request": "launch",
            "sourceMaps": true,
            "args": [
                "--runInBand",
                "-r",
                "ts-node/register"
            ],
            "cwd": "${workspaceFolder}/packages/taro-cli/debug",
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
            "program": "${workspaceFolder}/packages/taro-cli/test/debug.js"
        }
    ]
}
```
> 若 `.vscode` 目录或 `lanuch.json` 文件不存在，需手动创建；同时 `name` 、`cwd` 、`program` 三个参数根据测试项目的实际名称、目录进行调整

#### 2. 编译子包
在 `node.js` 调试过程中只能调用 `js` 文件，调试过程所依赖的 `taro` 子模块，需要进入子模块根目录，执行编译命令，将 `ts` 代码编译打包成 `js` 代码之后，才能进行调试，主要编译如下关键子包：

| 模块名称  | 功能描述  | 编译方式 |
| :------------ |:---------------:| -----:|
| taro-cli      | Taro开发工具转换总入口 | yarn dev |
| taroize      | Taro小程序编译器，主要负责小程序转Taro        |   yarn dev |
| taro-mini-runner | Taro编译时，webpack插件化管理打包任务        |    yarn dev |
| taro-transformer-wx | Taro解析模块，解析AST目录树        |    yarn dev |

#### 3.链接未发布的库
为了测试代码更改效果，或依赖未正式发布的包，可通过软链接的方式，将最新代码链接到测试目录下进行测试，同时保持子模块的 `watch` 状态，可以实时更新修改代码，此处以 `taro-mini-runner` 举例：

1.首先进入 `taro-mini-runner` 根目录，执行 `yarn link` 命令

2.进入测试项目 `test` 的根目录，执行 `Debug and Run` ， `yarn link taro-mini-runner` 命令进行软链接

#### 4.启动调试
在编译后的 `js` 文件中打断点，在 `VSCode` 左侧按钮列表中，选择启动调试 `Debug and Run` 按钮，在出现的选择框列表中，选择需要启动的测试项目，启动调试，即可开始单步调试。
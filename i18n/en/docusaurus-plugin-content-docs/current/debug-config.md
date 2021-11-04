---
title: Single-step Debugging Configuration

---

> With the cross-platform code single-step debugging capability provided by `VSCode`, we can greatly improve the speed of application development based on the `Taro` development framework, and focus on reducing the complexity of configuration for Windows platform as more mature tools are already available for other platforms.

## 一、Development Environment Setup

First, prepare the basic development environment for `Taro` on Windows, as follows (existing development environments can be skipped).

#### 1. Install Node.js
It is recommended to install `10.15` or above,  download [Node.js](https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi " node.js")

#### 2. Install VSCode

After installing the latest `VSCode`, it is recommended to install the following plugins:
- `ESlint` - Code Specification
- `TSlint` - syntax checking

#### 3. Taro Source Code Download
Download: [Taro](https://github.com/NervJS/taro.git "Taro"), Default is 2.x branch, if you want to debug Taro Next, please switch to **next** branch first.

#### 4. Global installation of Node-sass, Lerna and Rollup
```shell
npm i -g node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node_sass/
yarn global add lerna
yarn global add rollup
```
>  It is recommended to install Node-sass in advance to circumvent any possible abnormal errors.

#### 5. Source code Dependency Installation
1.Use `VSCode` to open the `Taro` source directory, and execute `yarn` in the root directory to install the dependencies required for the project (the first installation will take a long time, please be patient)

2.After `yarn` finishes executing, run `yarn run bootstrap` to install dependencies for the subpackages

3.Run `yarn build` to compile all modules

## 二、CLI Debugging

#### 1. Configure VSCode Debugging Parameters

Open the **.vscode** folder in the root of the Taro source code in VSCode and edit **launch.json**.

The launch.json has the following preset configuration.

```json title="launch.json"
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

Modification steps:

1. modify **cwd** option to be the target working directory to be debugged
2. modify args to be the parameter of the command to be debugged

> The detailed configuration of launch.json can be found in [VSCode Documentation](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)

Example：

##### taro-build Debugging

Suppose you need to debug the `taro build --weapp --watch` command for the test project.

You can configure launch.json like this.

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

#####  taro-init Debugging

Suppose you need to debug the `taro init projectName` command for the test project.

You can configure launch.json like this:

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

#### 2. Compiling Subpackages

When debugging a subpackage, if you want to debug the modified code, go to the root of the corresponding subpackage and turn on watch mode compilation.

For example, to debug `@tarojs/mini-runner`, first go to `packages/mini-runner/`, and then run `npm run dev` in this directory (the compile command may vary by subpackage, see the **package.json** of each subpackage for details). This will allow us to debug the code after each change.

#### 3.Links to unpublished libraries

If the currently developed subpackage depends on other subpackages, you can link the other subpackages to use them. The `yarn run bootstrap` command introduced in [Development Environment Setup](./debug-config#开发环境搭建) already creates soft connections for all subpackages.

If you need to add other subpackages as dependencies for the current subpackage, you can execute `lerna add [package] --scope=[target] [--dev]` in the Taro source root, after which lerna will automatically create the soft chain.

example：  `@tarojs/cli` add `@tarojs/webpack-runner` as devdependencies：

`lerna add @tarojs/webpack-runner --scope=@tarojs/cli --dev`

Alternatively, if the softlink fails (e.g. `yarn add` is executed in a subpackage), you can use the `lerna link` command to softlink again.

#### 4.Start up debugging

You can start single-step debugging by following the diagram below, please refer to VSCode documentation for detailed debugging operation.

![](https://storage.jd.com/cjj-pub-images/WX20200602-221337.png)

> Currently, subpackages of the Taro project are generally compiled with `source-map`, so it is usually possible to use breakpoints directly in the source code location. If some packages are not compiled with `source-map` enabled, you can enable it manually and submit `Pull Requests`.

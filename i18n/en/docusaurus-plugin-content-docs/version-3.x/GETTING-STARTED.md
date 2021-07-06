---
title: Installation and Usage
---

## Installation

Taro project is based on node, please make sure you have a newer node environment (>=12.0.0), we recommend using the node version management tool [nvm](https://github.com/creationix/nvm) to manage node, so you can not only switch node versions easily, but also no need to add sudo when installing globally. and you don't need to add sudo when installing globally.

### CLI Tools Installation

First, you need to install `@tarojs/cli` globally using npm or yarn, or just use [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b):

```bash
# Use npm to install CLI
$ npm install -g @tarojs/cli

# OR Use yarn to install CLI
$ yarn global add @tarojs/cli

# OR installed cnpm, use cnpm to install CLI
$ cnpm install -g @tarojs/cli
```

:::caution Attention
If the installation process results in `sass`-related installation errors, please retry after installing [mirror-config-china](https://www.npmjs.com/package/mirror-config-china).

```bash
$ npm install -g mirror-config-china
```
:::

#### View all Taro releases

You can use `npm info` to see the Taro version information, where you can see the current latest version

```bash
npm info @tarojs/cli
```

![npm info @tarojs/cli screenshot](https://img13.360buyimg.com/ling/jfs/t1/144770/7/20011/138415/5fe40491Ed0883578/11236962a3e672db.png)

If you are using beta or canary you can see the latest version in the line below `dist-tags:`.

## Project initialization

Create a template project using the command.

```bash
$ taro init myApp
```

npm 5.2+ can also be used to create template projects using npx without a global installation: npx

```bash
$ npx @tarojs/cli init myApp
```

![taro init myApp command screenshot](https://img30.360buyimg.com/ling/jfs/t1/121270/15/15083/672721/5f89357dEf36b7fe2/ecb98df1436cd3d5.jpg)

After creating the project, Taro will start installing the dependencies required by the project by default, using tools in the order of yarn > cnpm > npm. Generally, the dependency installation will succeed, but in some cases the installation may fail, in which case you can install it yourself in the project directory using the install command.

```bash
# Go to the project folder
$ cd myApp

# Use yarn to install dependencies
$ yarn

# OR Use cnpm to install dependencies
$ cnpm install

# OR Use npm to install dependencies
$ npm install
```

## Compiling and Running

Using the Taro `build` command compile Taro code into different platform code, and then  check the effect in the corresponding development tool.

Taro has `dev` and `build` modes：

- **dev mode (add --watch parameter)）** Listens for file modifications
- **build mode (delete --watch parameter)** Compress and package code without listening to file changes.
- dev mode generates large files, you can set the environment variable `NODE_ENV` to `production` to turn on compression for easy preview, but the compilation speed will be reduced.

### Wechat Mini-Program

#### Compile command

```bash
# yarn
$ yarn dev:weapp
$ yarn build:weapp

# npm script
$ npm run dev:weapp
$ npm run build:weapp

# global installation only
$ taro build --type weapp --watch
$ taro build --type weapp

# npx users can also use 
$ npx taro build --type weapp --watch
$ npx taro build --type weapp

# watch mode enables compression
$ set NODE_ENV=production && taro build --type weapp --watch # Windows
$ NODE_ENV=production taro build --type weapp --watch # Mac
```

#### Developer Tools

Download and open [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，, then select **Project Directory** for preview.

Developers need to pay attention to the project settings of the developer tools：
  * Need to set off ES6 to ES5 function,turn on may lead to error
  * Need to set off the style auto-completion when uploading code, turn on may lead to error
  * Need to set off the code compression upload, turn on may lead to error

### Baidu smart program

#### Compile command

```bash
# yarn
$ yarn dev:swan
$ yarn build:swan

# npm script
$ npm run dev:swan
$ npm run build:swan

# global installation only
$ taro build --type swan --watch
$ taro build --type swan

# npx users can also use 
$ npx taro build --type swan --watch
$ npx taro build --type swan

# watch mode enables compression
$ set NODE_ENV=production && taro build --type swan --watch # Windows
$ NODE_ENV=production taro build --type swan --watch # Mac
```

#### Developer Tools

Download and open [Baidu Developer Tools](https://smartprogram.baidu.com/docs/develop/devtools/show_sur/), and make sure you have set up the mini-program project configuration [project.swan.json](./project-config). Then select the `dist` directory in the project root directory to preview it.

Developers need to pay attention to the project settings of the developer tools：
  * Need to set off ES6 to ES5 function,turn on may lead to error
  * Need to set off the style auto-completion when uploading code, turn on may lead to error
  * Need to set off the code compression upload, turn on may lead to error

### Alipay Mini-Program

#### Compile command

```bash
# yarn
$ yarn dev:alipay
$ yarn build:alipay

# npm script
$ npm run dev:alipay
$ npm run build:alipay

# global installation only
$ taro build --type alipay --watch
$ taro build --type alipay

# npx users can also use 
$ npx taro build --type alipay --watch
$ npx taro build --type alipay

# watch mode enables compression
$ set NODE_ENV=production && taro build --type alipay --watch # Windows
$ NODE_ENV=production taro build --type alipay --watch # Mac
```

#### Developer Tools

Download and open [Alipay Developer Tools](https://docs.alipay.com/mini/developer/getting-started/), Then select the `dist` directory in the project root directory to preview it.

Developers need to pay attention to the project settings of the developer tools：
  * Need to set off ES6 to ES5 function,turn on may lead to error
  * Need to set off the style auto-completion when uploading code, turn on may lead to error
  * Need to set off the code compression upload, turn on may lead to error

### ByteDance Mini-Program

#### Compile command

```bash
# yarn
$ yarn dev:tt
$ yarn build:tt

# npm script
$ npm run dev:tt
$ npm run build:tt

# global installation only
$ taro build --type tt --watch
$ taro build --type tt

# npx users can also use 
$ npx taro build --type tt --watch
$ npx taro build --type tt

# watch mode enables compression
$ set NODE_ENV=production && taro build --type tt --watch # Windows
$ NODE_ENV=production taro build --type tt --watch # Mac
```

####  Developer Tools

Download and open [ByteDance Developer Tools](https://microapp.bytedance.com/docs/devtool/versionUpdate.html)，, and make sure you have set up the mini-program project configuration [project.tt.json](./project-config). Then select the `dist` directory in the project root directory to preview it.

Developers need to pay attention to the project settings of the developer tools：
  * Need to set off ES6 to ES5 function,turn on may lead to error
  * Need to set off the style auto-completion when uploading code, turn on may lead to error
  * Need to set off the code compression upload, turn on may lead to error

### QQ Mini-Program

#### Compile command

```bash
# yarn
$ yarn dev:qq
$ yarn build:qq

# npm script
$ npm run dev:qq
$ npm run build:qq

# global installation only
$ taro build --type qq --watch
$ taro build --type qq

# npx users can also use 
$ npx taro build --type qq --watch
$ npx taro build --type qq

# watch mode enables compression
$ set NODE_ENV=production && taro build --type qq --watch # Windows
$ NODE_ENV=production taro build --type qq --watch # Mac
```

#### Developer Tools

Download and open [QQ Mini-Program Developer Tools ](https://q.qq.com/wiki/#_4-%E7%BC%96%E7%A0%81%E5%BC%80%E5%8F%91%E5%B0%8F%E7%A8%8B%E5%BA%8F)，and then select the `dist` directory in the project root directory to preview it.

Developers need to pay attention to the project settings of the developer tools：
  * Need to set off ES6 to ES5 function,turn on may lead to error
  * Need to set off the style auto-completion when uploading code, turn on may lead to error
  * Need to set off the code compression upload, turn on may lead to error

### Jingdong Mini-program

#### Compile command

```bash
# yarn
$ yarn dev:jd
$ yarn build:jd

# npm script
$ npm run dev:jd
$ npm run build:jd

# global installation only
$ taro build --type jd --watch
$ taro build --type jd

# npx users can also use 
$ npx taro build --type jd --watch
$ npx taro build --type jd

# watch mode enables compression
$ set NODE_ENV=production && taro build --type jd --watch # Windows
$ NODE_ENV=production taro build --type jd --watch # Mac
```

#### Developer Tools

Download and open Jingdong mini-program Developer Tools（Go to https://mp.jd.com to register and you will be provided with developer tools upon successful application）, and then select the `dist` directory in the project root directory to preview it.

Developers need to pay attention to the project settings of the developer tools：
  * Need to set off ES6 to ES5 function,turn on may lead to error
  * Need to set off the style auto-completion when uploading code, turn on may lead to error
  * Need to set off the code compression upload, turn on may lead to error

#### Jingdong Mini-program related reading

- [《使用 Taro 快速开发京东小程序》](/blog/2020-04-27-taro-build-jd)
- [《京东小程序 Taro 开发对比原生开发测评》](/blog/2020-04-27-taro-vs-jd)

### Enterprise WeChat Mini-program

The Taro plugin can support compiling enterprise WeChat Mini-program. [Github](https://github.com/NervJS/taro-plugin-platform-weapp-qy)。

#### Installing Plugins

```bash
yarn add @tarojs/plugin-platform-weapp-qy
```

#### Configuration Plugin

```js title="Taro Project Configuration"
config = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-weapp-qy'
  ]
}
```

#### Compile command

```bash
# yarn
$ yarn dev:qywx
$ yarn build:qywx

# npm script
$ npm run dev:qywx
$ npm run build:qywx

# global installation only
$ taro build --type qywx --watch
$ taro build --type qywx

# npx users can also use 
$ npx taro build --type qywx --watch
$ npx taro build --type qywx

# watch mode enables compression
$ set NODE_ENV=production && taro build --type qywx --watch # Windows
$ NODE_ENV=production taro build --type qywx --watch # Mac
```

#### Developer Tools

Same as WeChat mini-program. The compile mode of developer tool is set to Enterprise WeChat.

### DingTalk Mini Program

The Taro plugin can support compiling pinned dingtalk mini-program. Plugin documentation can be found at [Github](https://github.com/NervJS/taro-plugin-platform-alipay-dd)。

#### Installing Plugins

```bash
yarn add @tarojs/plugin-platform-alipay-dd
```

#### Configuration Plugin

```js title="Taro Project Configuration"
config = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-alipay-dd'
  ]
}
```

#### Compile Command

```bash
# yarn
$ yarn dev:dd
$ yarn build:dd

# npm script
$ npm run dev:dd
$ npm run build:dd

# global installation only
$ taro build --type dd --watch
$ taro build --type dd

# npx users can also use 
$ npx taro build --type dd --watch
$ npx taro build --type dd

# watch mode enables compression
$ set NODE_ENV=production && taro build --type dd --watch # Windows
$ NODE_ENV=production taro build --type dd --watch # Mac
```

#### Developer Tools

Same as Alipay mini-program. The compile mode of developer tool is set to DingTalk.

### Alipay IOT Mini-Program

The Taro plugin supports compiling Alipay IOT Mini-Program, Plugin documentation can be found at [Github](https://github.com/NervJS/taro-plugin-platform-alipay-iot)。

#### Installing Plugins

```bash
yarn add @tarojs/plugin-platform-alipay-iot
```

#### Configuration Plugin

```js title="Taro Project Configuration"
config = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-alipay-iot'
  ]
}
```

#### Compile Command

```bash
# yarn
$ yarn dev:iot
$ yarn build:iot

# npm script
$ npm run dev:iot
$ npm run build:iot

# global installation only
$ taro build --type iot --watch
$ taro build --type iot

# npx users can also use
$ npx taro build --type iot --watch
$ npx taro build --type iot

# watch mode enables compression
$ set NODE_ENV=production && taro build --type iot --watch # Windows
$ NODE_ENV=production taro build --type iot --watch # Mac
```

#### Developer Tools

Same as Alipay mini-program. The compile mode of developer tool is set to IOT mini-program.

### H5

#### Compile Command

```bash
# yarn
$ yarn dev:h5
$ yarn build:h5

# npm script
$ npm run dev:h5
$ npm run build:h5

# global installation only
$ taro build --type h5 --watch
$ taro build --type h5

# npx users can also use
$ npx taro build --type h5 --watch
$ npx taro build --type h5
```

### React Native

Please refer to [React Native Development Process](./react-native)

## Progressive Introduction Tutorial

我们提供了一个由浅入深的实战教程，请参考[《guide》](./guide)。

## Common Problems

### Keep the version of the CLI consistent with the dependency version

在使用 Taro 进行多端开发中，请保持 Taro CLI 的版本与你项目的依赖版本一致，否则可能会出现编译错误或者运行时错误。

如果发现不一致的情况可以使用 Taro 升级命令 taro update self [版本号] 和 taro update project [版本号]来分别将 CLI 和项目依赖升级到指定版本；
或者也可以手动安装相应版本 CLI，修改 package.json 依赖版本号，然后重装依赖来解决。

```bash
# 使用Taro 升级命令更新CLI版本到最新版本
$ taro update self [版本号]
# 使用Taro 升级命令更新CLI版本到指定版本
$ taro update self
# 使用Taro 升级命令将项目依赖升级到与@tarojs/cli一致的版本
$ taro update project 
# 使用Taro 升级命令将项目依赖升级到指定版本
$ taro update project [版本号]
```
如果你所使用的 Taro CLI 版本为 3.0.9，而项目里使用的依赖版本为 3.0.10，则有可能会出现问题，这时请将你的 Taro CLI 版本更新至项目依赖版本号相同的版本，如果还是出现问题，请向我们提出 [Issue](https://nervjs.github.io/taro-issue-helper/)。

### Taro 多版本共存问题

很多开发者曾经使用 Taro 旧版本开发过项目，已经在全局安装了 Taro，但是想同时体验到 Taro 3，应该如何进行操作？

我们提供了两种思路：

- 如果是需要新创建 Taro 3 项目，可以使用 [nvm](https://github.com/nvm-sh/nvm) 来管理 node 版本，通过安装不同 node 版本来安装不同版本的 Taro CLI，从而解决 Taro 多版本共存的问题
- 如果是部分已有项目需要升级到 Taro 3，可以在这些项目本地安装相应版本的 Taro CLI，这样通过 `yarn` 或者 `npm` 执行命令的话就会直接使用本地安装的 Taro CLI，安装方式 `yarn add @tarojs/cli`

### 回到某个版本

需要安装某个固定版本，或者回到某个版本，例如我们要安装 `1.3.9` ， 则如下：

```bash
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli@1.3.9
# OR 使用 yarn 安装 CLI
$ yarn global add @tarojs/cli@1.3.9
# OR 安装了 cnpm，使用 cnpm 安装 CLI
$ cnpm install -g @tarojs/cli@1.3.9
```

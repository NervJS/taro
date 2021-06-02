---
title: 安装及使用
---

## 安装

Taro 项目基于 node，请确保已具备较新的 node 环境（>=12.0.0），推荐使用 node 版本管理工具 [nvm](https://github.com/creationix/nvm) 来管理 node，这样不仅可以很方便地切换 node 版本，而且全局安装时候也不用加 sudo 了。

### CLI 工具安装

首先，你需要使用 npm 或者 yarn 全局安装 `@tarojs/cli`，或者直接使用 [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b):

```bash
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli

# OR 使用 yarn 安装 CLI
$ yarn global add @tarojs/cli

# OR 安装了 cnpm，使用 cnpm 安装 CLI
$ cnpm install -g @tarojs/cli
```

:::caution 请注意
值得一提的是，如果安装过程出现`sass`相关的安装错误，请在安装 [mirror-config-china](https://www.npmjs.com/package/mirror-config-china) 后重试。

```bash
$ npm install -g mirror-config-china
```
:::

#### 查看 Taro 全部版本信息

可以使用 `npm info` 查看 Taro 版本信息，在这里你可以看到当前最新版本

```bash
npm info @tarojs/cli
```

![npm info @tarojs/cli screenshot](https://img13.360buyimg.com/ling/jfs/t1/144770/7/20011/138415/5fe40491Ed0883578/11236962a3e672db.png)

由图第 1 行可知最新版本，如果你用的是 beta 或者 canary 你可以通过 `dist-tags:` 下面那行看到最新的版本。

## 项目初始化

使用命令创建模板项目：

```bash
$ taro init myApp
```

npm 5.2+ 也可在不全局安装的情况下使用 npx 创建模板项目：

```bash
$ npx @tarojs/cli init myApp
```

![taro init myApp command screenshot](https://img30.360buyimg.com/ling/jfs/t1/121270/15/15083/672721/5f89357dEf36b7fe2/ecb98df1436cd3d5.jpg)

在创建完项目之后，Taro 会默认开始安装项目所需要的依赖，安装使用的工具按照 yarn > cnpm > npm 顺序进行检测。一般来说，依赖安装会比较顺利，但某些情况下可能会安装失败，这时候你可以在项目目录下自己使用安装命令进行安装：

```bash
# 进入项目根目录
$ cd myApp

# 使用 yarn 安装依赖
$ yarn

# OR 使用 cnpm 安装依赖
$ cnpm install

# OR 使用 npm 安装依赖
$ npm install
```

## 编译运行

使用 Taro 的 `build` 命令可以把 Taro 代码编译成不同端的代码，然后在对应的开发工具中查看效果。

Taro 编译分为 `dev` 和 `build` 模式：

- **dev 模式（增加 --watch 参数）** 将会监听文件修改。
- **build 模式（去掉 --watch 参数）** 将不会监听文件修改，并会对代码进行压缩打包。
- dev 模式生成的文件较大，设置环境变量 `NODE_ENV` 为 `production` 可以开启压缩，方便预览，但编译速度会下降。

### 微信小程序

#### 编译命令

```bash
# yarn
$ yarn dev:weapp
$ yarn build:weapp

# npm script
$ npm run dev:weapp
$ npm run build:weapp

# 仅限全局安装
$ taro build --type weapp --watch
$ taro build --type weapp

# npx 用户也可以使用
$ npx taro build --type weapp --watch
$ npx taro build --type weapp

# watch 同时开启压缩
$ set NODE_ENV=production && taro build --type weapp --watch # Windows
$ NODE_ENV=production taro build --type weapp --watch # Mac
```

#### 小程序开发者工具

下载并打开[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，然后选择**项目根目录**进行预览。

需要注意开发者工具的项目设置：
  * 需要设置关闭 ES6 转 ES5 功能，开启可能报错
  * 需要设置关闭上传代码时样式自动补全，开启可能报错
  * 需要设置关闭代码压缩上传，开启可能报错

### 百度小程序

#### 编译命令

```bash
# yarn
$ yarn dev:swan
$ yarn build:swan

# npm script
$ npm run dev:swan
$ npm run build:swan

# 仅限全局安装
$ taro build --type swan --watch
$ taro build --type swan

# npx 用户也可以使用
$ npx taro build --type swan --watch
$ npx taro build --type swan

# watch 同时开启压缩
$ set NODE_ENV=production && taro build --type swan --watch # Windows
$ NODE_ENV=production taro build --type swan --watch # Mac
```

#### 小程序开发者工具

下载并打开[百度开发者工具](https://smartprogram.baidu.com/docs/develop/devtools/show_sur/)，并确保已经设置了小程序项目配置文件 [project.swan.json](./project-config)。然后选择项目根目录下 `dist` 目录（根目录 `config` 中的 `outputRoot` 设置的目录）进行预览。

需要注意开发者工具的项目设置：
  * 需要关闭 ES6 转 ES5 功能，开启可能报错
  * 需要关闭上传代码时样式自动补全，开启可能报错
  * 需要关闭代码压缩上传，开启可能报错

### 支付宝小程序

#### 编译命令

```bash
# yarn
$ yarn dev:alipay
$ yarn build:alipay

# npm script
$ npm run dev:alipay
$ npm run build:alipay

# 仅限全局安装
$ taro build --type alipay --watch
$ taro build --type alipay

# npx 用户也可以使用
$ npx taro build --type alipay --watch
$ npx taro build --type alipay

# watch 同时开启压缩
$ set NODE_ENV=production && taro build --type alipay --watch # Windows
$ NODE_ENV=production taro build --type alipay --watch # Mac
```

#### 小程序开发者工具

下载并打开[支付宝小程序开发者工具](https://docs.alipay.com/mini/developer/getting-started/)，然后选择项目根目录下 `dist` 目录（根目录 `config` 中的 `outputRoot` 设置的目录）进行预览。

需要注意开发者工具的项目设置：
  * 需要关闭 ES6 转 ES5 功能，开启可能报错
  * 需要关闭上传代码时样式自动补全，开启可能报错
  * 需要关闭代码压缩上传，开启可能报错

### 字节跳动小程序

#### 编译命令

```bash
# yarn
$ yarn dev:tt
$ yarn build:tt

# npm script
$ npm run dev:tt
$ npm run build:tt

# 仅限全局安装
$ taro build --type tt --watch
$ taro build --type tt

# npx 用户也可以使用
$ npx taro build --type tt --watch
$ npx taro build --type tt

# watch 同时开启压缩
$ set NODE_ENV=production && taro build --type tt --watch # Windows
$ NODE_ENV=production taro build --type tt --watch # Mac
```

#### 小程序开发者工具

下载并打开[字节跳动小程序开发者工具](https://microapp.bytedance.com/docs/devtool/versionUpdate.html)，并确保已经设置了小程序项目配置文件 [project.tt.json](./project-config)。然后选择项目根目录下 `dist` 目录（根目录 `config` 中的 `outputRoot` 设置的目录）进行预览。

需要注意开发者工具的项目设置：
  * 需要关闭 ES6 转 ES5 功能，开启可能报错
  * 需要关闭上传代码时样式自动补全，开启可能报错
  * 需要关闭代码压缩上传，开启可能报错

### QQ 小程序

#### 编译命令

```bash
# yarn
$ yarn dev:qq
$ yarn build:qq

# npm script
$ npm run dev:qq
$ npm run build:qq

# 仅限全局安装
$ taro build --type qq --watch
$ taro build --type qq

# npx 用户也可以使用
$ npx taro build --type qq --watch
$ npx taro build --type qq

# watch 同时开启压缩
$ set NODE_ENV=production && taro build --type qq --watch # Windows
$ NODE_ENV=production taro build --type qq --watch # Mac
```

#### 小程序开发者工具

下载并打开 [QQ 小程序开发者工具](https://q.qq.com/wiki/#_4-%E7%BC%96%E7%A0%81%E5%BC%80%E5%8F%91%E5%B0%8F%E7%A8%8B%E5%BA%8F)，然后选择项目根目录下 `dist` 目录（根目录 `config` 中的 `outputRoot` 设置的目录）进行预览。

需要注意开发者工具的项目设置：
  * 需要关闭 ES6 转 ES5 功能，开启可能报错
  * 需要关闭上传代码时样式自动补全，开启可能报错
  * 需要关闭代码压缩上传，开启可能报错

### 京东小程序

#### 编译命令

```bash
# yarn
$ yarn dev:jd
$ yarn build:jd

# npm script
$ npm run dev:jd
$ npm run build:jd

# 仅限全局安装
$ taro build --type jd --watch
$ taro build --type jd

# npx 用户也可以使用
$ npx taro build --type jd --watch
$ npx taro build --type jd

# watch 同时开启压缩
$ set NODE_ENV=production && taro build --type jd --watch # Windows
$ NODE_ENV=production taro build --type jd --watch # Mac
```

#### 小程序开发者工具

下载并打开京东小程序开发者工具（前往https://mp.jd.com 注册，申请成功后将会获得开发者工具），然后选择项目根目录下 `dist` 目录（根目录 `config` 中的 `outputRoot` 设置的目录）进行预览。

需要注意开发者工具的项目设置：
  * 需要关闭 ES6 转 ES5 功能，开启可能报错
  * 需要关闭上传代码时样式自动补全，开启可能报错
  * 需要关闭代码压缩上传，开启可能报错

#### 京东小程序相关阅读

- [《使用 Taro 快速开发京东小程序》](/blog/2020-04-27-taro-build-jd)
- [《京东小程序 Taro 开发对比原生开发测评》](/blog/2020-04-27-taro-vs-jd)

### 企业微信小程序

> Taro v3.1+ 开始支持

使用 Taro 插件能支持编译企业微信小程序，插件文档请看 [Github](https://github.com/NervJS/taro-plugin-platform-weapp-qy)。

#### 安装插件

```bash
yarn add @tarojs/plugin-platform-weapp-qy
```

#### 配置插件

```js title="Taro 项目配置"
config = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-weapp-qy'
  ]
}
```

#### 编译命令

```bash
# yarn
$ yarn dev:qywx
$ yarn build:qywx

# npm script
$ npm run dev:qywx
$ npm run build:qywx

# 仅限全局安装
$ taro build --type qywx --watch
$ taro build --type qywx

# npx 用户也可以使用
$ npx taro build --type qywx --watch
$ npx taro build --type qywx

# watch 同时开启压缩
$ set NODE_ENV=production && taro build --type qywx --watch # Windows
$ NODE_ENV=production taro build --type qywx --watch # Mac
```

#### 小程序开发者工具

同微信小程序。开发者工具的编译模式设置为企业微信。

### 钉钉小程序

> Taro v3.1+ 开始支持

使用 Taro 插件能支持编译钉钉小程序，插件文档请看 [Github](https://github.com/NervJS/taro-plugin-platform-alipay-dd)。

#### 安装插件

```bash
yarn add @tarojs/plugin-platform-alipay-dd
```

#### 配置插件

```js title="Taro 项目配置"
config = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-alipay-dd'
  ]
}
```

#### 编译命令

```bash
# yarn
$ yarn dev:dd
$ yarn build:dd

# npm script
$ npm run dev:dd
$ npm run build:dd

# 仅限全局安装
$ taro build --type dd --watch
$ taro build --type dd

# npx 用户也可以使用
$ npx taro build --type dd --watch
$ npx taro build --type dd

# watch 同时开启压缩
$ set NODE_ENV=production && taro build --type dd --watch # Windows
$ NODE_ENV=production taro build --type dd --watch # Mac
```

#### 小程序开发者工具

同支付宝小程序。开发者工具的编译模式设置为钉钉。

### 支付宝 IOT 小程序

> Taro v3.1+ 开始支持

使用 Taro 插件能支持编译支付宝 IOT 小程序，插件文档请看 [Github](https://github.com/NervJS/taro-plugin-platform-alipay-iot)。

#### 安装插件

```bash
yarn add @tarojs/plugin-platform-alipay-iot
```

#### 配置插件

```js title="Taro 项目配置"
config = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-alipay-iot'
  ]
}
```

#### 编译命令

```bash
# yarn
$ yarn dev:iot
$ yarn build:iot

# npm script
$ npm run dev:iot
$ npm run build:iot

# 仅限全局安装
$ taro build --type iot --watch
$ taro build --type iot

# npx 用户也可以使用
$ npx taro build --type iot --watch
$ npx taro build --type iot

# watch 同时开启压缩
$ set NODE_ENV=production && taro build --type iot --watch # Windows
$ NODE_ENV=production taro build --type iot --watch # Mac
```

#### 小程序开发者工具

同支付宝小程序。开发者工具的编译模式设置为 IOT 小程序。

### H5

#### 编译命令

```bash
# yarn
$ yarn dev:h5
$ yarn build:h5

# npm script
$ npm run dev:h5
$ npm run build:h5

# 仅限全局安装
$ taro build --type h5 --watch
$ taro build --type h5

# npx 用户也可以使用
$ npx taro build --type h5 --watch
$ npx taro build --type h5
```

### React Native

> Taro v3.2+ 开始支持

请参考 [React Native 端开发流程](./react-native)

## 渐进式入门教程

我们提供了一个由浅入深的实战教程，请参考[《教程》](./guide)。

## 常见问题

### 保持 CLI 的版本与各端依赖版本一致

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

---
title: 安装及使用
---

## 安装

Taro 项目基于 node，请确保已具备较新的 node 环境（>=8.0.0），推荐使用 node 版本管理工具 [nvm](https://github.com/creationix/nvm) 来管理 node，这样不仅可以很方便地切换 node 版本，而且全局安装时候也不用加 sudo 了。

### CLI 工具安装

首先，你需要使用 npm 或者 yarn 全局安装`@tarojs/cli`，或者直接使用[npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b):

```bash
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli@next
# OR 使用 yarn 安装 CLI
$ yarn global add @tarojs/cli@next
# OR 安装了 cnpm，使用 cnpm 安装 CLI
$ cnpm install -g @tarojs/cli@next
```
### 注意事项

值得一提的是，如果安装过程出现`sass`相关的安装错误，请在安装[`mirror-config-china`](https://www.npmjs.com/package/mirror-config-china)后重试。

```bash
$ npm install -g mirror-config-china
```

## 项目初始化

使用命令创建模板项目

```bash
$ taro init myApp
```

npm 5.2+ 也可在不全局安装的情况下使用 npx 创建模板项目

```bash
$ npx @tarojs/cli init myApp
```

![taro init myApp command screenshot](https://ww1.sinaimg.cn/large/49320207gy1g0u2e0uf8gj20vg0uw10f.jpg)

在创建完项目之后，Taro 会默认开始安装项目所需要的依赖，安装使用的工具按照 yarn>cnpm>npm 顺序进行检测，一般来说，依赖安装会比较顺利，但某些情况下可能会安装失败，这时候你可以在项目目录下自己使用安装命令进行安装

```bash
# 使用 yarn 安装依赖
$ yarn
# OR 使用 cnpm 安装依赖
$ cnpm install
# OR 使用 npm 安装依赖
$ npm install
```

进入项目目录开始开发，目前已经支持 微信/百度/支付宝/字节跳动/QQ 小程序、H5、快应用以及 ReactNative 等端的代码转换，针对不同端的启动以及预览、打包方式并不一致

## 运行
Taro 需要运行不同的命令，将 Taro 代码编译成不同端的代码，然后在对应的开发工具中查看效果。

![image](https://storage.360buyimg.com/taro-resource/platforms.jpg)

### 微信小程序

选择微信小程序模式，需要自行下载并打开[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，然后选择项目根目录进行预览。

微信小程序编译预览及打包（去掉 --watch 将不会监听文件修改，并会对代码进行压缩打包）

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
```

### 百度小程序

选择百度小程序模式，需要自行下载并打开[百度开发者工具](https://smartprogram.baidu.com/docs/develop/devtools/show_sur/)，然后在项目编译完后选择项目根目录下 `dist` 目录进行预览。

百度小程序编译预览及打包（去掉 --watch 将不会监听文件修改，并会对代码进行压缩打包）

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
```

### 支付宝小程序

选择支付宝小程序模式，需要自行下载并打开[支付宝小程序开发者工具](https://docs.alipay.com/mini/developer/getting-started/)，然后在项目编译完后选择项目根目录下 `dist` 目录进行预览。

支付宝小程序编译预览及打包（去掉 --watch 将不会监听文件修改，并会对代码进行压缩打包）

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
```

### 字节跳动小程序

选择字节跳动小程序模式，需要自行下载并打开[字节跳动小程序开发者工具](https://microapp.bytedance.com/docs/devtool/versionUpdate.html)，然后在项目编译完后选择项目根目录下 `dist` 目录进行预览。

字节跳动小程序编译预览及打包（去掉 --watch 将不会监听文件修改，并会对代码进行压缩打包）

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
```

### QQ 小程序

选择 QQ 小程序模式，需要自行下载并打开[QQ 小程序开发者工具](https://q.qq.com/wiki/#_4-%E7%BC%96%E7%A0%81%E5%BC%80%E5%8F%91%E5%B0%8F%E7%A8%8B%E5%BA%8F)，然后在项目编译完后选择项目根目录下 `dist` 目录进行预览。

QQ 小程序编译预览及打包（去掉 --watch 将不会监听文件修改，并会对代码进行压缩打包）

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
```

## 常用 CLI 命令

### 查看 Taro 所有命令及帮助

```bash
$ taro --help
```

### 环境及依赖检测

Taro 提供了命令来一键检测 Taro 环境及依赖的版本等信息，方便大家查看项目的环境及依赖，排查环境问题。在提 issue 的时候，请附上 `taro info` 打印的信息，帮助开发人员快速定位问题。

```bash
$ taro info
👽 Taro v1.2.0-beta.15


  Taro CLI 1.2.0-beta.15 environment info:
    System:
      OS: macOS High Sierra 10.13.5
      Shell: 5.3 - /bin/zsh
    Binaries:
      Node: 8.11.2 - /usr/local/bin/node
      Yarn: 1.8.0 - /usr/local/bin/yarn
      npm: 5.6.0 - /usr/local/bin/npm
    npmPackages:
      @tarojs/components: ^1.2.0-beta.3 => 1.2.0-beta.3
      @tarojs/plugin-babel: ^1.2.0-beta.3 => 1.2.0-beta.3
      @tarojs/plugin-csso: ^1.2.0-beta.3 => 1.2.0-beta.3
      @tarojs/plugin-sass: ^1.2.0-beta.4 => 1.2.0-beta.4
      @tarojs/plugin-uglifyjs: ^1.2.0-beta.3 => 1.2.0-beta.3
      @tarojs/rn-runner: ^1.2.0-beta.4 => 1.2.0-beta.4
      @tarojs/router: ^1.2.0-beta.3 => 1.2.0-beta.3
      @tarojs/taro: ^1.2.0-beta.3 => 1.2.0-beta.3
      @tarojs/taro-alipay: ^1.2.0-beta.3 => 1.2.0-beta.3
      @tarojs/taro-h5: ^1.2.0-beta.3 => 1.2.0-beta.3
      @tarojs/taro-swan: ^1.2.0-beta.3 => 1.2.0-beta.3
      @tarojs/taro-weapp: ^1.2.0-beta.3 => 1.2.0-beta.3
      @tarojs/webpack-runner: ^1.2.0-beta.3 => 1.2.0-beta.3
      eslint-config-taro: ^1.2.0-beta.3 => 1.2.0-beta.3
      eslint-plugin-taro: ^1.2.0-beta.3 => 1.2.0-beta.3
```

### Taro Doctor

Taro Doctor 就像一个医生一样，可以诊断项目的依赖、设置、结构，以及代码的规范是否存在问题，并尝试给出解决方案。

但和真正的医生不一样，Taro Doctor 不需要排队挂号，也不用花钱。你只需要在终端运行命令：`taro doctor`，就像图里一样：

![Taro Doctor 诊断结果图](https://img10.360buyimg.com/ling/jfs/t1/46613/36/5573/202581/5d357d14E6f0df7e1/fc026be7dc69dcf2.png)

### 快速创建新页面

Taro create --name [页面名称] 能够在当前项目的pages目录下快速生成新的页面文件，并填充基础代码，是一个提高开发效率的利器。

### CLI 配置

> 自 `1.3.9` 开始支持

`1.3.9` 开始 Taro 会在用户根目录下创建 .taro 文件夹，其中 .taro/index.json 用于存放 CLI 相关配置。

开发者可以使用 `taro config` 命令对配置项进行一系列操作：

```bash
# 查看用法
$ taro config --help
# 设置配置项<key>的值为<value>
$ taro config set <key> <value>
# 读取配置项<key>
$ taro config get <key>
# 删除配置项<key>
$ taro config delete <key>
# 打印所有配置项
$ taro config list [--json]
```

## 其他常见问题

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

### 保持 `@tarojs/cli` 的版本与各端依赖版本一致

在使用 Taro 进行多端开发中，请保持 Taro CLI 的版本与你项目的依赖版本一致，否则可能会出现编译错误或者运行时错误。

如果你所使用的 Taro CLI 版本为 1.3.9，而项目里使用的依赖版本为 1.3.20，则有可能会出现问题，这时请将你的 Taro CLI 版本更新至项目依赖版本号相同的版本，如果还是出现问题，请向我们提出 [Issue](https://github.com/NervJS/taro/issues/new?assignees=&labels=&template=bug_report.md&title=)。

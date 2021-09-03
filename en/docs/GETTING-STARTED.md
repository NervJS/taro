---
title: Install and use
---

## Install

The Taro project is based on node, make sure there is a newer node environment (>=12.0.0.0), use node version administration is recommended [nvm](https://github.com/creationix/nvm) to manage node, so that node is not only easily switched to node, but is not installed globally.

### CLI Tool Installation

首先，你需要使用 npm 或者 yarn 全局安装 `@tarojs/cli`，或者直接使用 [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b):

```bash
# Install CLI using npm to use CLI
$ npm install -g @tarojs/cli

# OR install CLI using yarn to install CLI
$yarn global add @tarojs/cli

# OR installed cnpm, Install CLI with cnpm
$ cnpm install -g @tarojs/cli
```

::caution please note to mention that if the installation process shows`sass`associated installation errors, please try again after installation [mirror-config-china](https://www.npmjs.com/package/mirror-config-china).

```bash
$ npm install -g mirror-config-china
```
:::

#### View all versions of Taro

You can access Taro version information using `npm info` where you can see the latest version

```bash
npm info @tarojs/cli
```

![npm info @tarojs/cli screenshot](https://img13.360buyimg.com/ling/jfs/t1/144770/7/20011/138415/5fe40491Ed0883578/11236962a3e672db.png)

The latest version is available in line 1 of the figure, if you are using beta or canary you can see the latest version through `distanced tags:` below the line.

## Project initialization

Create template item using command：

```bash
$ taro init myApp
```

npm 5.2+ 也可在不全局安装的情况下使用 npx 创建模板项目：

```bash
$ npx @tarojs/cli init myApp
```

![taro init myApp command screen](https://img30.360buyimg.com/ling/jfs/t1/121270/15/15083/672721/5f89357dEf36b7fe2/ecb98df1436cd3d5.jpg)

When creating a project, Taro will default to start installing the dependencies needed to install the project. The tools used will be checked in yarn > cnpm > npm order.一般来说，依赖安装会比较顺利，但某些情况下可能会安装失败，这时候你可以在项目目录下自己使用安装命令进行安装：

```bash
# Enter project root
$ cd myApp

# Installing dependencies with yarn
$ yarn

# OR install dependencies with cnpm installation
$ cnpm install

# OR install dependency with npm installation
$ npm install
```

## Build Running

Use the Taro `build` command to compile Taro code into different ends and see effects in the corresponding development tool.

Taro compiles into `dev` and `build` mode：

- **dev mode (add --watch parameter)** will listen for changes to files.
- **build mode (remove --watch parameter)** will not listen to changes and will compress the code.
- A large file is generated in dev mode and set the environment variable `NODE_ENV` to `production` to enable compression, facilitate preview, but compile speed declines.

### Micromessage applet

#### Compilation commands

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

#### Applet Developer Tools

Download and open[MicroMessage Developer Tool](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)and select**Project Root Root**for preview.

Attention needs to be paid to project settings for developer tools：
  * Require ES6 to turn ES5 off
  * Require autocomplete when closing the upload code. Enable may be wrong
  * Require shutdown code compression to be uploaded. Enable possible misstatements

### Bracket applet

#### Compilation commands

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

#### Applet Developer Tools

Download and open[100 developer tool](https://smartprogram.baidu.com/docs/develop/devtools/show_sur/)and make sure that the applet project profile [project.swan.json](./project-config) has been set up.Then select the directory `dist` on the root of the project (directory at root `config` in `outputRoot` set) for preview.

Attention needs to be paid to project settings for developer tools：
  * Requires ES6 to turn ES5 off
  * Autocomplete when uploading code is required. Enable may be wrong
  * Require closing code for upload. Enable possible reporting errors

### PayPal applet

#### Compilation commands

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

#### Applet Developer Tools

下载并打开[支付宝小程序开发者工具](https://docs.alipay.com/mini/developer/getting-started/)，然后选择项目根目录下 `dist` 目录（根目录 `config` 中的 `outputRoot` 设置的目录）进行预览。

Attention needs to be paid to project settings for developer tools：
  * Requires ES6 to turn ES5 off
  * Autocomplete when uploading code is required. Enable may be wrong
  * Require closing code for upload. Enable possible reporting errors

### Byte jump applet

#### Compilation commands

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

#### Applet Developer Tools

Download and open[byte jump applet developer tool](https://microapp.bytedance.com/docs/devtool/versionUpdate.html)and make sure that the applet project profile [project.tt.json](./project-config) has been set up.Then select the directory `dist` on the root of the project (directory at root `config` in `outputRoot` set) for preview.

Attention needs to be paid to project settings for developer tools：
  * Requires ES6 to turn ES5 off
  * Autocomplete when uploading code is required. Enable may be wrong
  * Require closing code for upload. Enable possible reporting errors

### QQ applet

#### Compilation commands

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

#### Applet Developer Tools

下载并打开 [QQ 小程序开发者工具](https://q.qq.com/wiki/#_4-%E7%BC%96%E7%A0%81%E5%BC%80%E5%8F%91%E5%B0%8F%E7%A8%8B%E5%BA%8F)，然后选择项目根目录下 `dist` 目录（根目录 `config` 中的 `outputRoot` 设置的目录）进行预览。

Attention needs to be paid to project settings for developer tools：
  * Requires ES6 to turn ES5 off
  * Autocomplete when uploading code is required. Enable may be wrong
  * Require closing code for upload. Enable possible reporting errors

### Gydong applet

#### Compilation commands

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

#### Applet Developer Tools

Download and open the gadget developer tool (go to https://mp.jd.com to register, apply successfully and get the developer tool), then select the directory `dist` on the root of the project (directory at root `config` at `outputRoot` settings) for preview.

Attention needs to be paid to project settings for developer tools：
  * Requires ES6 to turn ES5 off
  * Autocomplete when uploading code is required. Enable may be wrong
  * Require closing code for upload. Enable possible reporting errors

#### Chingong Applet Reading

- [Use Taro for Quick Development of the Gingodon](/blog/2020-04-27-taro-build-jd)
- [Taro Development Comparisons for Development](/blog/2020-04-27-taro-vs-jd)

### Business Microletter Applet

> Taro v3.1+ Start Support

Using a Taro plugin to support the compilation of business micromessaging, plugin documentation can be found at [Github](https://github.com/NervJS/taro-plugin-platform-weapp-qy).

#### Install Plugins

```bash
yarn add @tarojs/plugin-platform-weapp-qy
```

#### Configure Plugins

```js title="Taro 项目配置"
config =
  // ...
  plugins: [
    '@tarojs/plugin-platform-weapp-qy'
  ]
}
```

#### Compilation commands

```bash
# yarn
$ yarn dev:qywx
$ yarn build:qywx

# npm script
$ npm run dev:qywx
$ npm run build:qywx

# Only global installation
$ taro build --type qywx -wire
$ taro build --type qywx

# npx users can also use
$ npx taro build --type qywx --watch
$ npx taro build --type qywx -wire

# Care simultaneously compress
$ set NODE_ENV=production && taro build --type qywx --watch # Window
$ NODE_ENV=reduction taro build --type -type qywx --watch
```

#### Applet Developer Tools

Same micromessaging app.The compiler mode of the developer tool is set to enterprise micromessages.

### Studded Applet

> Taro v3.1+ Start Support

Using Taro plugin to support the compilation of pegged applets, see [Github](https://github.com/NervJS/taro-plugin-platform-alipay-dd).

#### Install Plugins

```bash
yarn add @tarojs/plugin-platform-alipay-dd
```

#### Configure Plugins

```js title="Taro 项目配置"
config = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-alipay-dd'
  ]
}
```

#### Compilation commands

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

#### Applet Developer Tools

Same as PayPal app.The compiler mode of the developer tool is set to nail.

### PayPal IOT applet

> Taro v3.1+ Start Support

Using a Taro plugin to support the compilation of PayPal IOT applets, see [Github](https://github.com/NervJS/taro-plugin-platform-alipay-iot).

#### Install Plugins

```bash
yarn add @tarojs/plugin-platform-alipay-iot
```

#### Configure Plugins

```js title="Taro 项目配置"
config = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-alipay-iot'
  ]
}
```

#### Compilation commands

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

#### Applet Developer Tools

Same as PayPal app.Developer tool compilation mode is set to IOT applet.

### Flight Applet

> Taro v3.1+ Start Support

Using a Taro plugin to support the compilation of Flight Books applets, see [Github](https://github.com/NervJS/taro-plugin-platform-lark).

#### Install Plugins

```bash
yarn add @tarojs/plugin-platform-lark
```

#### Configure Plugins

```js title="Taro 项目配置"
config = LO
  // ...
  plugins: [
    '@tarojs/plugin-platform-lark'
  ]
}
```

#### Compilation commands

```bash
# yarn
$ yarn dev:lark
$ yarn build:lark

# npm script
$ npm run dev:lark
$ npm run build:lark

# 仅限全局安装
$ taro build --type lark --watch
$ taro build --type lark

# npx 用户也可以使用
$ npx taro build --type lark --watch
$ npx taro build --type lark

# watch 同时开启压缩
$ set NODE_ENV=production && taro build --type lark --watch # Windows
$ NODE_ENV=production taro build --type lark --watch # Mac
```

#### Applet Developer Tools
[Bottom-book applets](https://open.feishu.cn/document/uYjL24iN/uMjNzUjLzYzM14yM2MTN)can run on the airbook client and a set of codes that run multiple-end (including PC and mobile ends).You need to download and open the[Bottle Developer Tool](https://open.feishu.cn/document/uYjL24iN/ucDOzYjL3gzM24yN4MjN)and make sure that the applet project profile has been set.Then select the project root directory `dist` for preview.

Attention needs to be paid to project configuration of developer tools
- Requires ES6 to turn ES5 off
- Autocomplete when uploading code is required. Enable may be wrong
- Require closing code for upload. Enable possible reporting errors

### Quick Applet

使用 Taro 插件能支持编译快手小程序，插件文档请看 [Github](https://github.com/NervJS/taro-plugin-platform-kwai)。

#### Version Requirements

##### Taro 3.3+

Please use [taro-plugin-plate-kwai version of](https://github.com/NervJS/taro-plugin-platform-kwai) or more.

##### Taro 3.2

Please use version 1.2.x of [taro-plugin-plate](https://github.com/vadxq/taro-plugin-platform-ks).

##### Taro 3.0 - 3.1

Please use version 1.0.x of [taro-plugin-plate](https://github.com/vadxq/taro-plugin-platform-ks).

#### Install Plugins

```bash
yarn add @tarojs/plugin-platform-kwai
```

#### Configure Plugins

```js title="Taro 项目配置"
config =
  // ...
  plugins: [
    '@tarojs/plugin-platform-kwai'
  ]
}
```

#### Compilation commands

```bash
# yarn
$ yarn dev:kwai
$ yarn build:kwai

# npm script
$ npm run dev:kwai
$ npm run build:kwai

# Only global installation
$ taro build --type kwai -wire
$ taro build --type kwai

# npx users can also use
$ npx taro build --type kwai --watch
$ npx taro build --type kwai --wiki

# Cat the same time compression
set NODE_ENV=production && taro build --type kwai -wai -watch # Windows
$ NODE_ENV=protoy build -type kwai -watch # Mac
```

#### Applet Developer Tools

下载并打开[快手小程序开发者工具](https://mp.kuaishou.com/docs/develop/guide/introduction.html)，然后选择项目根目录下 `dist` 目录（根目录 `config` 中的 `outputRoot` 设置的目录）进行预览。

### H5

#### Compilation commands

```bash
# yarn
$ yarn dev:h5
$ yarn build:h5

# npm script
$ npm run dev:h5
$ npm run build:h5

# Only globally installed
$ taro build --type h5 --watch
$ taro build --type h5

# npx users can also use
$ npx taro build -type h5 --watch )
$ npx taro build --type h5 --watch
```

### React Native

> Taro v3.2+ Start Support

Reference [React Native Development Process](./react-native)

## Progressive introductory tutorials

We have provided a tutorial on the ground from shallow to depth. See[Tutorial](./guide).

## FAQ

### Keep CLI versions consistent with dependencies at all ends

For multi-end development using Taro, keep the Taro CLI version consistent with your project's dependent version, otherwise there may be compilation errors or running errors.

If an inconsistency is found, use Taro Upgrade Command taro Update self [版本号] and taro Update project [版本号]to upgrade the CLI and project dependency to the specified version, respectively; or can also manually install the corresponding CLI, modify package.json dependency number, then reinstall the dependency.

```bash
# Update CLI version to the latest version using Taro Update command
$ taro Update Self [版本号]
# Update CLI version to the specified version with Taro Update Command
$ taro Update Self
# Upgrade project dependency to @tarojs/clients using Taro Update Command
$ taro Update project 
# Upgrade project dependency with Taro Upgrade Command
$ taro Update project [版本号]
```
There may be a problem if you are using Taro CLI version 3.0.9 while the project uses a dependency version 3.0.10, please update your Taro CLI version to the same version of the project's dependency number. If there is still a problem, ask us [Issue](https://nervjs.github.io/taro-issue-helper/).

### Taro multi-version coexisting

Many developers have developed projects with old versions of Taro and have installed Taro on a global scale, but want to experience Taro 3, how should they operate?

We provided two ideas：

- 如果是需要新创建 Taro 3 项目，可以使用 [nvm](https://github.com/nvm-sh/nvm) 来管理 node 版本，通过安装不同 node 版本来安装不同版本的 Taro CLI，从而解决 Taro 多版本共存的问题
- If some of the existing projects need to be upgraded to Taro 3, the corresponding Taro CLI can be installed locally, so using `yarn` or `npm` the local installed Taro CLI, installation method `yarn add @tarojs/cli`

### Back to a version

A fixed version needs to be installed or returned to a version such as `1.3.9` , below：

```bash
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli@1.3.9
# OR 使用 yarn 安装 CLI
$ yarn global add @tarojs/cli@1.3.9
# OR 安装了 cnpm，使用 cnpm 安装 CLI
$ cnpm install -g @tarojs/cli@1.3.9
```

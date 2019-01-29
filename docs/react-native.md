---
title: React Native 端开发流程
---

> 本篇主要讲解 Taro React Native 端 环境安装-开发-调试-打包-发布 原理及流程，React Native 开发前注意事项请看 [开发前注意](https://nervjs.github.io/taro/docs/before-dev-remind.html)

## 简介
Taro RN 端的开发基于开源项目 [Expo](https://expo.io/)，类似于 [create-react-native-app](https://github.com/react-community/create-react-native-app)。

### Expo 简介
> Expo is a set of tools, libraries and services which let you build native iOS and Android apps by writing JavaScript.

Expo 是一组工具，库和服务，基于 React Native 可让您通过编写 JavaScript 来构建原生 iOS 和 Android 应用程序。

Expo 应用程序是包含 Expo SDK 的 React Native 应用程序。 SDK 是一个 native-and-JS 库，可以访问设备的系统功能（如相机，联系人，本地存储和其他硬件）。这意味着您不需要使用 Xcode 或 Android Studio，也不需要编写任何本机代码，而且它还使得您的 pure-JS 项目非常便于携带，因为它可以在任何包含 Expo SDK 的本机环境中运行，方便开发及调试。

最后，你可以使用 Expo 托管应用，它可以为您提供推送通知，并且可以构建能部署到应用商店 ipa 包或者 apk 包。

更多资料，可以查看 [Expo 官方文档](https://docs.expo.io/versions/latest/)。

> [Expo 版本清单](https://expo.io/--/api/v2/versions)，这里可以看到每个版本 Expo 对应的版本关系，这很重要。

### 为什么选择 Expo？
从某种程度上而言，目前为止 RN 只是给拥有 Mac 电脑的开发者提供了跨平台开发的能力， 因为现在还不能使用 Windows 创建 iOS 的 RN 应用。还有一个比较普遍的问题是，有一些 iOS 程序员不会配置 Android 的编译环境，而一些 Android 程序员又搞不懂 XCode。而且，Taro 的使用者基本都是前端工程师，面对 iOS 和 Android 原生的库或者文件可能会不知所措。

我们希望 Taro 的使用者，即使完全没有 RN 开发经验，也能够从配环境开始 5 分钟实现 Hello World 的编写，并且只需要专注于基于 Taro 实现功能，不用再去配置烦人的 iOS、Android 编译环境，还可以用 Windows 开发 iOS 版的 RN 应用。而恰好 Expo 可以完美实现。

本质上，Expo 的移动客户端相当于一个壳，你只需关注 js 层面的开发即可。这点类似于 electron 或者小程序。

## 准备工作

#### iOS 模拟器

通过 Apple App Store 安装 [Xcode](https://itunes.apple.com/app/xcode/id497799835)。这会需要一段时间，去小睡一下。接下来，打开 Xcode，转到 首选项（preferences） 并单击 Components 选项卡，从列表中安装一个模拟器。

首次启动模拟器可能需要手动在模拟器上安装 Expo 客户端，

您可以按照以下步骤操作：

- 下载最新的模拟器构建。
- 提取存档的内容。你应该得到一个像 `Exponent-X.XX.X` 这样的目录。
- 确保模拟器正在运行。
- 在终端上，运行 `xcrun simctl install booted [提取目录的路径]`。

![image](https://user-images.githubusercontent.com/9441951/44649246-e6eb1000-aa15-11e8-849e-f4bc17eeccab.png)

#### Android 模拟器

[下载 Genymotion](https://www.genymotion.com/fun-zone/)（免费版）并按照 [Genymotion 安装指南](https://docs.genymotion.com/Content/01_Get_Started/Installation.htm)。安装 Genymotion 后，创建一个虚拟设备，准备好后启动虚拟设备。

如果遇到任何问题，请按照 Genymotion 指南进行操作。

#### 移动客户端：Expo (适用于 iOS 和 Android)

在模拟器或真机上安装 [Expo 客户端 v2.9.2](https://www.apkmonk.com/app/host.exp.exponent/)。

expo 客户端就像是一个用 expo 建造的应用程序浏览器。当您在项目中启动时，**它会为您生成一个开发地址及对应的二维码，您可以在 iOS 或 Android 上使用 expo 客户端上访问它**，无论是使用真机上还是模拟器，原理和步骤都相同。

[Android Play Store 下载地址 ( 或者直接从各大应用商店搜索 )](https://play.google.com/store/apps/details?id=host.exp.exponent) 

 [iOS App Store 下载地址](https://itunes.com/apps/exponent)

> **版本支持:** Android 4.4 及以上、 iOS 9.0 及以上

更多资料可以查看 [Expo 移动客户端文档](https://docs.expo.io/versions/v29.0.0/workflow/up-and-running)

#### 看守者(Watchman)

如果一些 macOS 用户没有在他们的机器上安装它，会遇到问题，因此我们建议您安装 Watchman。 Watchman 在更改时观察文件和记录，然后触发相应的操作，并由 React Native 在内部使用。[下载并安装 Watchman](https://facebook.github.io/watchman/docs/install.html)。

## 开发

### 编译

RN 编译预览模式:

```shell
# npm script
$ npm run dev:rn
# 仅限全局安装
$ taro build --type rn --watch
# npx 用户也可以使用
$ npx taro build --type rn --watch
```

Taro 将会开始编译文件：

```shell
➜  TodoMVC git:(master) ✗ taro build --type rn --watch
👽 Taro v1.0.0-beta.15

开始编译项目 todo-list
编译  JS        /Users/chengshuai/Taro/TodoMVC/src/app.js
编译  SCSS      /Users/chengshuai/Taro/TodoMVC/src/app.scss
编译  JS        /Users/chengshuai/Taro/TodoMVC/src/actions/index.js
....
生成  app.json  /Users/chengshuai/Taro/TodoMVC/.temp/app.json
生成  package.json  /Users/chengshuai/Taro/TodoMVC/.temp/package.json
拷贝  crna-entry.js  /Users/chengshuai/Taro/TodoMVC/.temp/bin/crna-entry.js
编译  编译完成，花费 780 ms
17:12:59: Starting packager...

初始化完毕，监听文件修改中...
```

生成的应用文件在根目录的 `.rn_temp`目录下，常见的工程目录结构如下：

```
./.rn_temp
├── components
│   ├── Footer
│   ├── TodoItem
│   └── TodoTextInput
├── pages
│   └── index
│       ├── index.js
│       └── index.scss
├── node_modules
├── app.js
├── app_styles.js
├── app.json
├── README.md
├── package.json
└── yarn.lock
```

> **Note:** If you are on MacOS and XDE gets stuck on "Waiting for packager and tunnel to start", you may need to [install watchman on your machine](https://facebook.github.io/watchman/docs/install.html#build-install). The easiest way to do this is with [Homebrew](http://brew.sh/), `brew install watchman`.

### 启动
如果编译过程没有报错，`Packager Started` 后，你将会看到以下内容：

![image](https://user-images.githubusercontent.com/9441951/45069323-89824d80-b0fe-11e8-86ae-2bbe532087de.png)

接下来，你可以直接在终端输入对应的字母，来进行对应的操作：

- a : 打开安卓设备或安卓模拟器
- i  : 打开 iOS 模拟器
- s : 发送 app URL 到手机号或 email 地址
- q : 显示二维码
- r : 重启 packager
- R : 重启 packager 并清空缓存
- d : 开启 development 模式

如果你使用真机，你只需要使用 Expo 应用扫描这个二维码就可以打开你编写的 RN 应用了。并且只要在 Expo 中打开过一次，就会在 App 中保留一个入口。

本质上，Expo 相当于一个壳，你只需关注 js 层面的开发即可。这点类似于 electron 或者小程序。

如果你在终端按下 `i`· ，Taro 将会自动启动 iOS 模拟器，启动 expo 客户端（如果已成功安装），然后加载应用。

![image](https://user-images.githubusercontent.com/497214/28835171-300a12b6-76ed-11e7-81b2-623639c3b8f6.png)

终端将会显示日志：

```shell
17:43:54: Starting iOS...

 › Press a to open Android device or emulator, or i to open iOS emulator.
 › Press s to send the app URL to your phone number or email address
 › Press q to display QR code.
 › Press r to restart packager, or R to restart packager and clear cache.
 › Press d to toggle development mode. (current mode: development)

17:44:05: Finished building JavaScript bundle in 492ms
```

反之，如果你在终端按下`a`，可能会出现如下错误：

![image](https://user-images.githubusercontent.com/9441951/49937712-9b9c3500-ff12-11e8-91f4-f48251973ce1.png)

这个时候你需要手动启动安卓模拟器，然后再次按下 `a`。

如果 expo 客户端自动安装失败（由于众所周知的原因，这个概率还挺大），终端可能会报以下错误：

![image](https://user-images.githubusercontent.com/9441951/49936425-eae06680-ff0e-11e8-9597-8035101c2ba0.png)

你需要下载 [expo 客户端 v2.9.2](https://www.apkmonk.com/app/host.exp.exponent/)，拖拽进模拟器安装（或使用 `adb install XXX.apk`）的命令安装，然后再次按下 `a`，你就能看到应用的界面了。


### 开发者菜单

一旦 app 在 expo 中成功打开，你可以通过摇一摇设备来唤起开发者菜单， 如果你是用模拟器，你可以按 `⌘+d` （iOS） 或 `ctrl+m` （Android）。

![image](https://docs.expo.io/static/images/generated/v29.0.0/workflow/developer-menu.png)

更多资料可以查看[Expo 文档——up-and-running](https://docs.expo.io/versions/v29.0.0/workflow/up-and-running)。

## 调试

### 简介

调试方面强烈推荐使用 [React Native Debugger ](https://github.com/jhen0409/react-native-debugger)，一个基于 React Native 官方调试方式、包含 React Inspector / Redux DevTools 独立应用：

- 基于官方的 [Remote Debugger](https://facebook.github.io/react-native/docs/debugging.html#chrome-developer-tools) 且提供了更为丰富的功能
- 包含 [`react-devtools-core`](https://github.com/facebook/react-devtools/tree/master/packages/react-devtools-core) 的 [React Inspector](https://github.com/jhen0409/react-native-debugger/blob/master/docs/react-devtools-integration.md)
- 包含 Redux DevTools, 且与 [`redux-devtools-extension`](https://github.com/zalmoxisus/redux-devtools-extension) 保持 [API](https://github.com/jhen0409/react-native-debugger/blob/master/docs/redux-devtools-integration.md) 一致

![image](https://user-images.githubusercontent.com/3001525/29451479-6621bf1a-83c8-11e7-8ebb-b4e98b1af91c.png)

可以查看文章 [React Native Debugger + Expo = AWESOME](https://medium.com/@jimgbest/react-native-debugger-expo-awesome-d7a00da51460)，了解更多。

### 安装

不同平台及版本的安装包，请点击 [这里](https://github.com/jhen0409/react-native-debugger/releases) 。

**macOS**平台可以使用 [Homebrew Cask](https://caskroom.github.io/) 安装：

```shell
$ brew update && brew cask install react-native-debugger
```

### 启动

在启动 React Native Debugger 之前，请先确认以下内容：

- 所有的 React Native 的 debugger 客户端已关闭，特别是 `http://localhost:<port>/debugger-ui`
- React Native Debugger 会尝试连接 debugger 代理， expo 默认使用 `19001` 端口， 你可以新建一个 debugger 窗口 (macOS: `Command+T`, Linux/Windows: `Ctrl+T`) 开定义端口
- 保证 [developer menu](https://facebook.github.io/react-native/docs/debugging.html#accessing-the-in-app-developer-menu)  的  `Debug JS Remotely` 处于开启状态

你可以启动应用之后再修改端口，也可以直接通过命令行启动应用时指定端口：

```shell
open "rndebugger://set-debugger-loc?host=localhost&port=19001"
```

>  如果启动之后调试窗口空白，请确认调试端口正确。

### 使用 Redux DevTools Extension API

Use the same API as [`redux-devtools-extension`](https://github.com/zalmoxisus/redux-devtools-extension#1-with-redux) is very simple:

```jsx
const store = createStore(
  reducer, /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
```

See [`Redux DevTools Integration`](https://github.com/jhen0409/react-native-debugger/blob/master/docs/redux-devtools-integration.md) section for more information.

### 更多资料

- [快速开始](https://github.com/jhen0409/react-native-debugger/blob/master/docs/getting-started.md)
- [Debugger 整合](https://github.com/jhen0409/react-native-debugger/blob/master/docs/debugger-integration.md)
- [React DevTools 整合](https://github.com/jhen0409/react-native-debugger/blob/master/docs/react-devtools-integration.md)
- [Redux DevTools 整合](https://github.com/jhen0409/react-native-debugger/blob/master/docs/redux-devtools-integration.md)
- [Shortcut references](https://github.com/jhen0409/react-native-debugger/blob/master/docs/shortcut-references.md)
- [Network inspect of Chrome Developer Tools](https://github.com/jhen0409/react-native-debugger/blob/master/docs/network-inspect-of-chrome-devtools.md)
- [Enable open in editor in console](https://github.com/jhen0409/react-native-debugger/blob/master/docs/enable-open-in-editor-in-console.md)
- [Troubleshooting](https://github.com/jhen0409/react-native-debugger/blob/master/docs/troubleshooting.md)
- [Contributing](https://github.com/jhen0409/react-native-debugger/blob/master/docs/contributing.md)

## 构建独立应用程序

> 下面的文档是使用 Expo 的线上服务来帮助你构建独立应用程序，使用这种方式可以避免在本机上配置应用构建环境。当然，你也可以使用自己的电脑构建应用，文档请参考：[Building Standalone Apps on Your CI](https://docs.expo.io/versions/v31.0.0/distribution/turtle-cli)

如何愉快地打包发布，可能你还在头疼安卓的签名、难缠的 gradle 和各种配置，还在头疼 iOS 打包发布时在 Xcode 来回折腾，为什么不能脱离这些原生开发才需要的步骤呢，ReactNative 本身就是为了统一安卓和 iOS，如今到打包这一步却要区别对待，颇为不妥，expo 就是个很好的解决方案，它提供壳子，我们只需要关心我们自己的代码，然后放进壳里即可。

接下来的步骤将会帮助你为 iOS 和 Android 创建 Expo 应用程序的独立二进制文件，并将其提交到 Apple App Store 和 Google Play Store。

构建iOS独立应用程序需要Apple Developer帐户，但构建Android独立应用程序不需要Google Play Developer帐户。如果您想要提交到任一应用商店，您将需要该商店的开发者帐户。

在打包发布步骤之前，我们先对开发者的源代码进行预处理，将 Taro 代码转成 React Native 代码：

``` bash
taro build --type rn
```
然后 .rn_temp 目录 （如果你没有修改）下会生成转换后的 React Native 代码。

### 安装Expo CLI
Expo CLI 是开发和构建 Expo 应用程序的工具，运行 `npm install -g expo-cli` 即可安装。

如果您之前没有创建过 Expo 帐户，则会在运行 build 命令时要求您创建一个。

### 配置app.json
在 config 目录配置，如：

```json
rn: {
    appJson: {
	   "expo": {
	    "name": "Your App Name",
	    "icon": "./path/to/your/app-icon.png",
	    "version": "1.0.0",
	    "slug": "your-app-slug",
	    "sdkVersion": "XX.0.0",
	    "ios": {
	      "bundleIdentifier": "com.yourcompany.yourappname"
	    },
	    "android": {
	      "package": "com.yourcompany.yourappname"
	    }
	   }
	 }
  }
```

Taro 会读取 appJson 字段的内容且自动覆盖到 .rn_temp/app.json。

- iOS bundleIdentifier 和 Android package 字段使用反向 DNS 表示法，但不必与域相关。替换 "com.yourcompany.yourappname" 为您的应用程序有意义的任何内容。
- 你可能并不感到惊讶 name，icon 并且 version 是必需的。
- slug是您的应用程序的 JavaScript 发布到的网址名称。例如：expo.io/@community/native-component-list，community 我的用户名在哪里，native-component-list 是 slug。

### 开始构建
运行 `expo build:android`或 `expo build:ios`。如果你还没有为此项目运行的打包程序，exp 则会为你启动一个打包程序。

#### Android 应用构建
第一次构建项目时，系统会询问您是否要上传密钥库。如果你不知道密钥库是什么，你可以让 expo 生成一个，或者你也可以上传自己的。

```shell
➜  .rn_temp git:(master) ✗ expo build:android
[19:23:07] Making sure project is set up correctly...
[19:23:11] Your project looks good!
[19:23:13] Checking if current build exists...

[19:23:14] No currently active or previous builds for this project.

? Would you like to upload a keystore or have us generate one for you?
If you don't know what this means, let us handle it! :)

  1) Let Expo handle the process!
  2) I want to upload my own keystore!
  Answer:
```


如果您选择让 Expo 为您生成密钥库，我们强烈建议您稍后运行 `expo fetch:android:keystore` 并将密钥库备份到安全位置。将应用程序提交到 Google Play 商店后，该应用的所有未来更新都必须使用相同的密钥库进行签名才能被 Google 接受。如果您出于任何原因，将来删除项目或清除凭据，如果您尚未备份密钥库，则无法向应用程序提交任何更新。



您可能还想添加其他选项 app.json。我们只涵盖了所需要的内容。例如，有些人喜欢配置自己的内部版本号，链接方案等。我们强烈建议你阅读[使用 app.json配置](https://docs.expo.io/versions/latest/workflow/configuration.html) 完整规范。

#### iOS 应用构建
您可以选择让 exp 客户为你创建必要的凭据，同时仍然有机会提供您自己的覆盖。你的 Apple ID 和密码在本地使用，从未保存在 Expo 的服务器上。

```shell
[exp] Making sure project is set up correctly...
[exp] Your project looks good!
[exp] Checking if current build exists...

[exp] No currently active or previous builds for this project.
? How would you like to upload your credentials?
 (Use arrow keys)
❯ Expo handles all credentials, you can still provide overrides
  I will provide all the credentials and files needed, Expo does no validation
```

expo 会问你是否希望其处理你的分发证书或使用你自己的分发证书。这个与 Android 密钥库类似，如果你不知道分发证书是什么，那就让 expo 为你处理。如果你确实需要上传自己的证书，我们建议您遵循这篇 [关于制作p12文件的优秀指南](https://calvium.com/how-to-make-a-p12-file/)。

> 注意：本指南建议将 p12 的密码留空，但需要使用 p12 密码将自己的证书上传到 Expo 的服务中。请在出现提示时输入密码。

### 等待构建完成
在构建过程中，你可能会看到一下的日志：

```shell
[19:44:31] No currently active or previous builds for this project.
[19:44:33] Unable to find an existing Expo CLI instance for this directory, starting a new one...
[19:44:36] Starting Metro Bundler on port 19001.
[19:44:36] Metro Bundler ready.
[19:44:46] Tunnel ready.
[19:44:46] Publishing to channel 'default'...
[19:44:48] Building iOS bundle
[19:45:00] Building Android bundle
Building JavaScript bundle [===========================================] 100%[19:45:00] Finished building JavaScript bundle in 11492ms.
[19:45:11] Finished building JavaScript bundle in 10893ms.
[19:45:11] Analyzing assets
[19:45:20] Finished building JavaScript bundle in 9205ms.
[19:45:29] Uploading assets
Building JavaScript bundle [===========================================] 100%[19:45:29] Finished building JavaScript bundle in 8816ms.
[19:45:30] No assets changed, skipped.
[19:45:30] Processing asset bundle patterns:
[19:45:30] - /Users/chengshuai/Taro/taro-demo/.rn_temp/**/*
[19:45:30] Uploading JavaScript bundles
[19:45:44] Published
[19:45:44] Your URL is

https://exp.host/@pinescheng/tarodemo

[19:45:46] Building...
[19:45:47] Build started, it may take a few minutes to complete.
[19:45:47] You can check the queue length at
 https://expo.io/turtle-status

[19:45:47] You can monitor the build at

 https://expo.io/builds/78bd39e8-9c5c-4301-90e9-5546d2d2871b

|[19:45:47] Waiting for build to complete. You can press Ctrl+C to exit.
[19:56:57] Successfully built standalone app: https://expo.io/artifacts/3e4f6d43-7a3a-4383-964b-8355593b742d
```

当 expo 开始构建您的应用程序。您可以查看您在 [Turtle](https://expo.io/turtle-status) 状态站点上等待的时间。expo 将打印您可以访问的网址（例如expo.io/builds/some-unique-id）以查看你的构建日志。或者，你可以通过运行 `expo build:status` 来检查它。完成后，您将看到 .apk（Android）或.ipa（iOS）文件的网址。这是就是你的应用，你可以将链接复制并粘贴到浏览器中下载文件。

详细的打包教程可以查阅 expo 文档：[Building Standalone Apps](https://docs.expo.io/versions/latest/distribution/building-standalone-apps)。

### 在您的设备或模拟器上进行测试
- 您可以将其拖放.apk到Android模拟器中。这是测试构建成功的最简单方法。但这并不是最令人满意的。
- 要在 Android 设备上运行它，请确保您有一起安装 Android 平台的工具 adb，然后只需运行 `adb install app-filename.apk` 与您的设备上启用了 USB 调试和插入的设备。
- 要在 iOS 模拟器上运行它，首先通过运行使用模拟器标志构建您的 expo 项目 `expo build:ios -t simulator`，然后在运行时下载完成时给出的链接的 `tarball expo build:status`。通过运行解压缩 tar.gz 的 `tar -xvzf your-app.tar.gz`。然后你就可以通过启动 iPhone 模拟器实例，然后运行运行 `xcrun simctl install booted <app path>` 和 `xcrun simctl launch booted <app identifier>`。

## 发布

### 发布到 expo

expo 的发布教程可以查阅文档：[Publishing](https://docs.expo.io/versions/latest/guides/publishing.html)（发布到 expo 不需要先经过打包），通过 expo 客户端打开发布后的应用 CDN 链接来访问。

![通过 expo 打开一个 app](http://storage.360buyimg.com/temporary/180906-fetch-app-production.png)

发布后的应用有个专属的地址，比如应用 [Expo APIs](https://expo.io/@community/native-component-list)，通过 expo 客户端扫描页面中的二维码进行访问（二维码是个持久化地址 persistent URL）。

### 发布到应用商店

如果你需要正式发布你的独立版应用，可以把打包所得的 ipa 和 apk 发布到 Apple Store 和应用市场，详细参阅 [Distributing Your App](https://docs.expo.io/versions/latest/distribution/index.html)，后续的更新可以通过发布到 expo 更新 CDN 的资源来实现。

## 更新
### 自动更新
默认情况下，Expo会在您的应用启动时自动检查更新，并尝试获取最新发布的版本。如果有新的捆绑包，Expo将在启动体验之前尝试下载它。如果没有可用的网络连接，或者在30秒内没有完成下载，Expo将回退到加载应用程序的缓存版本，并继续尝试在后台获取更新（此时它将保存到下一个应用程序加载的缓存）。

在大多数情况下，当您想要更新应用程序时，只需从 Expo CLI 再次发布。您的用户将在下次打开应用程序时下载新的 JS。为确保您的用户能够无缝下载 JS 更新，您可能希望启用 [后台 JS 下载](https://docs.expo.io/versions/v31.0.0/guides/offline-support.html)。但是，有几个原因可能导致您需要重建并重新提交本机二进制文件：

- 如果要更改应用程序名称或图标等本机元数据
- 如果您升级到较新 sdkVersion 的应用程序（需要新的本机代码）

要跟踪这一点，您还可以更新二进制文件的 [versionCode](https://docs.expo.io/versions/v31.0.0/workflow/configuration.html#versioncode) 和 [buildNumber](https://docs.expo.io/versions/v31.0.0/workflow/configuration.html#buildnumber)。浏览 [app.json 文档](https://docs.expo.io/versions/v31.0.0/workflow/configuration.html) 以了解您可以更改的所有属性是一个好主意，例如图标，深层链接 URL 方案，手机/平板电脑支持等等。

### 禁用更新
通过在app.json中设置，updates.enabled可以false在独立应用程序中完全禁用OTA JavaScript更新。这将忽略从Expo服务器获取应用程序包的所有代码路径。在这种情况下，您的应用的所有更新都需要通过iOS App Store和/或Google Play商店进行路由。

## 常见错误

### No bundle url present

导致这个报错的原因很多，最常见的是电脑开了代理。具体可以参考 [#12754](https://github.com/facebook/react-native/issues/12754)

### UnableToResolveError: Unable to resolve module `AccessibilityInfo`

原因很多，我这边是重启电脑就好了😂。 具体可以查看 [#14209](https://github.com/facebook/react-native/issues/14209)

### Metro Bundler error: Expected path […] to be relative to one of the project roots

不支持 `npm link`，可以使用[nicojs/node-install-local](https://github.com/nicojs/node-install-local) 替代。

### Image component does not resolve images with filenames that include '@' symbol
![image](https://user-images.githubusercontent.com/22125059/44312799-373dee80-a3d4-11e8-8367-9cf44e851739.PNG)

React Native 不支持路径中带 @ 符号，具体可以查看 [#14980](https://github.com/facebook/react-native/issues/14980)。

### The development server returned response error code 500
![image](https://user-images.githubusercontent.com/25324938/41452372-42c1e766-708f-11e8-96ce-323eaa1eb03f.jpeg)
多半是依赖的问题，进入 `.rn_temp/`目录，然后删除 npm 依赖，在重新安装就可以了。
也可以试一下以下命令：

```shell
watchman watch-del-all 
rm -rf node_modules && npm install 
rm -fr $TMPDIR/react-*
```

具体可以参考 [#1282](https://github.com/expo/expo/issues/1282)

### Expo client app 加载阻塞： "Building JavaScript bundle... 100%" 
![image](https://user-images.githubusercontent.com/9441951/47762170-7bb00980-dcf6-11e8-95ab-41152076c3de.png)

可能的原因很多，可以参考这个issue：[react-community/create-react-native-app#392](https://github.com/react-community/create-react-native-app/issues/392)

## 参考

-  [expo 官方文档](https://docs.expo.io/versions/latest/)
- [React Native Debugger ](https://github.com/jhen0409/react-native-debugger)
- [Building Standalone Apps](https://docs.expo.io/versions/latest/distribution/building-standalone-apps)
- [Publishing on Expo](https://blog.expo.io/publishing-on-exponent-790493660d24)

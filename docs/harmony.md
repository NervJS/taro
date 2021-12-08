---
title: 鸿蒙 & OpenHarmony
---

:::info
Taro v3.5+ 开始支持
:::

## 背景阅读

随着鸿蒙系统的日渐完善，众多应用厂商都逐步推出了适配的鸿蒙应用，Taro 作为一个开放式的 跨端跨框架 解决方案，不少开发者期待将小程序的能力移植到鸿蒙上，可以使用 Taro 开发鸿蒙 && OpenHarmony 应用。经过前期调研，我们发现可以沿用 Taro 现有的架构来适配鸿蒙。

### 鸿蒙与小程序

同小程序一样，开发框架方面，我们支持 React & Vue 框架编译到鸿蒙应用。调试以及查看运行效果依赖鸿蒙提供的 DevEco Studio IDE，安装 IDE 、准备环境是适配的前提。

为了更好的体验，Taro 在组件、API、路由等方面沿用微信小程序规范，尽可能的让开发者无感知的适配，但是也存在一些暂时无法解决的差异需要注意。

## 配置鸿蒙环境

首先要准备鸿蒙运行所需的环境，根据参考文档提示的步骤在 HUAWEI DevEco Studio 的 IDE 中完成 MyApplication 项目的创建，熟悉鸿蒙开发者工具的预览查看等功能。 
### 1. 安装、配置 DevEco Studio

（1）登录 [HarmonysOS 应用开发门户](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.harmonyos.com%2Fcn%2Fhome)，点击右上角注册按钮，注册开发者帐号

（2）进入 [HUAWEI DevEco Studio 产品页](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.harmonyos.com%2Fcn%2Fdevelop%2Fdeveco-studio)，登录华为开发者账号后下载 DevEco Studio 安装包并进行安装

（3）启动 DevEco Studio，根据工具引导下载 HarmonyOS SDK

（4）下载 HarmonyOS SDK 成功后打开设置窗口，选择 JS SDK 进行下载，可多选，目前已更新支持到 API 7

### 2. 创建 Harmony 主项目

（1）创建新项目，选择需要开发的设备，然后选择 Empty Featrue Ability(JS)，按照引导操作后一个新的项目就被创建出来了。

（2）关注目录 `entry/src/main/js/default` 下面的文件，熟悉文件结构。`pages` 目录下为页面入口，每个页面包含 .hml .css .js 文件。 `entry/src/main/config.json` 文件来设置一些全局的配置信息，[详情](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/basic-config-file-elements-0000000000034463)

### 3. 预览 & 调试

（1）DevEco Studio 支持下述方式查看运行效果，链接到鸿蒙官网查看具体步骤

a. [使用预览器 previewer](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/previewer-0000001054328973)  该功能与真机效果可能存在差异，不推荐

b. [使用模拟器](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/run_simulator-0000001053303709)  

c. [使用远程真机](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/ide-remote-real-device-0000001167977777)   提供远程真机设备供开发者使用，解决开发者没有真机的问题

c. [使用本地真机](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/run_phone_tablat-0000001064774652)   用户真机与电脑相连，打开开发者模式，即可在真机看到效果

![Untitled](https://img13.360buyimg.com/imagetools/jfs/t1/172857/29/21648/2058072/61b02582Eabe79722/80378acc6479d312.png)

(2) DevEco Studio 支持模拟器或真机进行调试

在编译器中打开 Run -> Edit Configurations 设置调试代码为 JS, 检查 config.json 中配置的属性，设置 Hap 包安装方式之后启动调试


![Untitled](https://img11.360buyimg.com/imagetools/jfs/t1/158561/21/21509/1769838/61b05362Ed0878669/35ee0cb64465d229.jpg)


### 相关阅读

[《初窥鸿蒙》](https://juejin.cn/post/6972109475347955749) [《华为开发者工具》](https://developer.harmonyos.com/cn/develop/deveco-studio)[《鸿蒙开发文档》](https://developer.harmonyos.com/cn/documentation)


## 使用 Taro 开发鸿蒙 JS UI

### 1. 安装 Taro v3.5

安装 v3.5.0-canary 的 CLI 工具

如您是新项目， 选择鸿蒙模板即可；

旧项目需要按照如下方法进行手动安装：

```
npm i -g @tarojs/cli@canary
```
然后更新项目本地的 Taro 相关依赖：把 package.json 文件中 Taro 相关依赖的版本修改为 ~3.5.0-canary.0，再重新安装依赖。

> 如果安装失败或打开项目失败，可以删除 **node_modules**、**yarn.lock**、**package-lock.json** 后重新安装依赖再尝试。

### 2. 安装 Taro 适配鸿蒙插件


```
$ yarn add --dev @tarojs/plugin-platform-harmony
```

### 3. 修改 Taro 编译配置

在 Taro 项目中的 config/index.js 文件中增加鸿蒙编译所需配置

```
// config/index.js
config = {
  // 配置使用插件
  plugins: ['@tarojs/plugin-platform-harmony'],
  mini: {
    // 如果使用开发者工具的预览器（previewer）进行预览的话，需要使用 development 版本的 react-reconciler。
    // 因为 previewer 对长串的压缩文本解析有问题。（真机/远程真机没有此问题）
    debugReact: true,
    // 如果需要真机断点调试，需要关闭 sourcemap 的生成
    enableSourceMap: false
  },
  // harmony 相关配置
  harmony: {
    // 【必填】鸿蒙应用的绝对路径
    projectPath: path.resolve(process.cwd(), '../MyApplication'),
    // 【可选】HAP 的名称，默认为 'entry'
    hapName: 'entry',
    // 【可选】JS FA 的名称，默认为 'default'
    jsFAName: 'default'
  }
}
```

### 4. 修改鸿蒙主项目的配置

根据项目需要在鸿蒙主项目 `entry/src/main/config.json` 中配置信息，如页面路径信息，系统能力特性等等

### 5. 编译运行

执行下面命令，Taro 可将打包结果生成到配置的鸿蒙主项目路径中，支持热更新

```
$ taro build —type harmony —watch
```

### 6. 预览 & 调试

开发者可根据上面运行鸿蒙 demo 项目的方式进行预览与调试

## 注意事项

1、鸿蒙目前支持部分 css 属性，且无盒子模型，样式方面需要开发者调整适配。

2、遇到问题，注意查看 DevEco Studio 中的报错提示。

3、Taro 虽然尽可能适配了组件和 API 到小程序规范，但还有部分功能依赖底层的能力暂时不实现或实现不了。对应信息可查看 xxx

4、sdk 6  sdk 7 

5、尺寸

6、navbar、tabbar

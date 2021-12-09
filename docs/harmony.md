---
title: 鸿蒙 & OpenHarmony
---

:::info
Taro v3.5+ 开始支持
:::


随着鸿蒙系统的日渐完善，众多应用厂商都期待着把自家应用移植到鸿蒙平台上。借助 Taro，可以实现快速开发鸿蒙应用、把小程序快速转换为鸿蒙应用等功能。

## 背景阅读

鸿蒙 & OpenHarmony 相关背景知识简介。

### 鸿蒙与 OpenHarmony

> 摘录自 [《关于规范 HarmonyOS 沟通口径的通知》](https://www.google.com/search?q=%E5%85%B3%E4%BA%8E%E8%A7%84%E8%8C%83HarmonyOS%E6%B2%9F%E9%80%9A%E5%8F%A3%E5%BE%84%E7%9A%84%E9%80%9A%E7%9F%A5&oq=%E5%85%B3%E4%BA%8E%E8%A7%84%E8%8C%83HarmonyOS%E6%B2%9F%E9%80%9A%E5%8F%A3%E5%BE%84%E7%9A%84%E9%80%9A%E7%9F%A5&aqs=chrome..69i57.670j0j4&sourceid=chrome&ie=UTF-8)
>
> 为方便描述，本文档把这三者统一称作“鸿蒙”

1、**鸿蒙操作系统**是华为研发的智能终端操作系统。

2、华为已把该智能终端操作系统的基础能力全部捐献给开放原子开源基金会，由开放原子开源基金会整合其他参与者的贡献，形成 [OpenHarmony](https://gitee.com/openharmony) 开源项目，最新的版本为 OpenHarmony 3.0。

3、[HarmonyOS](https://developer.harmonyos.com/) 是华为基于开源项目 OpenHarmony 开发的商用版本。

### 鸿蒙应用开发导读

建议开发前首先阅读 [《鸿蒙应用开发导读》](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/document-outline-0000001064589184) 部分，有助于对鸿蒙整体结构有一定了解。

鸿蒙应用程序包结构：

![](https://alliance-communityfile-drcn.dbankcdn.com/FileServer/getFile/cmtyPub/011/111/111/0000000000011111111.20211022162223.15380198014131508266643108297125:50521021083943:2800:715DAE3A069F85E3220BE8D812C4A282C948D63E7D4AF7192CB335DA55C4A983.png?needInitFileName=true?needInitFileName=true)

### 鸿蒙与小程序

鸿蒙 FA（Feature Ability）支持使用 JS 或 JAVA 开发 UI。而 JS UI 的开发范式类似于小程序，这也给 Taro 适配鸿蒙提供了一个很好的切入点。

#### 鸿蒙 JS UI 与小程序写法的主要异同

1. 项目组织

鸿蒙的项目组织和小程序类似，有入口文件 `app.js`、页面、自定义组件。

其中页面、自定义组件均由三类文件组成：

- `.hml` 用来描述布局结构。与小程序的模板文件相比，语法、支持的能力有少许区别。
- `.css` 用来描述页面样式。
- `.js` 用于处理页面和用户的交互，默认支持 ES6 语法。

2. 配置文件

和小程序规定的入口文件、页面文件、自定义组件各自对应一份配置文件不一样，鸿蒙 JS UI 的配置文件只有一份。

鸿蒙的**路由**和小程序一样是配置式的，需要在 JS UI 的配置文件中进行配置。

3. 样式

CSS 方面，鸿蒙和 RN 一样有着诸多限制。例如不支持盒子模型、各组件只支持部分 CSS 属性等。

4. 组件 & API

鸿蒙提供了一系列功能丰富的组件，与小程序的组件相比，命名、功能上略有差别。

API 也是一样，两者的 API 有部分交集，可用法、功能上也有差别。

## 配置鸿蒙环境

首先要准备鸿蒙运行所需的环境，根据参考文档提示的步骤在 HUAWEI DevEco Studio 的 IDE 中完成 MyApplication 项目的创建，熟悉鸿蒙开发者工具的预览查看等功能。 
### 1. 安装、配置 DevEco Studio

（1）登录 [HarmonysOS 应用开发门户](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.harmonyos.com%2Fcn%2Fhome)，点击右上角注册按钮，注册开发者帐号。

（2）进入 [HUAWEI DevEco Studio 产品页](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.harmonyos.com%2Fcn%2Fdevelop%2Fdeveco-studio)，登录华为开发者账号后下载 DevEco Studio 安装包并进行安装。

（3）启动 DevEco Studio，根据工具引导下载 HarmonyOS SDK。

（4）下载 HarmonyOS SDK 成功后打开设置窗口，选择 JS SDK 进行下载，可多选，目前已更新支持到 API 7。

### 2. 创建 Harmony 主项目

（1）创建新项目，选择需要开发的设备，然后选择 Empty Featrue Ability(JS)，按照引导操作后一个新的项目就被创建出来了。

（2）关注目录 `entry/src/main/js/default` 下面的文件，熟悉文件结构。`pages` 目录下为页面入口，每个页面包含 `.hml`、`.css`、`.js` 文件。全局配置位于 `entry/src/main/config.json`，[配置详情](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/basic-config-file-elements-0000000000034463)。

### 3. 预览 & 调试

（1）DevEco Studio 支持下述方式查看运行效果，链接到鸿蒙官网查看具体步骤

a. [使用预览器 previewer](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/previewer-0000001054328973)  该功能与真机效果可能存在差异，不推荐

b. [使用模拟器](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/run_simulator-0000001053303709)  

c. [使用远程真机](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/ide-remote-real-device-0000001167977777)   提供远程真机设备供开发者使用，解决开发者没有真机的问题

c. [使用本地真机](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/run_phone_tablat-0000001064774652)   用户真机与电脑相连，打开开发者模式，即可在真机看到效果

![示例图](https://img13.360buyimg.com/imagetools/jfs/t1/172857/29/21648/2058072/61b02582Eabe79722/80378acc6479d312.png)

(2) DevEco Studio 支持模拟器或真机进行调试

在编译器中打开 Run -> Edit Configurations 设置调试代码为 JS, 检查 config.json 中配置的属性，设置 Hap 包安装方式之后启动调试


![示例图](https://img11.360buyimg.com/imagetools/jfs/t1/158561/21/21509/1769838/61b05362Ed0878669/35ee0cb64465d229.jpg)


### 相关阅读

- [《初窥鸿蒙》](https://juejin.cn/post/6972109475347955749)
- [《华为开发者工具》](https://developer.harmonyos.com/cn/develop/deveco-studio)
- [《鸿蒙开发文档》](https://developer.harmonyos.com/cn/documentation)


## 使用 Taro 开发鸿蒙 JS UI

### 1. 安装 Taro v3.5

#### CLI

安装 `v3.5.0-canary.0` 版本的 Taro CLI：

```bash
npm i -g @tarojs/cli@canary
```

#### 项目依赖

如您是新项目，创建项目时选择鸿蒙模板即可；

旧项目需要把 `package.json` 文件中 Taro 相关依赖的版本修改为 `~3.5.0-canary.0`，再重新安装依赖。

> 如果安装失败或打开项目失败，可以删除 **node_modules**、**yarn.lock**、**package-lock.json** 后重新安装依赖再尝试。

### 2. 安装 Taro 适配鸿蒙插件

```bash
$ npm i @tarojs/plugin-platform-harmony
```

### 3. 修改 Taro 编译配置

```js title="config/index.js"
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
    // 【必填】鸿蒙主应用的绝对路径，例如：
    projectPath: path.resolve(process.cwd(), '../MyApplication'),
    // 【可选】HAP 的名称，默认为 'entry'
    hapName: 'entry',
    // 【可选】JS FA 的名称，默认为 'default'
    jsFAName: 'default'
  }
}
```

### 4. 修改鸿蒙主项目的配置

根据项目需要在鸿蒙主项目 `entry/src/main/config.json` 中配置信息，如页面路径信息，系统能力特性等等。

### 5. 编译运行

执行下面命令，Taro 可将打包结果生成到配置的鸿蒙主项目路径中。

```bash
$ taro build —type harmony —watch
```

### 6. 预览 & 调试

开发者可根据上面运行鸿蒙 demo 项目的方式进行预览与调试

## 注意事项

### 样式

#### 通用样式与组件样式

鸿蒙目前只支持部分 CSS 属性。[通用样式](https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-components-common-styles-0000001050791158)指所有组件都支持的样式，而各组件又支持各种不同的样式属性。

#### 布局

鸿蒙没有实现盒子模型，开发者可以使用 **flex** 或 **grid** 进行布局。

#### 尺寸单位

鸿蒙的尺寸单位有 `px`、`vp`、`fp`，其中 `px` 在不同配置下有不同表现。

各端尺寸单位对比：

| 平台 | 逻辑像素单位 | 自适应单位 | 尺寸基准 |
| :-- | :-- | :-- | :-- |
| H5 | px | rem |  |
| 小程序 | px | rpx | 750 |
| Harmony（autoDesignWidth：false） | vp | px | 720 |
| Harmony（autoDesignWidth：true） | px/vp |  | 720 |

为了更好地兼容现有生态，Taro 在编译鸿蒙时会把鸿蒙配置中的 `autoDesignWidth` 设置为 `false`，把 `designWidth` 设置为 `750`。开发者和过去编写 Taro 应用一样：如果拿到的是 `750` 的设计稿，对于设计稿上 `200px` 的元素：如果样式中直接书写 `200px` 会被 Taro 编译为 `200px`，**尺寸随屏幕宽度变化而自适应**；如果样式中书写 `100PX` 会被 Taro 编译为 `100vp`，在 750 的屏幕上等于 `200px`，**尺寸不会随屏幕宽度变化而改变**。

### 调试

- 报错时 `previewer` 往往会白屏，因此推荐使用 `previewer` 调试样式，而使用真机调试逻辑问题。
- `console.log` 不能打印对象，需要使用 `JSON.stringify` 先转换为字符串，较复杂的问题建议使用真机断点调试。

### SDK 版本问题

鸿蒙 JS UI 主要有三个 SDK 版本：API5、API6、API7。（可以理解为小程序基础库）

Taro 支持 **API6** 和 **API7** 版本，但两者各有一些问题：

- API6 重复跳转同一页面会白屏（API7 不存在）
- API7 点击存在问题（API6 不存在，正在沟通解决）

### 与小程序的差异

- Taro 虽然尽可能遵循小程序规范适配了组件和 API 库，但还有部分功能依赖底层的能力暂时不实现或实现不了。详细信息可查阅 [Harmony Project](https://github.com/NervJS/taro/projects/2)
- 只有在 `<Text>` 组件中，才能渲染文本。
- 鸿蒙没有提供原生的导航栏，因此只能去模拟实现，目前右上角胶囊按钮的对应功能还没实现。
- 鸿蒙没有提供原生的 Tabbar，也是只能去进行模拟。由因为性能问题，目前使用了 `navigateTo` 代替 `SwitchTab`。

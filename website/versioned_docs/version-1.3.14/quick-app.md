---
title: 快应用端开发流程
id: version-1.3.14-quick-app
original_id: quick-app
---

> 从 **1.3 beta** 版本开始支持快应用开发<br/>
> 本章节主要讲解快应用端 环境安装-开发-调试-打包-发布 原理及流程

## 简介

Taro 支持快应用端开发

## 安装

### 搭建快应用环境

#### 手机安装调试器

调试器是一个 Android 应用程序，下载调试器 APK 详见[资源下载](https://www.quickapp.cn/docCenter/post/69)

在手机上安装并打开调试器，按钮功能如下：

* **扫码安装**：配置 HTTP 服务器地址，下载 rpk 包，并唤起平台运行 rpk 包
* **本地安装**：选择手机文件系统中的 rpk 包，并唤起平台运行 rpk 包
* **在线更新**：重新发送 HTTP 请求，更新 rpk 包，并唤起平台运行 rpk 包
* **开始调试**：唤起平台运行 rpk 包，并启动远程调试
**注意**：若打开调试器无法点击按钮，请升级手机系统到最新版本或安装平台预览版

安装成功后如下图所示：

![img](https://doc.quickapp.cn/tutorial/overview/images/img2.png)

#### 手机安装平台预览版

较新的系统版本中内置平台正式版，开发调试平台新功能可使用平台预览版

平台预览版存在以下优缺点：

* 优点：迭代速度快，可立即体验平台新功能
* 缺点：实现与真实的运行环境存在差异，对厂商服务和第三方服务的支持存在缺陷
平台预览版是一个 Android 应用程序，下载平台预览版 APK 详见[资源下载](https://www.quickapp.cn/docCenter/post/69)

下载安装成功后，在手机调试器中点击切换运行平台至org.hapjs.mockup，即可在平台预览版上安装运行 rpk 包

### 开发调试

在手机上安装完调试器后，就可以执行 Taro 的快应用编译命令开始编译了

```bash
$ taro build --type quickapp --watch
```

在编译完成后会遇到如下输出结果

![](https://ws1.sinaimg.cn/large/49320207gy1g2qeziw5ouj218m0vewkd.jpg)

Taro 在将代码编译完后，会自动下载快应用的容器模板，同时安装好相关的依赖，随后就会自动启动快应用的服务，此时，只需要使用手机上安装的调试器扫码就能直接在手机上进行调试了。

### 使用 IDE

https://doc.quickapp.cn/tutorial/ide/overview.html

### 快应用配置

在 Taro 编译适配快应用需要进行一些配置，可以通过在项目根目录下添加 `project.quickapp.json` 大体的配置项可以参考快应用官方文档的 [manifest 配置](https://doc.quickapp.cn/framework/manifest.html)，而 Taro 中支持以下配置：

|属性|类型|默认值|必填|描述|
| :-----| :---- | :---- | :---- | :---- |
|package|String|-|是|应用包名，确认与原生应用的包名不一致，推荐采用 com.company.module 的格式，如：com.example.demo|
|name|String|-|是|应用名称，6 个汉字以内，与应用商店保存的名称一致，用于在桌面图标、弹窗等处显示应用名称|
|icon|String|-|是|应用图标，提供 192x192 大小的即可|
|versionName|String|-|否|应用版本名称，如："1.0"|
|versionCode|Integer|-|是|应用版本号，从1自增，推荐每次重新上传包时versionCode+1|
|minPlatformVersion|Integer|-|否|支持的最小平台版本号，兼容性检查，避免上线后在低版本平台运行并导致不兼容；如果不填按照内测版本处理|
|features|Array|-|否|接口列表，绝大部分接口都需要在这里声明，否则不能调用，详见每个接口的文档说明|
|config|Object|-|是|系统配置信息，详见[说明](https://doc.quickapp.cn/framework/manifest.html#config)|
|subpackages `1040+`|Object|-|否|定义并启用分包加载，详见[说明](https://doc.quickapp.cn/framework/manifest.html#subpackages)|

可以看出，相比于快应用官方的配置项，Taro 中支持的配置项缺少了 [router](https://doc.quickapp.cn/framework/manifest.html#router) 与 [display](https://doc.quickapp.cn/framework/manifest.html#display) 配置，这是因为这两项配置在 Taro 编译时会根据用户代码直接生成，不再需要额外配置。

而为了让用户更加方便进行快应用相关配置，Taro 增加了一些额外的配置项，例如：

`customPageConfig` 是为了让用户可以为每个页面配置快应用独有的 `filter` 与 `launchMode` 它直接配置在 `project.quickapp.json` 中，它是一个对象的类型，其 key 值即为页面路径，与 **入口文件** 中 `config` 下 `pages` 数组中配置的页面路径保持一致，常见例子如下

```json
{
  "customPageConfig": {
    "pages/index/index": {
      "filter": {
        "<action>": {
          "uri": "<pattern>"
        }
      },
      "launchMode": "standard"
    }
  }
}
```

一个典型的 `project.quickapp.json` 配置参考[例子](https://github.com/NervJS/taro/blob/master/packages/taro-cli/src/config/manifest.default.json)

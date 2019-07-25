---
title: 快应用端开发流程
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
